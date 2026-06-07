import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { showToast } from "../utils/toast";
import { validateEmail, validatePassword } from "../utils/validation";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("request");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", otp: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ email: "", otp: "", password: "", confirmPassword: "" });
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (apiError) {
      const timer = window.setTimeout(() => setApiError(""), 4500);
      return () => window.clearTimeout(timer);
    }
  }, [apiError]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ ...errors, email: emailError });
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setPhase("verify");
      showToast("OTP sent to your email address.", "success");
    }, 1200);
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (!formData.otp.trim()) {
      setErrors({ ...errors, otp: "Please enter the OTP code" });
      return;
    }

    if (formData.otp.trim() !== "123456") {
      setErrors({ ...errors, otp: "The OTP code is invalid" });
      return;
    }

    setPhase("reset");
    showToast("OTP verified. Please choose a new password.", "success");
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const passwordError = validatePassword(formData.password, 6);
    const confirmError = formData.password !== formData.confirmPassword ? "Passwords do not match" : "";
    if (passwordError || confirmError) {
      setErrors({ ...errors, password: passwordError, confirmPassword: confirmError });
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      showToast("Password reset successfully. Please log in.", "success");
      navigate("/login");
    }, 1400);
  };

  const stepTitle = phase === "request" ? "Reset your password" : phase === "verify" ? "Enter OTP code" : "Set a new password";
  const stepDescription =
    phase === "request"
      ? "Start a secure reset by entering the email linked to your account."
      : phase === "verify"
      ? "We sent an OTP code to your email. Enter it below to continue."
      : "Create a strong new password for your account.";

  return (
    <div className="auth-page auth-forgot">
      <div className="auth-background" />
      <div className="auth-container">
        <div className="auth-panel glass-card auth-panel-fluid">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-circle">🔒</div>
            </div>
            <h1>{stepTitle}</h1>
            <p>{stepDescription}</p>
          </div>

          {apiError && <div className="auth-alert auth-alert-error">{apiError}</div>}

          <form className="auth-form" onSubmit={phase === "request" ? handleSendOtp : phase === "verify" ? handleVerifyOtp : handleResetPassword}>
            <InputField
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              error={errors.email}
              autoComplete="email"
              icon={
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                  <path d="M4 4h16v16H4z" opacity="0.1" />
                  <path d="M4 6l8 6 8-6" />
                  <path d="M4 18V8l8 6 8-6v10" />
                </svg>
              }
            />

            {phase !== "request" && (
              <InputField
                label="OTP Code"
                type="text"
                placeholder="123456"
                value={formData.otp}
                onChange={(e) => updateField("otp", e.target.value)}
                error={errors.otp}
                autoComplete="one-time-code"
                icon={
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                    <path d="M12 3v18" />
                    <path d="M5 7h14" />
                    <path d="M5 17h14" />
                  </svg>
                }
              />
            )}

            {phase === "reset" && (
              <>
                <InputField
                  label="New Password"
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  error={errors.password}
                  autoComplete="new-password"
                  icon={
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                      <rect x="5" y="11" width="14" height="8" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                  }
                  showPasswordToggle
                />
                <InputField
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat new password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                  icon={
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                      <path d="M5 12h14" />
                      <path d="M10 6l6 6-6 6" />
                    </svg>
                  }
                  showPasswordToggle
                />
              </>
            )}

            <Button type="submit" variant="danger" loading={loading}>
              {phase === "request" && "Send OTP"}
              {phase === "verify" && "Verify OTP"}
              {phase === "reset" && "Reset Password"}
            </Button>
          </form>

          <div className="auth-divider">
            <span>Remembered your password?</span>
          </div>

          <Link to="/login" className="btn btn-secondary btn-block btn-large">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
