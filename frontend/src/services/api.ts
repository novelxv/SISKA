import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://103.107.4.28:3000"}/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;