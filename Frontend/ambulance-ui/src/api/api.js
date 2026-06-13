import axios from 'axios';

// Create your base Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// 🔑 ADD THIS EXPORTED FUNCTION HERE:
export const setAuthToken = (token) => {
  if (token) {
    // Apply temporary JWT authorization token to every subsequent request header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    // Delete the header block if no valid token is passed (e.g., on logout)
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export default api;