import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { showToast } from "../utils/toast";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateAddress,
  isFormValid,
} from "../utils/validation";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    role: "USER",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setApiError(error);
      clearError();
    }
  }, [error, clearError]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password, 6),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
      address: validateAddress(formData.address),
    };
    setErrors(newErrors);
    return isFormValid(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const user = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        address: formData.address.trim(),
        role: formData.role,
      });
      showToast(`Welcome, ${user?.name || formData.email}!`, "success");
      if (user?.role === "DRIVER") {
        navigate("/driver");
      } else if (user?.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (registerError) {
      setApiError(registerError.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-page auth-register">
      <div className="auth-container">

  <div className="auth-hero">
    <div className="hero-badge">
      SMART AMBULANCE TRACKING
    </div>

    <h1>
      Join The Future
      <br />
      Of Emergency Response
    </h1>

    <p>
      Register and access real-time ambulance booking,
      live ambulance tracking, hospital integration,
      emergency dispatch and smart healthcare services.
    </p>

    <div className="hero-stats">
      <div className="hero-stat">
        <h2>10K+</h2>
        <span>Users</span>
      </div>

      <div className="hero-stat">
        <h2>500+</h2>
        <span>Drivers</span>
      </div>

      <div className="hero-stat">
        <h2>99%</h2>
        <span>Success Rate</span>
      </div>
    </div>
  </div>

  <div className="auth-panel auth-panel-fluid">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-circle">🚑</div>
            </div>
            <h1>Register for dispatch</h1>
            <p>Create your account and book emergency transport in seconds.</p>
          </div>

          {apiError && <div className="auth-alert auth-alert-error">{apiError}</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <InputField
              label="Full name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              autoComplete="name"
              icon={
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                  <path d="M12 12c2.7 0 5-2.2 5-5s-2.3-5-5-5-5 2.2-5 5 2.3 5 5 5z" />
                  <path d="M4 21v-1c0-2.7 2.3-5 8-5s8 2.3 8 5v1" />
                </svg>
              }
            />
            <InputField
              label="Email address"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              autoComplete="email"
              icon={
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                  <path d="M4 4h16v16H4z" opacity="0.12" />
                  <path d="M4 6l8 6 8-6" />
                  <path d="M4 18V8l8 6 8-6v10" />
                </svg>
              }
            />
            <InputField
              label="Address"
              type="text"
              placeholder="Street address, city, state"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              error={errors.address}
              autoComplete="street-address"
              icon={
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                  <path d="M12 21s8-4.5 8-10a8 8 0 1 0-16 0c0 5.5 8 10 8 10z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
              }
            />
            <InputField
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={errors.password}
              showPasswordToggle
              autoComplete="new-password"
              icon={
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                  <rect x="5" y="11" width="14" height="8" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
              }
            />
            <InputField
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
              showPasswordToggle
              autoComplete="new-password"
              icon={
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                  <path d="M5 12h14" />
                  <path d="M10 6l6 6-6 6" />
                </svg>
              }
            />
            <div className="form-group">
              <label className="form-label">Account type</label>
              <select className="form-control" value={formData.role} onChange={(e) => handleInputChange("role", e.target.value)}>
                <option value="USER">Regular user</option>
                <option value="DRIVER">Ambulance driver</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <Button type="submit" variant="danger" loading={loading} disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="btn btn-secondary btn-block btn-large">
            Sign in
          </Link>

          <div className="auth-footer">
            <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
