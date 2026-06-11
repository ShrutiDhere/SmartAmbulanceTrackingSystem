import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../utils/toast";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Keeps the hardcoded dummy list for requests not yet bound to the backend
const initialRequests = [
  {
    id: "REQ-001",
    passenger: "Ravi P.",
    pickup: "City Center",
    destination: "Central Care Hospital",
    distance: 4.8,
    emergency: "HIGH",
    status: "PENDING",
  },
  {
    id: "REQ-002",
    passenger: "Sanya K.",
    pickup: "Lakeside Mall",
    destination: "Lifeline Hospital",
    distance: 6.2,
    emergency: "MEDIUM",
    status: "PENDING",
  }
];

export default function DriverDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState(initialRequests);
  
  // Real-time tracking states
  const [activeBookingId, setActiveBookingId] = useState("3"); // Matches your patient UI screenshot
  const [isTracking, setIsTracking] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);

  // ==========================================
  // ⚡ ENGINE 1: Dedicated Driver WebSocket
  // ==========================================
  useEffect(() => {
    const connectDriverSocket = () => {
      console.log("🔌 Driver app connecting to gateway...");
      const socket = new WebSocket("ws://localhost:8080/ambulance-tracking");
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("⚡ Driver WebSocket link verified active.");
        setSocketConnected(true);
      };

      socket.onerror = (err) => console.error("Driver socket encountered error:", err);

      socket.onclose = () => {
        setSocketConnected(false);
        console.log("🔌 Connection lost. Attempting reconnection loop...");
        setTimeout(connectDriverSocket, 4000); 
      };
    };

    connectDriverSocket();

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  // ==========================================
  // 🗺️ ENGINE 2: Leaflet Component Map Mounting
  // ==========================================
  useEffect(() => {
    // Avoid position initialization crash loops
    const container = L.DomUtil.get("driver-dashboard-map");
    if (container != null) container._leaflet_id = null;

    // Centered on Ichalkaranji region coordinates
    const map = L.map("driver-dashboard-map", { zoomControl: false }).setView([16.6914, 74.4667], 14);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker([16.6914, 74.4667], {
      icon: L.divIcon({
        className: "driver-live-pin",
        html: `<span style="font-size:24px; background:white; border-radius:50%; padding:6px; border:2px solid #2a9d8f; box-shadow:0 2px 5px rgba(0,0,0,0.3); display:inline-block;">🚑</span>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })
    }).addTo(map).bindPopup("<b>Current Asset Position</b>").openPopup();
    
    driverMarkerRef.current = marker;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // ==========================================
  // 🛰️ ENGINE 3: Live Hardware GPS Geolocation
  // ==========================================
  const toggleTrackingBroadcast = () => {
    if (isTracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsTracking(false);
      showToast("Live telemetry transmission paused.", "warning");
    } else {
      if (!navigator.geolocation) {
        showToast("GPS tracking hardware missing on this device.", "danger");
        return;
      }

      setIsTracking(true);
      showToast("Live telemetry transmission activated!", "success");

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Update local map position
          if (driverMarkerRef.current && mapRef.current) {
            driverMarkerRef.current.setLatLng([latitude, longitude]);
            mapRef.current.panTo([latitude, longitude]);
          }

          // 📤 Stream coordinates out over the active WebSocket channel
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const coordinatePayload = {
              bookingId: Number(activeBookingId), // Linked tracking ID
              latitude: latitude,
              longitude: longitude,
              status: "EN_ROUTE"
            };
            
            console.log("📤 Sending dynamic telemetry data frame:", coordinatePayload);
            socketRef.current.send(JSON.stringify(coordinatePayload));
          }
        },
        (err) => {
          console.error("GPS hardware intercept error:", err);
          showToast("Failed to lock device location updates.", "danger");
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 6000 }
      );
    }
  };

  const updateRequest = (id, status) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)));
    showToast(`Request ${id} ${status.toLowerCase()}.`, status === "ACCEPTED" ? "success" : "danger");
  };

  return (
    <div className="driver-page page-layout">
      <div className="page-head">
        <div>
          <span className="eyebrow" style={{ color: socketConnected ? "#2a9d8f" : "#e63946" }}>
            ● {socketConnected ? "Gateway Channel Secure" : "Gateway Offline"}
          </span>
          <h2>Welcome back, {user?.name || "Driver"}</h2>
          <p>Accept requests and update ambulance status while staying connected on route.</p>
        </div>
        <div className="status-chip">Active requests: {requests.filter((req) => req.status === "PENDING").length}</div>
      </div>
      
      <div className="driver-grid">
        <div className="requests-panel glass-card">
          <h4>Incoming requests</h4>
          {requests.map((request) => (
            <div key={request.id} className={`request-card ${request.status.toLowerCase()}`}>
              <div>
                <h5>{request.passenger}</h5>
                <p>{request.emergency} - {request.distance} km</p>
                <p>{request.pickup} → {request.destination}</p>
              </div>
              <div className="request-actions">
                {request.status === "PENDING" ? (
                  <>
                    <button className="btn btn-success btn-sm" onClick={() => updateRequest(request.id, "ACCEPTED")}>Accept</button>
                    <button className="btn btn-danger btn-sm" onClick={() => updateRequest(request.id, "REJECTED")}>Reject</button>
                  </>
                ) : (
                  <span className="status-pill">{request.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="driver-status glass-card">
          <h4>Live Navigation Grid</h4>
          {/* Map box panel placeholder directly loaded inside existing dashboard layout context structure */}
          <div id="driver-dashboard-map" style={{ height: "220px", width: "100%", borderRadius: "6px", margin: "12px 0" }} />
          
          <div className="form-group mb-3">
            <label className="small text-muted font-weight-bold">Active Booking Link ID:</label>
            <input 
              type="number" 
              className="form-control mt-1"
              value={activeBookingId}
              onChange={(e) => setActiveBookingId(e.target.value)}
              disabled={isTracking}
              style={{ background: "rgba(0,0,0,0.15)", color: "white", padding: "6px", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <button 
            className={`btn btn-block ${isTracking ? "btn-danger" : "btn-primary"}`} 
            onClick={toggleTrackingBroadcast}
          >
            {isTracking ? "🛑 Stop Location Broadcast" : "📡 Start Location Broadcast"}
          </button>
          
          <hr />
          <h4>Current route</h4>
          <p>1 active ambulance, ready to accept the next emergency call.</p>
          <div className="stat-grid">
            <div>
              <strong>8</strong>
              <span>Active rides</span>
            </div>
            <div>
              <strong>20</strong>
              <span>Available ambulances</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 