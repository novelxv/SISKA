import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import SKList from "../pages/SKList";
import KelolaAkun from "../pages/KelolaAkun";
import DraftSK from "../pages/DraftSK";

const AppRoutes = () => {
    const auth = useContext(AuthContext);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dosen" element={auth?.token ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/sk" element={auth?.token ? <SKList /> : <Navigate to="/login" />} />
                <Route path="/kelola-akun" element={auth?.token ? <KelolaAkun /> : <Navigate to="/login" />} />
                <Route path="/draft-sk" element={auth?.token ? <DraftSK /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;