import api, { setAuthToken } from "./api";

export const loginRequest = async (payload) => {
  try {
    const response = await api.post("/auth/login", payload);

    return response.data.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Login failed";

    throw new Error(errorMsg);
  }
};

export const registerRequest = async (payload) => {
  try {
    const response = await api.post("/auth/register", payload);

    return response.data.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Registration failed";

    throw new Error(errorMsg);
  }
};

export const setSessionToken = (token) => {
  setAuthToken(token);
};