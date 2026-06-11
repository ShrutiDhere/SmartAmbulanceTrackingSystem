import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllBookings } from "../api/bookings"; // Updated to use the correct backend endpoint
import Loader from "../components/Loader";
import { showToast } from "../utils/toast";

export default function BookingHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        // Fetch all bookings from your Spring Boot backend Controller (GET /api/bookings/all)
        const data = await getAllBookings();
        
        if (Array.isArray(data) && data.length > 0) {
          // Since the backend doesn't filter by user yet, we show all or reverse to get recent ones first
          setBookings([...data].reverse());
        } else {
          // Fallback to local storage cache if database list is empty
          const stored = window.localStorage.getItem("smart_ambulance_last_booking");
          if (stored) {
            setBookings([JSON.parse(stored)]);
          }
        }
      } catch (error) {
        console.error("History fetch error: ", error);
        showToast("Unable to fetch booking history. Showing saved rides.", "warning");
        
        const stored = window.localStorage.getItem("smart_ambulance_last_booking");
        if (stored) {
          setBookings([JSON.parse(stored)]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user]);

  // Convert backend uppercase enums (e.g., "IN_PROGRESS") to cleaner text
  const formatStatus = (status) => {
    if (!status) return "Requested";
    return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="history-page page-layout">
      <div className="page-head">
        <div>
          <span className="eyebrow">Ride history</span>
          <h2>Your past ambulance bookings</h2>
          <p>Review emergency bookings, track your latest ride, and see status details from recent trips.</p>
        </div>
        <Link to="/book-ambulance" className="btn btn-danger btn-lg">
          Book new ride
        </Link>
      </div>

      {loading ? (
        <Loader message="Loading bookings..." />
      ) : bookings.length ? (
        <div className="history-grid">
          {bookings.map((booking, index) => (
            <div key={booking.id || index} className="history-card glass-card">
              <div className="history-card-header">
                <div>
                  <h5>Booking #{booking.id || index + 1}</h5>
                  {/* Maps directly to your backend BookingStatus Enum values */}
                  <span className={`status-text-${booking.status?.toLowerCase() || "requested"}`}>
                    {formatStatus(booking.status)}
                  </span>
                </div>
                {/* Fallback support for cached vs live object fields */}
                <span className="status-chip">
                  {booking.emergencyLevel || "URGENT"}
                </span>
              </div>

              <div className="history-row">
                <strong>Patient Name</strong>
                <p>{booking.patientName || "Patient"}</p>
              </div>

              <div className="history-row">
                <strong>Pickup Location</strong>
                <p>
                  {booking.pickupLocation?.lat 
                    ? `${booking.pickupLocation.lat.toFixed(4)}, ${booking.pickupLocation.lng.toFixed(4)}` 
                    : "Live GPS Active"}
                </p>
              </div>

              <div className="history-row">
                <strong>Hospital</strong>
                <p>{booking.hospital?.name || booking.hospitalName || "General Emergency Ward"}</p>
              </div>

              <div className="history-row">
                <strong>Ambulance assigned</strong>
                {/* Maps cleanly to your backend DTO fields vehicleNumber / driverName */}
                <p>
                  {booking.vehicleNumber 
                    ? `${booking.vehicleNumber} (${booking.driverName || "Assigned Driver"})` 
                    : `Ambulance #${booking.ambulanceId || "TBD"}`}
                </p>
              </div>

              <div className="history-actions">
                <button 
                  className="btn btn-outline-light btn-sm" 
                  onClick={() => navigate("/track", { state: { booking } })}
                >
                  Track ride
                </button>
                <span className="history-date">
                  {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "Just Now"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state glass-card">
          <h4>No previous trips yet</h4>
          <p>Book your first ambulance and it will appear here instantly.</p>
          <Link to="/book-ambulance" className="btn btn-danger btn-lg">
            Start booking
          </Link>
        </div>
      )}
    </div>
  );
}