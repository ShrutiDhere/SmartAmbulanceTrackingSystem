import { useState } from "react";
import { showToast } from "../utils/toast";

export default function BookingForm({ onSubmit, selectedHospital, emergencyLevel, setEmergencyLevel, loading }) {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedHospital) {
      const message = "Please select a hospital before booking.";
      setError(message);
      showToast(message, "warning");
      return;
    }

    if (notes.length > 250) {
      const message = "Notes cannot be longer than 250 characters.";
      setError(message);
      return;
    }

    setError("");
    onSubmit({ emergencyLevel, hospital: selectedHospital, notes });
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Emergency level</label>
        <select className="form-control" value={emergencyLevel} onChange={(e) => setEmergencyLevel(e.target.value)}>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
      </div>

      <div className="form-group">
        <label>Selected hospital</label>
        <input className="form-control" value={selectedHospital?.name || "Choose a hospital on the left"} readOnly />
      </div>

      <div className="form-group">
        <label>Notes for dispatcher</label>
        <textarea
          className="form-control"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            if (error) setError("");
          }}
          placeholder="Describe your emergency..."
          maxLength={250}
        />
        <div className="status-note">{notes.length}/250 characters</div>
      </div>

      {error && <span className="field-error">{error}</span>}
      <button className="btn btn-danger btn-block" disabled={loading || !selectedHospital}>
        {loading ? "Finding nearest ambulance..." : "Confirm booking"}
      </button>
    </form>
  );
}
