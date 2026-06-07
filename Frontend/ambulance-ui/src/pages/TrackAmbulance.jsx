import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { calculateEta } from "../utils/distance";
import { showToast } from "../utils/toast";
import Loader from "../components/Loader";

const statuses = ["REQUESTED", "ACCEPTED", "ON_THE_WAY", "ARRIVED", "COMPLETED"];

export default function TrackAmbulance() {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [statusIndex, setStatusIndex] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const mapRef = useRef(null);
  const routeRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!booking) {
      const stored = window.localStorage.getItem("smart_ambulance_last_booking");
      if (stored) {
        setBooking(JSON.parse(stored));
      } else {
        navigate("/book-ambulance");
      }
    }
  }, [booking, navigate]);

  useEffect(() => {
    if (!booking) return;
    let interval = null;

    interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 6);
        return next;
      });
    }, 700);

    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev < statuses.length - 1) {
          return prev + 1;
        }
        clearInterval(statusTimer);
        return prev;
      });
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(statusTimer);
    };
  }, [booking]);

  useEffect(() => {
    if (!booking) return;
    if (!booking.pickupLocation || !booking.hospital || !booking.ambulance) return;

    const container = L.DomUtil.get("track-map");
    if (container != null) container._leaflet_id = null;

    const map = L.map("track-map", { zoomControl: false }).setView([
      booking.pickupLocation.lat,
      booking.pickupLocation.lng,
    ], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.marker([booking.pickupLocation.lat, booking.pickupLocation.lng], {
      title: "Pickup Location",
    })
      .addTo(map)
      .bindPopup("Pickup location")
      .openPopup();

    L.marker([booking.hospital.lat, booking.hospital.lng], {
      title: booking.hospital.name,
    })
      .addTo(map)
      .bindPopup(booking.hospital.name);

    markerRef.current = L.marker([booking.ambulance.lat, booking.ambulance.lng], {
      title: `Ambulance ${booking.ambulance.id}`,
    }).addTo(map);

    routeRef.current = L.polyline(
      [
        [booking.ambulance.lat, booking.ambulance.lng],
        [booking.pickupLocation.lat, booking.pickupLocation.lng],
        [booking.hospital.lat, booking.hospital.lng],
      ],
      { color: "#ff4757", weight: 4, dashArray: "8" }
    ).addTo(map);

    mapRef.current = map;
    setMapReady(true);

    return () => map.remove();
  }, [booking]);

  useEffect(() => {
    if (!mapRef.current || !booking) return;
    const interpolation = statusIndex / (statuses.length - 1);
    const start = [booking.ambulance.lat, booking.ambulance.lng];
    const end = [booking.pickupLocation.lat, booking.pickupLocation.lng];
    const lat = start[0] + (end[0] - start[0]) * interpolation;
    const lng = start[1] + (end[1] - start[1]) * interpolation;
    markerRef.current?.setLatLng([lat, lng]);
    routeRef.current?.setLatLngs([[lat, lng], end, [booking.hospital.lat, booking.hospital.lng]]);
    mapRef.current?.panTo([lat, lng]);
  }, [statusIndex, booking]);

  if (!booking) {
    return <Loader message="Loading booking details..." />;
  }

  const statusLabel = statuses[statusIndex];
  const eta = calculateEta(getDistance(booking.ambulance.lat, booking.ambulance.lng, booking.pickupLocation.lat, booking.pickupLocation.lng));

  function getDistance(lat1, lng1, lat2, lng2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  return (
    <div className="track-page page-layout">
      <div className="track-header glass-card">
        <div>
          <span className="eyebrow">Live tracking</span>
          <h2>Ambulance status: {statusLabel}</h2>
          <p>The ambulance is en route to your pickup location.</p>
        </div>
        <div className="status-panel">
          <div className="status-badge">ETA: {eta} min</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      <div className="track-grid">
        <div className="track-map-panel glass-card">
          <div id="track-map" className="map-view" />
          {!mapReady && <Loader message="Starting live map..." />}
        </div>
        <div className="track-details glass-card">
          <div className="detail-block">
            <h5>Ambulance</h5>
            <p>Unit #{booking.ambulance.id}</p>
          </div>
          <div className="detail-block">
            <h5>Hospital</h5>
            <p>{booking.hospital.name}</p>
          </div>
          <div className="detail-block">
            <h5>Emergency</h5>
            <p>{booking.emergencyLevel}</p>
          </div>
          <button className="btn btn-danger btn-block" onClick={() => showToast("Tracking updated in real time.", "success")}>Refresh status</button>
        </div>
      </div>
    </div>
  );
}
