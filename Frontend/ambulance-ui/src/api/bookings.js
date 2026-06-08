import api from "./api";

export const createBookingRequest = async (payload) => {
  const response = await api.post("/bookings/create", payload);
  return response.data;
};

export const fetchUserBookings = async (userId) => {
  const response = await api.get(`/bookings/user/${userId}`);
  return response.data;
};

export const updateDriverLocationRequest = async (payload) => {
  const response = await api.put("/driver/location", payload);
  return response.data;
};

export const updateBookingStatusRequest = async (payload) => {
  const response = await api.put("/bookings/status", payload);
  return response.data;
};
