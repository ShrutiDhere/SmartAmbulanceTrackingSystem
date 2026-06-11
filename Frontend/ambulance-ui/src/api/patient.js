import api from "./api";

/**
 * Register a new patient
 * Aligned with POST: /api/patients/register
 * @param {Object} patientPayload - Must match PatientRequestDTO (name, age, conditionType, emergencyLevel, vitals)
 */
export const registerPatient = async (patientData) => {
  try {
    const response = await api.post("/patients/register", patientData);
    // Returns the axios wrapped payload so BookAmbulance can unpack it cleanly
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || "Patient registry failed");
  }
};

/**
 * Get patient details by database ID
 * Aligned with GET: /api/patients/{id}
 */
export const getPatientById = async (id) => {
  return await api.get(`/patients/${id}`);
};

/**
 * Fetch all registered patient records
 * Aligned with GET: /api/patients/all
 */
export const getAllPatients = async () => {
  return await api.get("/patients/all");
};

/**
 * Update patient vitals and emergency assessment level
 * Aligned with PUT: /api/patients/{id}/vitals
 * Expects RequestParams: vitals, emergencyLevel
 */
export const updatePatientVitals = async (id, vitals, emergencyLevel) => {
  return await api.put(`/patients/${id}/vitals`, null, {
    params: { vitals, emergencyLevel },
  });
};