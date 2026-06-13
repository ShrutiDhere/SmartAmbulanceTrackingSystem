import { useAuth } from "../context/AuthContext";
import {
  Ambulance,
  Activity,
  Clock3,
  Shield,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">

      {/* HERO SECTION */}

      <div className="hero-section">

        <div>
          <span className="hero-badge">
            Smart Ambulance Network
          </span>

          <h1>
            Welcome, {user?.name}
          </h1>

          <p>
            Real-time ambulance booking,
            emergency response tracking and
            hospital coordination platform.
          </p>

          <div className="hero-buttons">

            {user?.role === "PATIENT" && (
              <Link
                to="/book-ambulance"
                className="primary-btn"
              >
                Book Ambulance
              </Link>
            )}

            {user?.role === "HOSPITAL" && (
              <Link
                to="/hospital"
                className="primary-btn"
              >
                Open Dashboard
              </Link>
            )}

          </div>
        </div>

        <div className="hero-card">

          <div className="pulse-dot"></div>

          <h3>Emergency Network</h3>

          <h2>ONLINE</h2>

          <p>
            Connected to live ambulance
            tracking system.
          </p>

        </div>

      </div>

      {/* STATS */}

      <div className="stats-grid">

        <div className="stat-card">
          <Ambulance size={34} />
          <h2>250+</h2>
          <p>Ambulances</p>
        </div>

        <div className="stat-card">
          <Activity size={34} />
          <h2>50+</h2>
          <p>Hospitals</p>
        </div>

        <div className="stat-card">
          <Clock3 size={34} />
          <h2>8 Min</h2>
          <p>Average Response</p>
        </div>

        <div className="stat-card">
          <Shield size={34} />
          <h2>24/7</h2>
          <p>Emergency Support</p>
        </div>

      </div>

      {/* ACTION CARDS */}

      <div className="action-grid">

        <Link
          to="/book-ambulance"
          className="action-card"
        >
          <h3>Book Ambulance</h3>
          <ArrowRight />
        </Link>

        <Link
          to="/live-tracking"
          className="action-card"
        >
          <h3>Live Tracking</h3>
          <ArrowRight />
        </Link>

        <Link
          to="/history"
          className="action-card"
        >
          <h3>Booking History</h3>
          <ArrowRight />
        </Link>

      </div>

      {/* TIPS */}

      <div className="tips-card">

        <h2>Emergency Guidelines</h2>

        <ul>
          <li>Share exact patient location.</li>
          <li>Keep emergency contact ready.</li>
          <li>Stay connected with ambulance driver.</li>
          <li>Keep patient information available.</li>
        </ul>

      </div>

    </div>
  );
}