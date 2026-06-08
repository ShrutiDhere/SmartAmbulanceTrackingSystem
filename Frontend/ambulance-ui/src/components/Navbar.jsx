import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="main-nav">
      <div className="nav-brand" onClick={() => navigate(user ? "/" : "/login")}>Smart Ambulance</div>
      <div className="nav-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user && user.role === "USER" && (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/book-ambulance">Book Ambulance</Link>
            <Link to="/track">Live Tracking</Link>
            <Link to="/history">My Trips</Link>
          </>
        )}
        {user && user.role === "DRIVER" && <Link to="/driver">Driver Panel</Link>}
        {user && user.role === "ADMIN" && <Link to="/admin">Admin Panel</Link>}
        {user && (
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
