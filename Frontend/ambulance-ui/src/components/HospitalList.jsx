export default function HospitalList({ hospitals, selectedHospital, onSelect }) {
  // Guard clause to prevent mapping errors if backend data hasn't loaded yet
  if (!hospitals || hospitals.length === 0) {
    return (
      <div className="hospital-list empty-hospitals text-center p-3">
        <p className="text-muted mb-0">No hospitals available in the directory.</p>
      </div>
    );
  }

  return (
    <div className="hospital-list">
      {hospitals.map((hospital) => (
        <div
          key={hospital.id}
          className={`hospital-card ${selectedHospital?.id === hospital.id ? "active" : ""}`}
          onClick={() => onSelect(hospital)}
        >
          <h6>{hospital.name}</h6>
          <p>{hospital.address || "Address not provided"}</p>
        </div>
      ))}
    </div>
  );
}