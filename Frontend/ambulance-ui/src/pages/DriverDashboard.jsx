import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../utils/toast";

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
  },
];

export default function DriverDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState(initialRequests);

  const updateRequest = (id, status) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)));
    showToast(`Request ${id} ${status.toLowerCase()}.`, status === "ACCEPTED" ? "success" : "danger");
  };

  return (
    <div className="driver-page page-layout">
      <div className="page-head">
        <div>
          <span className="eyebrow">Driver dashboard</span>
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
          <h4>Update location</h4>
          <p>Your last live location was refreshed 2 minutes ago.</p>
          <button className="btn btn-danger btn-block" onClick={() => showToast("Location updated on server.", "success")}>Push location update</button>
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
