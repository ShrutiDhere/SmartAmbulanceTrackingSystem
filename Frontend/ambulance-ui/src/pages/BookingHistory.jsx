import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchUserBookings } from "../api/bookings";
import Loader from "../components/Loader";
import { showToast } from "../utils/toast";

export default function BookingHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      const userId = user?.id || user?.userId || user?.sub;
      if (!userId) {
        showToast("Unable to load booking history.", "danger");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchUserBookings(userId);
        if (Array.isArray(data) && data.length) {
          setBookings(data.reverse());
        } else {
          const stored = window.localStorage.getItem("smart_ambulance_last_booking");
          if (stored) {
            setBookings([JSON.parse(stored)]);
          }
        }
      } catch (error) {
        showToast("Unable to fetch booking history. Showing saved rides.", "warning");
        const stored = window.localStorage.getItem("smart_ambulance_last_booking");
        if (stored) setBookings([JSON.parse(stored)]);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user]);

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
                  <h5>Booking #{booking.id || booking.reference || index + 1}</h5>
                  <span>{booking.status || booking.bookingStatus || "REQUESTED"}</span>
                </div>
                <span className="status-chip">{booking.emergencyLevel || booking.priority || "HIGH"}</span>
              </div>
              <div className="history-row">
                <strong>Pickup</strong>
                <p>{booking.pickupLocation ? `${booking.pickupLocation.lat.toFixed(4)}, ${booking.pickupLocation.lng.toFixed(4)}` : booking.pickupAddress || "Unknown"}</p>
              </div>
              <div className="history-row">
                <strong>Hospital</strong>
                <p>{booking.hospital?.name || booking.hospitalName || "Unknown"}</p>
              </div>
              <div className="history-row">
                <strong>Ambulance</strong>
                <p>#{booking.ambulance?.id || booking.ambulanceId || "TBD"}</p>
              </div>
              <div className="history-actions">
                <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/track", { state: { booking } })}>
                  Track ride
                </button>
                <span className="history-date">{new Date(booking.createdAt || booking.timestamp || Date.now()).toLocaleString()}</span>
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
