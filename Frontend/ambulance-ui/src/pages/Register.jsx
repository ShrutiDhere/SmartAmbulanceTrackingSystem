import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { showToast } from "../utils/toast";

import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  isFormValid,
} from "../utils/validation";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    loading,
    error,
    clearError,
    isAuthenticated,
  } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "PATIENT",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    if (apiError) {
      setApiError("");
    }
  };
  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(
        formData.password,
        6
      ),
      confirmPassword:
        validateConfirmPassword(
          formData.password,
          formData.confirmPassword
        ),
    };

    setErrors(newErrors);

    return isFormValid(newErrors);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Register button clicked");

    if (!validateForm()) {
      console.log("Validation failed");
      return;
    }

    console.log("Validation passed");

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      showToast(
        "Registration successful. Please login.",
        "success"
      );

      navigate("/login");

    } catch (err) {
      setApiError(
        err.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* LEFT HERO */}

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
            Register today and gain
            access to real-time ambulance
            booking, GPS tracking,
            AI-powered dispatching,
            hospital connectivity and
            emergency healthcare services.
          </p>

          <div className="showcase-stats">

            <div className="stat-box">
              <h3>10K+</h3>
              <span>Users</span>
            </div>

            <div className="stat-box">
              <h3>500+</h3>
              <span>Drivers</span>
            </div>

            <div className="stat-box">
              <h3>99%</h3>
              <span>Success Rate</span>
            </div>

          </div>

          <div className="dashboard-preview">

            <div className="preview-card">
              🏥
              <h2>50+</h2>
              <span>
                Connected Hospitals
              </span>
            </div>

            <div className="preview-card">
              🚑
              <h2>250+</h2>
              <span>
                Ambulances
              </span>
            </div>

            <div className="preview-card">
              ⚡
              <h2>24/7</h2>
              <span>
                Emergency Support
              </span>
            </div>

          </div>

        </div>

        {/* REGISTER PANEL */}

        <div className="auth-panel auth-panel-fluid">

          <div className="auth-header">

            <div className="logo-circle">
              🚑
            </div>

            <h2>
              Create Account
            </h2>

            <p>
              Register and start using
              Smart Ambulance Services
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
              label="Full Name"
              placeholder="Enter Full Name"
              value={formData.name}
              onChange={(e) =>
                handleInputChange(
                  "name",
                  e.target.value
                )
              }
              error={errors.name}
            />

            <InputField
              label="Email Address"
              type="email"
              placeholder="Enter Email"
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
              placeholder="Create Password"
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

            <InputField
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange(
                  "confirmPassword",
                  e.target.value
                )
              }
              error={errors.confirmPassword}
              showPasswordToggle
            />

            <div className="form-group">

              <label className="form-label">
                Account Type
              </label>

              <select
                className="form-control"
                value={formData.role}
                onChange={(e) =>
                  handleInputChange(
                    "role",
                    e.target.value
                  )
                }
              >
                <option value="PATIENT">
                  Patient
                </option>

                <option value="DRIVER">
                  Ambulance Driver
                </option>
                <option value="HOSPITAL">
                  Hospital
                </option>
                <option value="ADMIN">
                  Administrator
                </option>

              </select>

            </div>

            <Button
              type="submit"
              variant="danger"
              loading={loading}
            >
              Create Account
            </Button>

          </form>

          <div className="auth-divider">
            Already have an account?
          </div>

          <Link
            to="/login"
            className="btn btn-secondary"
          >
            Sign In
          </Link>

        </div>


      </div>

      {loading && (
        <Loader
          message="Creating Account..."
        />
      )}

    </div>
  );
}