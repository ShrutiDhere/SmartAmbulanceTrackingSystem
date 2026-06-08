import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [latestBooking, setLatestBooking] = useState(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("smart_ambulance_last_booking");
    if (stored) {
      setLatestBooking(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="dashboard-page hero-page">
      <div className="hero-panel glass-card">
        <div className="hero-copy">
          <span className="eyebrow">Emergency ambulance booking</span>
          <h1>Book and track an ambulance with one tap.</h1>
          <p>Live booking, route tracking, and ambulance dispatch built for fast response and seamless emergency support.</p>
          <div className="hero-actions">
            <Link to="/book-ambulance" className="btn btn-danger btn-lg">
              Book Ambulance
            </Link>
            <Link to="/history" className="btn btn-outline-light btn-lg">
              My Trips
            </Link>
            {user?.role === "DRIVER" && (
              <Link to="/driver" className="btn btn-outline-light btn-lg">
                Driver Panel
              </Link>
            )}
            {user?.role === "ADMIN" && (
              <Link to="/admin" className="btn btn-outline-light btn-lg">
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
        <div className="hero-chart">
          <div className="stats-card">
            <h4>Emergency readiness</h4>
            <p>Smart routing, nearest ambulance selection and hospital triage in one experience.</p>
          </div>
          <div className="stats-grid">
            <div className="stat-block">
              <span>08 min</span>
              <p>Average arrival</p>
            </div>
            <div className="stat-block">
              <span>89%</span>
              <p>Auto-accept rate</p>
            </div>
            <div className="stat-block">
              <span>100+</span>
              <p>Hospitals supported</p>
            </div>
          </div>
          {latestBooking && (
            <div className="booking-summary glass-card">
              <h4>Last booking</h4>
              <p>
                Ambulance #{latestBooking.ambulance?.id} is currently {latestBooking.status || "REQUESTED"} on route to
                {" "}
                {latestBooking.hospital?.name || latestBooking.hospitalName}.
              </p>
              <Link to="/track" className="btn btn-danger btn-sm">
                Track ride
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
