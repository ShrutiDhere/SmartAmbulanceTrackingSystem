import api, { setAuthToken } from "./api";

export const loginRequest = async (payload) => {
  try {
    const response = await api.post("/auth/login", payload);
    if (response.data.token || response.data.accessToken) {
      return response.data;
    }
    throw new Error("No authentication token received");
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Login failed. Please try again.";
    throw new Error(errorMsg);
  }
};

export const registerRequest = async (payload) => {
  try {
    const response = await api.post("/auth/register", payload);
    if (response.data.token || response.data.accessToken) {
      return response.data;
    }
    throw new Error("No authentication token received");
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Registration failed. Please try again.";
    throw new Error(errorMsg);
  }
};

export const setSessionToken = (token) => {
  setAuthToken(token);
};
