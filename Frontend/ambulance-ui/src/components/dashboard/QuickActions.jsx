import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function QuickActions() {
  const { user } = useAuth();

  return (
    <div className="glass-card dashboard-actions">

      <h2>Quick Actions</h2>

      <div className="action-buttons">

        {user?.role === "PATIENT" && (
          <>
            <Link
              to="/book-ambulance"
              className="btn btn-danger"
            >
              🚑 Book Ambulance
            </Link>

            <Link
              to="/live-tracking"
              className="btn btn-secondary"
            >
              📍 Track Ambulance
            </Link>

            <Link
              to="/history"
              className="btn btn-secondary"
            >
              📖 Booking History
            </Link>
          </>
        )}

        {user?.role === "DRIVER" && (
          <Link
            to="/driver"
            className="btn btn-danger"
          >
            Driver Dashboard
          </Link>
        )}

        {user?.role === "ADMIN" && (
          <Link
            to="/admin"
            className="btn btn-danger"
          >
            Admin Dashboard
          </Link>
        )}

        {user?.role === "HOSPITAL" && (
          <Link
            to="/hospital"
            className="btn btn-danger"
          >
            Hospital Dashboard
          </Link>
        )}

      </div>
    </div>
  );
}