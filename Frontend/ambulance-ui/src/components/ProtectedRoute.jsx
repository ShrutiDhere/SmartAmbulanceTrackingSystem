import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const nextRoute = user.role === "DRIVER" ? "/driver" : user.role === "ADMIN" ? "/admin" : "/";
    return <Navigate to={nextRoute} replace />;
  }

  return children;
}
