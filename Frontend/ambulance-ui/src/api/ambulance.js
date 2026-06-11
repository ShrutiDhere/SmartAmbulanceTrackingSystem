import api from "./api";

// Aligned with GET: /api/ambulances/all
export const getAllAmbulances = async () => {
  return await api.get("/ambulances/all");
};

// Aligned with GET: /api/ambulances/{id}
export const getAmbulanceById = async (id) => {
  return await api.get(`/ambulances/${id}`);
};

// Aligned with PUT: /api/ambulances/{id}/location
// Expects RequestParams: latitude, longitude, speed, locationName
export const updateAmbulanceLocation = async (id, { latitude, longitude, speed, locationName }) => {
  return await api.put(`/ambulances/${id}/location`, null, {
    params: { latitude, longitude, speed, locationName },
  });
};

// Aligned with PUT: /api/ambulances/{id}/status
// Expects RequestParam: status (AmbulanceStatus Enum value e.g. "AVAILABLE", "BUSY")
export const updateAmbulanceStatus = async (id, status) => {
  return await api.put(`/ambulances/${id}/status`, null, {
    params: { status },
  });
};