import api from "./api";

/**
 * Retrieve user details by ID
 * Aligned with GET: /api/users/{id}
 */
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.data; // Fixed: Extracts the actual UserResponseDTO
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user details.");
  }
};

/**
 * Retrieve all users
 * Aligned with GET: /api/users/all
 */
export const getAllUsers = async () => {
  try {
    const response = await api.get("/users/all");
    return response.data.data; // Fixed: Extracts the List<UserResponseDTO>
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users.");
  }
};

/**
 * Update user's role (Admin only)
 * Aligned with PUT: /api/users/{id}/role
 * Expects RequestParam: role
 */
export const updateUserRole = async (id, role) => {
  try {
    // Fixed: Uses Axios params option to map Spring Boot's @RequestParam cleanly
    const response = await api.put(`/users/${id}/role`, null, {
      params: { role: role.toUpperCase() }, // Added .toUpperCase() to match Java Enums
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user role.");
  }
};

/**
 * Delete user by ID
 * Aligned with DELETE: /api/users/{id}
 */
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user account.");
  }
};