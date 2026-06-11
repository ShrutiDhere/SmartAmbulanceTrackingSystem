export default function AmbulanceCard({ ambulance, onSelect, selected }) {
  // Convert backend uppercase status (e.g., "AVAILABLE") to a user-friendly format
  const displayStatus = ambulance.status 
    ? ambulance.status.charAt(0) + ambulance.status.slice(1).toLowerCase() 
    : "Available";

  return (
    <div 
      className={`ambulance-card ${selected ? "selected" : ""}`} 
      onClick={() => onSelect(ambulance)}
    >
      <div className="ambulance-card-top">
        <span className="ambulance-marker">🚑</span>
        <div>
          {/* Aligned to display your backend's unique vehicle number */}
          <h5>{ambulance.vehicleNumber || `Ambulance #${ambulance.id}`}</h5>
          <p className={`status-${ambulance.status?.toLowerCase()}`}>
            {displayStatus}
          </p>
        </div>
      </div>
      <div className="ambulance-card-meta">
        {/* Safely handle cases where distance isn't computed yet */}
        <span>{ambulance.distance ? `${ambulance.distance.toFixed(1)} km` : "-- km"}</span>
        <span>{ambulance.eta ? `${ambulance.eta} min` : "-- min"}</span>
      </div>
    </div>
  );
}