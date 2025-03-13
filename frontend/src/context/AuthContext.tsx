import { createContext, useState, useEffect } from "react";
import { login as loginService, logout as logoutService } from "../services/authService";

interface AuthContextType {
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const login = async (username: string, password: string) => {
        const token = await loginService(username, password);
        setToken(token);
    };

    const logout = () => {
        logoutService();
        setToken(null);
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};