import api from "./api";

// Aligned with POST: /api/bookings/dispatch
export const createBooking = async (bookingPayload) => {
  try {
    // Aligns perfectly with @PostMapping("/dispatch") inside BookingController
    const response = await api.post("/bookings/dispatch", bookingPayload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Booking dispatch transaction failed.");
  }
};

// Aligned with GET: /api/bookings/{id}
export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch booking details");
  }
};

// Aligned with GET: /api/bookings/all
export const getAllBookings = async () => {
  return await api.get("/bookings/all");
};

// Aligned with PUT: /api/bookings/{id}/status
// Expects RequestParam: status (BookingStatus Enum value e.g. "ACCEPTED", "COMPLETED")
export const updateBookingStatus = async (id, status) => {
  return await api.put(`/bookings/${id}/status`, null, {
    params: { status },
  });
};