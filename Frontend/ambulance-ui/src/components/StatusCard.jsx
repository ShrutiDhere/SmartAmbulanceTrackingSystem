export default function StatusCard({ title, subtitle, eta, connection }) {
  return (
    <div className="tracking-status-card glass-card">
      <div className="status-top-row">
        <div>
          <span className="eyebrow">Live ambulance tracking</span>
          <h2>{title}</h2>
        </div>
        <div className={`connection-pill ${connection ? "online" : "offline"}`}>
          {connection ? "Live" : "Offline"}
        </div>
      </div>

      <p>{subtitle}</p>
      <div className="status-metrics">
        <div>
          <span className="metric-label">ETA</span>
          <strong>{eta} min</strong>
        </div>
        <div>
          <span className="metric-label">Current speed</span>
          <strong>42 km/h</strong>
        </div>
      </div>
    </div>
  );
}
