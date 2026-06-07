export default function HospitalList({ hospitals, selectedHospital, onSelect }) {
  return (
    <div className="hospital-list">
      {hospitals.map((hospital) => (
        <div
          key={hospital.id}
          className={`hospital-card ${selectedHospital?.id === hospital.id ? "active" : ""}`}
          onClick={() => onSelect(hospital)}
        >
          <h6>{hospital.name}</h6>
          <p>{hospital.address}</p>
        </div>
      ))}
    </div>
  );
}
