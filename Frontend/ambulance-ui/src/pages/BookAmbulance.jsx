import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../context/AuthContext";
import { fetchNearbyAmbulances } from "../api/ambulance";
import { createBookingRequest } from "../api/bookings";
import { getDistanceHaversine, calculateEta } from "../utils/distance";
import { hospitals } from "../utils/hospitals";
import { showToast } from "../utils/toast";
import AmbulanceCard from "../components/AmbulanceCard";
import HospitalList from "../components/HospitalList";
import BookingForm from "../components/BookingForm";
import Loader from "../components/Loader";

const fallbackAmbulances = (lat, lng) => {
  return Array.from({ length: 6 }, (_, index) => {
    const offset = (index + 1) * 0.005;
    return {
      id: index + 1,
      lat: lat + (Math.random() - 0.5) * offset,
      lng: lng + (Math.random() - 0.5) * offset,
      status: "Available",
    };
  });
};

export default function BookAmbulance() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(hospitals[0]);
  const [emergencyLevel, setEmergencyLevel] = useState("HIGH");
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const mapRef = useRef(null);
  const ambulanceMarkers = useRef([]);

  useEffect(() => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.", "danger");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(coords);
        try {
          const remoteAmbulances = await fetchNearbyAmbulances(coords.lat, coords.lng);
          const enriched = (Array.isArray(remoteAmbulances) ? remoteAmbulances : fallbackAmbulances(coords.lat, coords.lng)).map((item) => {
            const distance = getDistanceHaversine(coords.lat, coords.lng, item.lat, item.lng);
            return {
              ...item,
              distance,
              eta: calculateEta(distance),
            };
          });
          enriched.sort((a, b) => a.distance - b.distance);
          setAmbulances(enriched);
          setSelectedAmbulance(enriched[0] || null);
        } catch (error) {
          const fallback = fallbackAmbulances(coords.lat, coords.lng).map((item) => ({
            ...item,
            distance: getDistanceHaversine(coords.lat, coords.lng, item.lat, item.lng),
            eta: calculateEta(getDistanceHaversine(coords.lat, coords.lng, item.lat, item.lng)),
          }));
          setAmbulances(fallback);
          setSelectedAmbulance(fallback[0]);
          showToast("Unable to fetch nearby ambulances. Showing mock units.", "warning");
        } finally {
          setLoading(false);
        }
      },
      () => {
        showToast("Please allow location access to book an ambulance.", "danger");
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!userLocation || ambulances.length === 0) return;

    const container = L.DomUtil.get("booking-map");
    if (container != null) container._leaflet_id = null;

    const map = L.map("booking-map", {
      zoomControl: false,
    }).setView([userLocation.lat, userLocation.lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.marker([userLocation.lat, userLocation.lng], {
      title: "Your location",
    })
      .addTo(map)
      .bindPopup("You are here")
      .openPopup();

    ambulanceMarkers.current = ambulances.map((ambulance) => {
      return L.marker([ambulance.lat, ambulance.lng], {
        title: `Ambulance ${ambulance.id}`,
      })
        .addTo(map)
        .bindPopup(`Ambulance ${ambulance.id} - ${ambulance.eta} min`);
    });

    mapRef.current = map;
    setMapLoading(false);

    return () => {
      map.remove();
    };
  }, [userLocation, ambulances]);

  const handleBooking = async ({ emergencyLevel, hospital, notes }) => {
    if (!selectedAmbulance) {
      showToast("Choose an ambulance before booking.", "danger");
      return;
    }

    if (!hospital) {
      showToast("Select a hospital to continue.", "danger");
      return;
    }

    setLoading(true);
    try {
      const userId = user?.id || user?.userId || user?.sub;
      const payload = {
        userId,
        pickupLat: userLocation.lat,
        pickupLng: userLocation.lng,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        hospitalLat: hospital.lat,
        hospitalLng: hospital.lng,
        emergencyLevel,
        ambulanceId: selectedAmbulance.id,
        notes,
      };

      const booking = await createBookingRequest(payload);
      window.localStorage.setItem("smart_ambulance_last_booking", JSON.stringify({ ...booking, pickupLocation: userLocation, hospital, ambulance: selectedAmbulance }));
      showToast("Ambulance booked successfully!", "success");
      navigate("/track", { state: { booking: { ...booking, pickupLocation: userLocation, hospital, ambulance: selectedAmbulance } } });
    } catch (error) {
      showToast("Booking request failed. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page page-layout">
      <div className="page-head">
        <div>
          <span className="eyebrow">Live ambulance booking</span>
          <h2>Fast booking with nearby ambulances</h2>
          <p>Select emergency level, hospital, and confirm your pickup instantly.</p>
        </div>
        <div className="status-chip">{ambulances.length} ambulances nearby</div>
      </div>
      {loading && <Loader message="Searching nearby ambulances..." />}
      {!loading && (
        <div className="booking-grid">
          <section className="booking-map-panel glass-card">
            {mapLoading ? (
              <Loader message="Preparing map..." />
            ) : (
              <div id="booking-map" className="map-view" />
            )}
            <div className="nearby-list">
              {ambulances.map((ambulance) => (
                <AmbulanceCard
                  key={ambulance.id}
                  ambulance={ambulance}
                  selected={selectedAmbulance?.id === ambulance.id}
                  onSelect={setSelectedAmbulance}
                />
              ))}
            </div>
          </section>
          <aside className="booking-sidebar glass-card">
            <div className="booking-panel-head">
              <h3>Your next ambulance</h3>
              <p>Nearest ambulance arrives in {selectedAmbulance?.eta || "--"} minutes.</p>
            </div>
            <div className="hospital-panel">
              <h4>Choose hospital</h4>
              <HospitalList hospitals={hospitals} selectedHospital={selectedHospital} onSelect={setSelectedHospital} />
            </div>
            <BookingForm
              onSubmit={handleBooking}
              selectedHospital={selectedHospital}
              emergencyLevel={emergencyLevel}
              setEmergencyLevel={setEmergencyLevel}
              loading={loading}
            />
          </aside>
        </div>
      )}
    </div>
  );
}
