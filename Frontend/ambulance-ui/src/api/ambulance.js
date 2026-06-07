import api from "./api";

export const fetchNearbyAmbulances = async (lat, lng) => {
  const response = await api.get(`/ambulances/nearby?lat=${lat}&lng=${lng}`);
  return response.data;
};
