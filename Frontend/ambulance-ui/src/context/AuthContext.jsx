import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest, registerRequest, setSessionToken } from "../api/auth";

const AuthContext = createContext(null);
const STORAGE_KEY = "smart_ambulance_auth";

const parseJwt = (token) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

const getInitialAuth = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { user: null, token: null };
    const parsed = JSON.parse(stored);
    const token = parsed?.token || null;
    const user = parsed?.user || parseJwt(token);
    return { token, user };
  } catch (error) {
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialAuth().user);
  const [token, setToken] = useState(getInitialAuth().token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSessionToken(token);
    if (token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [token, user]);

  const login = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginRequest(payload);
      const authToken = data.token || data.accessToken;
      if (!authToken) {
        throw new Error("No authentication token received from server");
      }
      const authUser = data.user || parseJwt(authToken);
      setToken(authToken);
      setUser(authUser);
      return authUser;
    } catch (err) {
      const errorMsg = err.message || "Login failed. Please try again.";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerRequest(payload);
      const authToken = data.token || data.accessToken;
      if (!authToken) {
        throw new Error("No authentication token received from server");
      }
      const authUser = data.user || parseJwt(authToken);
      setToken(authToken);
      setUser(authUser);
      return authUser;
    } catch (err) {
      const errorMsg = err.message || "Registration failed. Please try again.";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    setSessionToken(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      register,
      error,
      clearError,
      isAuthenticated: Boolean(user),
    }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
