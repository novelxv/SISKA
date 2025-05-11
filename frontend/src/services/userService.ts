import api from "./api";

export interface User {
    id: number;
    username: string;
    password: string;
    role: "AKADEMIK" | "ADMIN_KK" | "ADMIN_PRODI";
    jenisKK?: string;
    jenisProdi?: string;
}

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
};

export const getUserById = async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const updateUser = async (id: number, data: {
    username: string;
    password: string;
    role: User["role"];
}): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
};