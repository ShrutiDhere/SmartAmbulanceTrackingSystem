import api from "./api";

 

// CHANGED: Renamed from cncy to raiseEmergency to match your page import
export const raiseEmergency = async (emergencyData) => {
  try {
    const response = await api.post("/emergency-requests/raise", emergencyData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to raise emergency situation");
  }
};

// Aligned with GET: /api/emergency-requests/{id}
export const getEmergencyById = async (id) => {
  const response = await api.get(`/emergency-requests/${id}`);
  return response;
};