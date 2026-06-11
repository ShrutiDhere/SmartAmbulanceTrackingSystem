import { useState } from "react";
import { showToast } from "../utils/toast";

export default function BookingForm({ onSubmit, selectedHospital, emergencyLevel, setEmergencyLevel, loading }) {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!selectedHospital) {
      const message = "Please select a destination hospital before booking.";
      setError(message);
      showToast(message, "warning");
      return;
    }

    if (notes.length > 250) {
      const message = "Notes cannot be longer than 250 characters.";
      setError(message);
      showToast(message, "warning");  
      return;
    }

    setError("");
    // Passes the raw component variables matching your parent pipeline expectations
    onSubmit({ emergencyLevel, hospital: selectedHospital, notes });
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="emergency-level-select">Emergency level</label>
        <select 
          id="emergency-level-select"
          className="form-control" 
          value={emergencyLevel} 
          onChange={(e) => setEmergencyLevel(e.target.value)}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="selected-hospital-input">Selected hospital</label>
        {/* Dynamic checking properties from HospitalResponseDTO mapping */}
        <input 
          id="selected-hospital-input"
          className={`form-control ${!selectedHospital ? "placeholder-text" : "active-text"}`} 
          value={selectedHospital?.name || "Choose a hospital from the list..."} 
          readOnly 
        />
      </div>

      <div className="form-group">
        <label htmlFor="dispatcher-notes">Notes for dispatcher / Medic Vitals</label>
        <textarea
          id="dispatcher-notes"
          className="form-control"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            if (error) setError("");
          }}
          placeholder="Describe symptoms or conditions (e.g., severe chest pain, breathing difficulties)..."
          maxLength={250}
        />
        <div className="status-note text-muted text-right small mt-1">
          {notes.length}/250 characters
        </div>
      </div>

      {error && <div className="field-error text-danger mb-2 small">{error}</div>}
      
      <button 
        type="submit" 
        className="btn btn-danger btn-block w-100 py-2 mt-2" 
        disabled={loading}
      >
        {loading ? (
          <span className="d-flex align-items-center justify-content-center gap-2">
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Dispatching Ambulance...
          </span>
        ) : (
          "Confirm Booking"
        )}
      </button>
    </form>
  );
}