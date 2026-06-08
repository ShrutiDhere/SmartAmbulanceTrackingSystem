export default function AmbulanceCard({ ambulance, onSelect, selected }) {
  return (
    <div className={`ambulance-card ${selected ? "selected" : ""}`} onClick={() => onSelect(ambulance)}>
      <div className="ambulance-card-top">
        <span className="ambulance-marker">🚑</span>
        <div>
          <h5>Ambulance #{ambulance.id}</h5>
          <p>{ambulance.status || "Available"}</p>
        </div>
      </div>
      <div className="ambulance-card-meta">
        <span>{ambulance.distance?.toFixed(1)} km</span>
        <span>{ambulance.eta ? `${ambulance.eta} min` : "ETA"}</span>
      </div>
    </div>
  );
}
