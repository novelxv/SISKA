import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/Login";
import SKList from "../pages/SKList";
import Dosen from "../pages/Dosen";
import AddDosen from "../pages/AddDosen";
import KelolaAkun from "../pages/KelolaAkun";
import TambahAkun from "../pages/TambahAkun";
import EditAkun from "../pages/EditAkun";
import DraftSK from "../pages/DraftSK";
import UploadExcelAkademik from "../pages/UploadExcelAkademik";
import ProtectedRoute from "./ProtectedRoute";
import SKDosenView from "../pages/SKDosenView";
import AdminProdi from "../pages/AdminProdi";

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
                    path="/tambah-dosen"
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
                    path="/sk/:no_sk/dosen"
                    element={
                        <ProtectedRoute>
                            <SKDosenView />
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
                    path="/edit-akun/:id"
                    element={
                        <ProtectedRoute allowedRoles={["AKADEMIK"]}>
                            <EditAkun />
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

                <Route
                    path="/upload-excel-akademik"
                    element={
                        <ProtectedRoute allowedRoles={["AKADEMIK"]}>
                            <UploadExcelAkademik />
                        </ProtectedRoute>
                    }
                />
                
                <Route
                    path="/upload-excel-prodi"
                    element={
                        <ProtectedRoute>
                            <AdminProdi />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRoutes;