import api from "./api";

export const login = async (username: string, password: string): Promise<string> => {
    try {
        const response = await api.post("/auth/login", { username, password });
        const { token } = response.data;
        localStorage.setItem("token", token);
        return token;
    } catch (error: any) {
        if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Login failed");
        }
    }
};

export const register = async (username: string, password: string, role: "AKADEMIK" | "ADMIN_KK"): Promise<any> => {
    try {
        const response = await api.post("/auth/register", { username, password, role });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Registration failed");
    }
};

export const logout = (): void => {
    localStorage.removeItem("token");
};