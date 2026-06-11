import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";

import Dashboard from "../pages/Dashboard";
import BookAmbulance from "../pages/BookAmbulance";
import LiveTracking from "../pages/LiveTracking";
import BookingHistory from "../pages/BookingHistory";

import DriverDashboard from "../pages/DriverDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import HospitalDashboard from "../pages/HospitalDashboard";

import ProtectedRoute from "../routes/ProtectedRoute";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* Common Dashboard */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Patient Routes */}

      <Route
        path="/book-ambulance"
        element={
          <ProtectedRoute roles={["PATIENT"]}>
            <BookAmbulance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/track"
        element={
          <ProtectedRoute roles={["PATIENT"]}>
            <LiveTracking />
          </ProtectedRoute>
        }
      />

      <Route
        path="/live-tracking"
        element={
          <ProtectedRoute roles={["PATIENT"]}>
            <LiveTracking />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute roles={["PATIENT"]}>
            <BookingHistory />
          </ProtectedRoute>
        }
      />

      {/* Driver Routes */}

      <Route
        path="/driver"
        element={
          <ProtectedRoute roles={["DRIVER"]}>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />

      {/* Hospital Routes */}

      <Route
        path="/hospital"
        element={
          <ProtectedRoute roles={["HOSPITAL"]}>
            <HospitalDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Invalid Routes */}

      <Route
        path="*"
        element={
          <Navigate
            to={user ? "/" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}