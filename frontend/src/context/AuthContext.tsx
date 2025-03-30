import { createContext, useState, useEffect } from "react";
import { login as loginService, logout as logoutService } from "../services/authService";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    username: string;
    role: string;
    iat: number;
    exp: number;
}

interface AuthContextType {
    token: string | null;
    role: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isInitialized: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const login = async (username: string, password: string) => {
        const token = await loginService(username, password);
        setToken(token);

        const decoded = jwtDecode<DecodedToken>(token);
        setRole(decoded.role);
    };

    const logout = () => {
        logoutService();
        setToken(null);
        setRole(null);
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            try {
                const decoded = jwtDecode<DecodedToken>(savedToken);
                if (decoded.exp * 1000 > Date.now()) {
                    setToken(savedToken);
                    setRole(decoded.role);
                } else {
                    logoutService();
                }
            } catch {
                logoutService();
            }
        }
        setIsInitialized(true);
    }, []);

    return (
        <AuthContext.Provider value={{ token, role, login, logout, isInitialized }}>
            {children}
        </AuthContext.Provider>
    );
};