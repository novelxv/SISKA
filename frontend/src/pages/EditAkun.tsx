import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Navbar";
import "../styles/Global.css";
import { RiArrowLeftSLine } from "react-icons/ri";
import "../styles/EditAkun.css";
import InputField from "../components/Input";
import { toast } from "react-toastify";
import { User, getUserById, updateUser } from "../services/userService";
import { AuthContext } from "../context/AuthContext";

const EditAkun: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const auth = useContext(AuthContext);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "" as User["role"],
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!auth?.token) {
            navigate("/login");
        } else if (auth?.role !== "AKADEMIK") {
            toast.error("Akses ditolak. Hanya pengguna AKADEMIK yang bisa mengakses halaman ini.");
            navigate("/login");
        }
    }, [auth]);

    useEffect(() => {
        const fetchUser = async () => {
            if (id) {
                try {
                    const userData = await getUserById(parseInt(id));
                    setFormData({
                        username: userData.username,
                        password: "",
                        role: userData.role,
                    });
                } catch (error) {
                    toast.error("Gagal mengambil data user");
                    navigate("/kelola-akun");
                }
            }
        };
        fetchUser();
    }, [id]);

    const handleSimpan = async () => {
        try {
            if (id) {
                await updateUser(parseInt(id), formData);
                toast.success("Akun berhasil diedit!");
                navigate("/kelola-akun");
            }
        } catch (error: any) {
            console.error("Error edit user:", error);
            toast.error(error.message || "Gagal mengedit akun");
        }
    };

    const handleCancel = () => {
        navigate("/kelola-akun");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let cleanedValue = value.trimStart();
        if (name === "username") {
            cleanedValue = cleanedValue.replace(/[^a-zA-Z0-9]/g, '');
        }

        setFormData((prevState) => ({
            ...prevState,
            [name]: cleanedValue,
        }));
    };

    return (
        <div className="page-container">
            <Sidebar />
            <div className="content-area">
                <div className="form-container">
                    <div className="formheader">
                        <button className="back-button" onClick={handleCancel}>
                            <RiArrowLeftSLine size={24} />
                        </button>
                        <h1 className="page-title" id="title-tambah-akun">Edit Akun</h1>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSimpan();
                        }}
                    >
                        <InputField
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <div className="password-container">
                            <InputField
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {!showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>

                        </div>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({ ...formData, role: e.target.value as User["role"] })
                            }
                            required
                        >
                            <option value="">Pilih Role</option>
                            <option value="AKADEMIK">AKADEMIK</option>
                            <option value="ADMIN_KK">ADMIN KK</option>
                            <option value="ADMIN_PRODI">ADMIN PRODI</option>
                        </select>

                        <div className="button-group">
                            <button type="button" onClick={handleCancel} className="btn-cancel">
                                Batal
                            </button>
                            <button type="submit" className="btn-save">
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditAkun;