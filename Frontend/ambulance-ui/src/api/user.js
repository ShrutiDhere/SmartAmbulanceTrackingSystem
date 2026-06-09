import api from "./api";

export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get("/users/all");
    return response.data;
};

export const updateUserRole = async (
    id,
    role
) => {
    const response = await api.put(
        `/users/${id}/role?role=${role}`
    );
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(
        `/users/${id}`
    );
    return response.data;
};