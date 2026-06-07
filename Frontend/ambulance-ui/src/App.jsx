import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import ToastNotification from "./components/ToastNotification";
import "./styles/auth.css";

function AppContent() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register", "/forgot-password"].includes(location.pathname);
  const isFullPage = location.pathname === "/track" || location.pathname === "/live-tracking";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className={`app-shell ${isFullPage ? "app-shell-full" : ""}`}>
        <AppRoutes />
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
        <ToastNotification />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
