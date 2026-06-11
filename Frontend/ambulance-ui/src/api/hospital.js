import api from "./api";

/**
 * Fetch all active hospital locations from the database
 * Aligned with GET: /api/hospitals/all (or your specific backend endpoint)
 */
export const getAllHospitals = async () => {
  try {
    const response = await api.get("/hospitals/all");
    return response.data.data; // Safely unpacks the List<HospitalResponseDTO> or Entities
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to load hospital records.");
  }
};