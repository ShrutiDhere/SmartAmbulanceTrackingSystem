import { showToast } from "../utils/toast";

export default function DriverInfoCard({ driverName, vehicleNumber, phoneNumber, statusTag }) {
  return (
    <div className="tracking-driver-card glass-card">
      <div className="driver-header">
        <div>
          <span className="eyebrow">Driver details</span>
          <h3>{driverName}</h3>
          <p>{vehicleNumber}</p>
        </div>
        <div className="status-chip">{statusTag}</div>
      </div>
      <div className="driver-body">
        <div className="driver-value">
          <span>Call</span>
          <strong>{phoneNumber}</strong>
        </div>
        <div className="driver-value">
          <span>Pickup</span>
          <strong>Central city</strong>
        </div>
      </div>
      <button className="btn btn-danger btn-block" onClick={() => showToast("Calling ambulance driver...", "success")}>Call driver</button>
    </div>
  );
}
