import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";

const users = [
  { id: 1, name: "Ravi P.", role: "USER" },
  { id: 2, name: "Sanya K.", role: "USER" },
  { id: 3, name: "Anil T.", role: "DRIVER" },
  { id: 4, name: "Meera S.", role: "DRIVER" },
];

const ambulances = [
  { id: "AMB-101", status: "Active" },
  { id: "AMB-102", status: "Idle" },
  { id: "AMB-103", status: "Dispatching" },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = useMemo(
    () => ({
      totalBookings: 126,
      activeDrivers: users.filter((item) => item.role === "DRIVER").length,
      activeAmbulances: ambulances.filter((item) => item.status !== "Idle").length,
    }),
    []
  );

  return (
    <div className="admin-page page-layout">
      <div className="page-head">
        <div>
          <span className="eyebrow">Admin dashboard</span>
          <h2>Welcome back, {user?.name || "Admin"}</h2>
          <p>Manage bookings, drivers and ambulances from a single control panel.</p>
        </div>
      </div>
      <div className="admin-grid">
        <div className="stats-panel glass-card">
          <div className="stat-card">
            <span>Total bookings</span>
            <strong>{stats.totalBookings}</strong>
          </div>
          <div className="stat-card">
            <span>Active drivers</span>
            <strong>{stats.activeDrivers}</strong>
          </div>
          <div className="stat-card">
            <span>Active ambulances</span>
            <strong>{stats.activeAmbulances}</strong>
          </div>
        </div>
        <div className="admin-table glass-card">
          <h4>Users & drivers</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.role}</td>
                  <td>{person.role === "DRIVER" ? "Online" : "Active"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
