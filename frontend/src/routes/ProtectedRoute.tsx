import { JSX, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: JSX.Element;
    allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const auth = useContext(AuthContext);

    if (!auth?.isInitialized) {
        return <div>Loading...</div>;
    }
    if (!auth?.token) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(auth.role ?? "")) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;