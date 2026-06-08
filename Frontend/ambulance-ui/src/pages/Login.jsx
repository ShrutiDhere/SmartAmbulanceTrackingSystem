    import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { showToast } from "../utils/toast";
import {
  validateEmail,
  validatePassword,
  isFormValid,
} from "../utils/validation";

export default function Login() {
  const navigate = useNavigate();

  const {
    login,
    loading,
    error,
    clearError,
    isAuthenticated,
  } = useAuth();

  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email:
      localStorage.getItem(
        "ambulance_remember_email"
      ) || "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(
        formData.password,
        6
      ),
    };

    setErrors(newErrors);

    return isFormValid(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const user = await login({
        email: formData.email,
        password: formData.password,
      });

      if (rememberMe) {
        localStorage.setItem(
          "ambulance_remember_email",
          formData.email
        );
      }

      showToast(
        `Welcome Back ${
          user?.name || ""
        }`,
        "success"
      );

      navigate("/");
    } catch (err) {
      setApiError(err.message);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* LEFT HERO SECTION */}

        <div className="auth-showcase">

          <div className="showcase-badge">
            🚑 AI Based Smart Ambulance Tracking System
          </div>

         <h1>
AI Based
Smart Ambulance
Tracking System
</h1>

          <p>
            Real-time ambulance booking,
            intelligent dispatching,
            GPS tracking, ETA prediction,
            hospital integration and
            emergency response management
            in one smart healthcare platform.
          </p>

          <div className="showcase-stats">

            <div className="stat-box">
              <h3>250+</h3>
              <span>Ambulances</span>
            </div>

            <div className="stat-box">
              <h3>50+</h3>
              <span>Hospitals</span>
            </div>

            <div className="stat-box">
              <h3>24/7</h3>
              <span>Emergency Care</span>
            </div>

          </div>

          {/* Dashboard Preview */}

          <div className="dashboard-preview">

            <div className="preview-card">
              🚑
              <h2>248</h2>
              <span>
                Active Ambulances
              </span>
            </div>

            <div className="preview-card">
              📍
              <h2>100%</h2>
              <span>
                Live Tracking
              </span>
            </div>

            <div className="preview-card">
              ⚡
              <h2>4.2</h2>
              <span>
                Avg Response (Min)
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT LOGIN PANEL */}

        <div className="auth-panel auth-panel-fluid">

          <div className="auth-header">

            <div className="logo-circle">
              🚑
            </div>

            <h2>
              Welcome Back
            </h2>

            <p>
              Sign in to access
              live ambulance tracking
              and emergency services.
            </p>

          </div>

          {apiError && (
            <div className="auth-alert">
              {apiError}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <InputField
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                handleInputChange(
                  "email",
                  e.target.value
                )
              }
              error={errors.email}
            />

            <InputField
              label="Password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                handleInputChange(
                  "password",
                  e.target.value
                )
              }
              error={errors.password}
              showPasswordToggle
            />

            <div className="form-footer">

              <label className="checkbox-label">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />

                {" "}
                Remember Me

              </label>

              <Link
                to="/forgot-password"
                className="forgot-link"
              >
                Forgot Password?
              </Link>

            </div>

            <Button
              type="submit"
              variant="danger"
              loading={loading}
            >
              Sign In
            </Button>

          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <Link
            to="/register"
            className="btn btn-secondary"
          >
            Create New Account
          </Link>

        </div>

      </div>

      {loading && (
        <Loader
          message="Signing In..."
        />
      )}

    </div>
  );
}