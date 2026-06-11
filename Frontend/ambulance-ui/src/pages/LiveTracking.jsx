import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { showToast } from "../utils/toast";
import Loader from "../components/Loader";

export default function LiveTracking() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Try to load booking data from component state router or fallback to LocalStorage on manual reload
  const [booking, setBooking] = useState(() => {
    return location.state?.booking || 
           JSON.parse(window.localStorage.getItem("smart_ambulance_last_booking")) || 
           null;
  });

  const [ambulanceCoords, setAmbulanceCoords] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef(null);
  const ambulanceMarkerRef = useRef(null);
  const socketRef = useRef(null);

  // Redirect if no active booking tracking context exists
  useEffect(() => {
    if (!booking) {
      showToast("No active booking tracking found.", "warning");
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [booking, navigate]);

  // ==========================================
  // ⚡ ENGINE 1: Safe Real-time WebSockets
  // ==========================================
  useEffect(() => {
    if (!booking) return;

    let isComponentMounted = true;

    const connectWebSocket = () => {
      console.log("🔌 Connecting to Ambulance Tracking Gateway...");
      const socket = new WebSocket("ws://localhost:8080/ambulance-tracking");
      socketRef.current = socket;

      socket.onopen = () => {
        if (!isComponentMounted) {
          socket.close();
          return;
        }
        console.log("⚡ WebSocket Grid Connected successfully!");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📍 Live Coordinates Received:", data);
          
          // Verify coordinates are targeting this current dispatch asset
          if (data.latitude && data.longitude && data.bookingId === booking.id) {
            setAmbulanceCoords({ lat: data.latitude, lng: data.longitude });
          }
        } catch (err) {
          console.error("Error reading socket frame data stream:", err);
        }
      };

      socket.onerror = (error) => {
        console.error("❌ WebSocket Link Error encountered:", error);
      };

      socket.onclose = (e) => {
        console.log(`🔌 WebSocket Link severed. Code: ${e.code}`);
        // Optional: Reconnect logic if connection drops unexpectedly
        if (isComponentMounted && e.code !== 1000) {
          setTimeout(connectWebSocket, 3000);
        }
      };
    };

    connectWebSocket();

    return () => {
      isComponentMounted = false;
      if (socketRef.current) {
        console.log("🧼 Cleaning up active socket instance...");
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [booking]);

  // ==========================================
  // 🗺️ ENGINE 2: Safe Leaflet Map Management
  // ==========================================
  useEffect(() => {
    if (loading || !booking) return;

    const pickup = booking.pickupLocation || { lat: 16.6914, lng: 74.4667 };
    const hospital = booking.hospital || {};

    // 1. Clean up residual elements safely to eliminate the '_leaflet_pos' property crash
    const container = L.DomUtil.get("tracking-map");
    if (container != null) {
      container._leaflet_id = null;
    }

    // 2. Setup the map instance
    const map = L.map("tracking-map", { zoomControl: false }).setView([pickup.lat, pickup.lng], 14);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // 3. Mark User / Pickup Point Location
    L.marker([pickup.lat, pickup.lng], {
      icon: L.divIcon({
        className: "user-pin",
        html: `<span style="font-size:22px; background:white; border-radius:50%; padding:5px; border:2px solid #2a9d8f; box-shadow:0 2px 5px rgba(0,0,0,0.3); display:inline-block;">📍</span>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
    }).addTo(map).bindPopup("<b>Your Pickup Location</b>").openPopup();

    // 4. Mark Destination Hospital Location
    if (hospital.latitude && hospital.longitude) {
      L.marker([hospital.latitude, hospital.longitude], {
        icon: L.divIcon({
          className: "hospital-pin",
          html: `<span style="font-size:20px; background:white; border-radius:50%; padding:4px; border:2px solid #e63946; box-shadow:0 2px 5px rgba(0,0,0,0.3);">🏥</span>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      }).addTo(map).bindPopup(`<b>Destination: ${hospital.name}</b>`);
    }

    // 5. Build placeholder Ambulance Marker until live socket updates arrive
    const startLat = booking.ambulance?.latitude || pickup.lat + 0.005;
    const startLng = booking.ambulance?.longitude || pickup.lng + 0.005;

    const ambMarker = L.marker([startLat, startLng], {
      icon: L.divIcon({
        className: "ambulance-live-pin",
        html: `<span style="font-size:24px; background:white; border-radius:50%; padding:6px; border:2px solid #0077b6; box-shadow:0 2px 5px rgba(0,0,0,0.3); display:inline-block;">🚑</span>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })
    }).addTo(map).bindPopup(`<b>Ambulance: ${booking.vehicleNumber || "Dispatched"}</b><br/>Status: En Route`);
    
    ambulanceMarkerRef.current = ambMarker;

    // Adjust view window bounds to fit all nodes neatly
    const boundsPoints = [[pickup.lat, pickup.lng]];
    if (hospital.latitude) boundsPoints.push([hospital.latitude, hospital.longitude]);
    boundsPoints.push([startLat, startLng]);
    map.fitBounds(boundsPoints, { padding: [50, 50] });

    // Component unmount map cleanup engine hook
    return () => {
      if (mapRef.current) {
        console.log("🧼 Destroying map context layout context safely...");
        mapRef.current.remove();
        mapRef.current = null;
        ambulanceMarkerRef.current = null;
      }
    };
  }, [loading, booking]);

  // ==========================================
  // 🔄 ENGINE 3: Animate Live Ambulance Marker Updates
  // ==========================================
  useEffect(() => {
    if (ambulanceCoords && ambulanceMarkerRef.current && mapRef.current) {
      const { lat, lng } = ambulanceCoords;
      
      // Update marker coordinates instantly without recreating the element
      ambulanceMarkerRef.current.setLatLng([lat, lng]);
      
      // Pan map views smoothly with the moving vehicle asset
      mapRef.current.panTo([lat, lng]);
    }
  }, [ambulanceCoords]);

  if (loading) {
    return <Loader message="Connecting to live dispatch tracking grid..." />;
  }

  return (
    <div className="tracking-page page-layout">
      <div className="page-head">
        <div>
          <span className="eyebrow text-danger">● Emergency Dispatched Live Tracking</span>
          <h2>Your Ambulance is En Route</h2>
          <p>Tracking Unit Order ID: #{booking?.id} | Vehicle: <b>{booking?.vehicleNumber}</b></p>
        </div>
        <div className="status-chip active-pulse">Status: {booking?.status || "ASSIGNED"}</div>
      </div>

      <div className="booking-grid">
        <section className="booking-map-panel glass-card" style={{ height: "550px" }}>
          <div id="tracking-map" style={{ height: "100%", width: "100%", borderRadius: "8px" }} />
        </section>

        <aside className="booking-sidebar glass-card">
          <div className="booking-panel-head">
            <h3>Responder Details</h3>
            <p>Direct communication links to assigned dispatch units.</p>
          </div>

          <div className="driver-card p-3 my-3" style={{ background: "rgba(0,0,0,0.03)", borderRadius: "8px", borderLeft: "4px solid #0077b6" }}>
            <div className="small text-muted">ASSIGNED DRIVER</div>
            <h5 className="mb-1 mt-1">{booking?.driverName || "System Driver"}</h5>
            <div className="small">📞 {booking?.driverPhone || "Updating details..."}</div>
          </div>

          <div className="eta-panel text-center p-4" style={{ background: "linear-gradient(135deg, #0077b6, #0096c7)", color: "white", borderRadius: "8px" }}>
            <span style={{ fontSize: "2.5rem" }}>🚑</span>
            <h4 className="mt-2 mb-0">Live Coordinate Stream Active</h4>
            <p className="small text-white-50 mb-0">Awaiting GPS transmissions from driver handset...</p>
          </div>
        </aside>
      </div>
    </div>
  );
}