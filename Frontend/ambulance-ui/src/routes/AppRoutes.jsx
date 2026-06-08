import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import BookAmbulance from "../pages/BookAmbulance";
import LiveTracking from "../pages/LiveTracking";
import BookingHistory from "../pages/BookingHistory";
import DriverDashboard from "../pages/DriverDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/book-ambulance" element={<ProtectedRoute roles={["USER"]}><BookAmbulance /></ProtectedRoute>} />
      <Route path="/track" element={<ProtectedRoute roles={["USER"]}><LiveTracking /></ProtectedRoute>} />
      <Route path="/live-tracking" element={<ProtectedRoute roles={["USER"]}><LiveTracking /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute roles={["USER"]}><BookingHistory /></ProtectedRoute>} />
      <Route path="/hospitals" element={<ProtectedRoute roles={["USER"]}><BookAmbulance /></ProtectedRoute>} />
      <Route path="/driver" element={<ProtectedRoute roles={["DRIVER"]}><DriverDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}
