import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();

  return (
    <div className="glass-card dashboard-header">
      <h1>Welcome, {user?.name}</h1>

      <p>
        Smart Ambulance Tracking &
        Emergency Management System
      </p>

      <span className="role-badge">
        {user?.role}
      </span>
    </div>
  );
}