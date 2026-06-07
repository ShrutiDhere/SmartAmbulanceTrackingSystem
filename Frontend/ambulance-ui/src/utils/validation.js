// Validation utility functions with strict rules

export const validateName = (name) => {
  if (!name || !name.trim()) {
    return "Full name is required";
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return "Please enter a valid name (numbers not allowed)";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }
  if (name.trim().length > 50) {
    return "Name must be less than 50 characters";
  }
  return "";
};

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return "Email address is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return "";
};

export const validatePassword = (password, minLength = 6) => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  if (!/[a-zA-Z]/.test(password)) {
    return "Password must contain at least one letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return "";
};

export const validateAddress = (address) => {
  if (!address || !address.trim()) {
    return "Address is required";
  }
  if (address.trim().length < 5) {
    return "Please enter a valid address (at least 5 characters)";
  }
  if (address.trim().length > 100) {
    return "Address must be less than 100 characters";
  }
  // Check for valid address characters (letters, numbers, spaces, common punctuation)
  if (!/^[a-zA-Z0-9\s,.\-#/&()]+$/.test(address)) {
    return "Address contains invalid characters";
  }
  return "";
};

// Check if all form fields are valid
export const isFormValid = (errors) => {
  return Object.values(errors).every((error) => error === "");
};
