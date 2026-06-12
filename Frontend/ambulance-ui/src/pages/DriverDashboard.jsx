import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../utils/toast";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function DriverDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]); // Live requests from backend database
  
  // Real-time tracking states
  const [activeBookingId, setActiveBookingId] = useState(""); 
  const [isTracking, setIsTracking] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);

  // ==========================================
  // 📥 ENGINE 1: Fetch Live Driver Assignments
  // ==========================================
  useEffect(() => {
    let isMounted = true; // Prevents updating state if component unmounts mid-request

    const fetchDriverRides = async () => {
      if (!user?.id) return;
      try {
        console.log(`📡 Fetching active bookings for Driver ID: ${user.id}`);
        const response = await fetch(`http://localhost:8080/api/bookings/driver/${user.id}/active`); 
        const result = await response.json();
        
        if (result.success && isMounted) {
          console.log("📥 Database payload received:", result.data);
          setRequests(result.data);
          
          const currentActiveJob = result.data.find(
            (job) => job.status === "IN_PROGRESS" || job.status === "ACCEPTED"
          );
          if (currentActiveJob) {
            setActiveBookingId(currentActiveJob.id.toString());
          }
        }
      } catch (err) {
        console.error("Failed to load active driver assignments:", err);
      }
    };

    fetchDriverRides();
    
    return () => {
      isMounted = false; // Cleanup flag
    };
  }, [user]);

  // ==========================================
  // ⚡ ENGINE 2: Dedicated Driver WebSocket
  // ==========================================
  useEffect(() => {
    let active = true;

    const connectDriverSocket = () => {
      if (!active) return;
      console.log("🔌 Driver app connecting to gateway...");
      const socket = new WebSocket("ws://localhost:8080/ambulance-tracking");
      socketRef.current = socket;

      socket.onopen = () => {
        if (!active) { socket.close(); return; }
        console.log("⚡ Driver WebSocket link verified active.");
        setSocketConnected(true);
      };

      socket.onerror = (err) => {
        console.error("Driver socket encountered error:", err);
      };

      socket.onclose = () => {
        setSocketConnected(false);
        if (active) {
          console.log("🔌 Connection lost. Attempting reconnection loop...");
          setTimeout(connectDriverSocket, 4000); 
        }
      };
    };

    connectDriverSocket();

    return () => {
      active = false; // Stops reconnection loops immediately on unmount
      if (socketRef.current) {
        console.log("Cleaning up active socket instance...");
        socketRef.current.close();
      }
    };
  }, []);

  // ==========================================
  // 🗺️ ENGINE 3: Leaflet Component Map Mounting
  // ==========================================
  useEffect(() => {
    const container = L.DomUtil.get("driver-dashboard-map");
    if (container != null) container._leaflet_id = null;

    // Default centered on project region coordinates
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
  // 🛰️ ENGINE 4: Live Hardware GPS Geolocation
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
      if (!activeBookingId) {
        showToast("Please accept a job or select a Booking ID before broadcasting.", "danger");
        return;
      }
      if (!navigator.geolocation) {
        showToast("GPS tracking hardware missing on this device.", "danger");
        return;
      }

      setIsTracking(true);
      showToast("Live telemetry transmission activated!", "success");

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          if (driverMarkerRef.current && mapRef.current) {
            driverMarkerRef.current.setLatLng([latitude, longitude]);
            mapRef.current.panTo([latitude, longitude]);
          }

          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const coordinatePayload = {
              bookingId: Number(activeBookingId), 
              latitude: latitude,
              longitude: longitude,
              status: "IN_PROGRESS"
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

  // ==========================================
  // 🔄 ENGINE 5: Backend Status Transitions
  // ==========================================
  const handleStatusTransition = async (bookingId, nextStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/status?status=${nextStatus}`, {
        method: "PUT"
      });
      const result = await response.json();

      if (result.success) {
        // If a job gets completed or cancelled, remove it from the driver's active panel deck list
        if (nextStatus === "COMPLETED" || nextStatus === "CANCELLED") {
          setRequests((prev) => prev.filter((req) => req.id !== bookingId));
          if (activeBookingId === bookingId.toString() && isTracking) {
            // Turn off GPS if they completed their active tracking assignment
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
            setIsTracking(false);
          }
        } else {
          // Otherwise update the UI state status text pill badge smoothly
          setRequests((prev) => 
            prev.map((req) => (req.id === bookingId ? { ...req, status: nextStatus } : req))
          );
        }

        showToast(`Trip update status: ${nextStatus}`, "success");

        // Automatically set the target broadcast key field to match this live booking
        if (nextStatus === "ACCEPTED" || nextStatus === "IN_PROGRESS") {
          setActiveBookingId(bookingId.toString());
        }
      } else {
        showToast(result.message || "Failed to alter status.", "danger");
      }
    } catch (err) {
      console.error("Error modifying booking status:", err);
      showToast("Network dispatch update synchronization error.", "danger");
    }
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
        <div className="status-chip">Active requests: {requests.length}</div>
      </div>
      
      <div className="driver-grid">
        <div className="requests-panel glass-card">
          <h4>Assigned Emergency Jobs</h4>
          {requests.length === 0 ? (
            <p className="small text-muted mt-3">No pending or active dispatches linked to your account.</p>
          ) : (
            requests.map((request) => (
              <div key={request.id} className={`request-card ${request.status?.toLowerCase()}`}>
                <div>
                  <h5>Patient: {request.patient?.name || "Emergency Request"}</h5>
                  <p>
                    <strong>Status:</strong> <span className="badge bg-secondary">{request.status}</span>
                  </p>
                  {request.emergencyRequest && (
                    <p className="small text-muted">
                      Location: {request.emergencyRequest.pickupLocation || "Reported Site"}
                    </p>
                  )}
                </div>
                <div className="request-actions">
                  {request.status === "ASSIGNED" && (
                    <>
                      <button className="btn btn-success btn-sm" onClick={() => handleStatusTransition(request.id, "ACCEPTED")}>Accept Job</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleStatusTransition(request.id, "CANCELLED")}>Decline</button>
                    </>
                  )}
                  
                  {request.status === "ACCEPTED" && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleStatusTransition(request.id, "IN_PROGRESS")}>⚡ Start Transit</button>
                  )}

                  {request.status === "IN_PROGRESS" && (
                    <button className="btn btn-dark btn-sm" onClick={() => handleStatusTransition(request.id, "COMPLETED")}>✅ Complete Mission</button>
                  )}

                  {!["ASSIGNED", "ACCEPTED", "IN_PROGRESS"].includes(request.status) && (
                    <span className="status-pill">{request.status}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="driver-status glass-card">
          <h4>Live Navigation Grid</h4>
          <div id="driver-dashboard-map" style={{ height: "220px", width: "100%", borderRadius: "6px", margin: "12px 0" }} />
          
          <div className="form-group mb-3">
            <label className="small text-muted font-weight-bold">Active Booking Link ID:</label>
            <input 
              type="number" 
              className="form-control mt-1"
              value={activeBookingId}
              onChange={(e) => setActiveBookingId(e.target.value)}
              disabled={isTracking}
              placeholder="No active trip linked"
              style={{ background: "rgba(0,0,0,0.15)", color: "white", padding: "6px", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <button 
            className={`btn btn-block ${isTracking ? "btn-danger" : "btn-primary"}`} 
            onClick={toggleTrackingBroadcast}
            disabled={!activeBookingId}
          >
            {isTracking ? "🛑 Stop Location Broadcast" : "📡 Start Location Broadcast"}
          </button>
          
          <hr />
          <h4>Current route status</h4>
          <p>Vehicle profile operational and connected to real-time telemetry pipelines.</p>
        </div>
      </div>
    </div>
  );
}