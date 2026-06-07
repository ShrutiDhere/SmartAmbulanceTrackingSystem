import { useState } from "react";

export default function FormInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = true,
  showPasswordToggle = false,
  maxLength,
  disabled = false,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    showPasswordToggle && showPassword ? "text" : type;

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      <div className="input-wrapper">
        <input
          type={inputType}
          className={`form-control ${error ? "form-control-error" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          disabled={disabled}
          autoComplete={autoComplete}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
