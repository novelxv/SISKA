import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/Login";
import SKList from "../pages/SKList";
import Dosen from "../pages/Dosen";
import AddDosen from "../pages/AddDosen";
import KelolaAkun from "../pages/KelolaAkun";
import TambahAkun from "../pages/TambahAkun";
import DraftSK from "../pages/DraftSK";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    const auth = useContext(AuthContext);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/dosen"
                    element={
                        <ProtectedRoute>
                            <Dosen />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dosen/:nama"
                    element={
                        <ProtectedRoute>
                            <Dosen />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/add-dosen"
                    element={
                        <ProtectedRoute>
                            <AddDosen />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/sk"
                    element={
                        <ProtectedRoute>
                            <SKList />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/draft-sk"
                    element={
                        <ProtectedRoute>
                            <DraftSK />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/kelola-akun"
                    element={
                        <ProtectedRoute allowedRoles={["AKADEMIK"]}>
                            <KelolaAkun />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tambah-akun"
                    element={
                        <ProtectedRoute allowedRoles={["AKADEMIK"]}>
                            <TambahAkun />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRoutes;