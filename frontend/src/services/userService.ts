import api from "./api";

export interface User {
    id: number;
    username: string;
    password: string;
    role: "AKADEMIK" | "ADMIN_KK" | "ADMIN_PRODI";
}

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
};