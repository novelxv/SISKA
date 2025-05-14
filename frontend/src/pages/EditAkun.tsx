import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Navbar";
import "../styles/Global.css";
import { RiArrowLeftSLine } from "react-icons/ri";
import "../styles/EditAkun.css";
import InputField from "../components/Input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, getUserById, updateUser } from "../services/userService";
import { AuthContext } from "../context/AuthContext";
import SortButtonNew from "../components/SortButtonNew";

const EditAkun: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const auth = useContext(AuthContext);

    const roleOptions = [
        { label: "Akademik", value: "AKADEMIK" },
        { label: "Admin KK", value: "ADMIN_KK" },
        { label: "Admin Prodi", value: "ADMIN_PRODI" },
    ];

    const kkOptions = [
        { label: "Teknik Biomedis", value: "TEKNIK_BIOMEDIS" },
        { label: "Teknik Komputer", value: "TEKNIK_KOMPUTER" },
        { label: "Sistem Kendali dan Komputer", value: "SISTEM_KENDALI_DAN_KOMPUTER" },
        { label: "Teknik Ketenagalistrikan", value: "TEKNIK_KETENAGALISTRIKAN" },
        { label: "Elektronika", value: "ELEKTRONIKA" },
        { label: "Informatika", value: "INFORMATIKA" },
        { label: "Teknologi Informasi", value: "TEKNOLOGI_INFORMASI" },
        { label: "Teknik Telekomunikasi", value: "TEKNIK_TELEKOMUNIKASI" },
        { label: "Rekayasa Perangkat Lunak dan Pengetahuan", value: "REKAYASA_PERANGKAT_LUNAK_DAN_PENGETAHUAN" },
    ];

    const prodiOptions = ["132", "135", "180", "181", "182", "183", "232", "235", "332", "932", "935"];

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "" as User["role"],
        jenisKK: "",
        jenisProdi: "",
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
                        jenisKK: userData.jenisKK || "",
                        jenisProdi: userData.jenisProdi || "",
                    });
                } catch (error) {
                    toast.error("Gagal mengambil data user");
                    navigate("/kelola-akun");
                }
            }
        };
        fetchUser();
    }, [id]);

    const mapProdiToEnum = (prodi: string) => `PRODI_${prodi}`;

    const handleSimpan = async () => {
        // Validasi username
        if (formData.username.length < 5 || formData.username.length > 20) {
            toast.error("Username harus memiliki panjang antara 5 hingga 20 karakter.");
            return;
        }

        // Validasi password (jika diubah)
        if (formData.password && formData.password.length < 8) {
            toast.error("Password harus memiliki panjang minimal 8 karakter.");
            return;
        }

        // Validasi role
        if (!formData.role) {
            toast.error("Role harus dipilih.");
            return;
        }

        // Validasi jenisKK untuk ADMIN_KK
        if (formData.role === "ADMIN_KK" && !formData.jenisKK) {
            toast.error("Jenis KK harus dipilih untuk role Admin KK.");
            return;
        }

        // Validasi jenisProdi untuk ADMIN_PRODI
        if (formData.role === "ADMIN_PRODI" && !formData.jenisProdi) {
            toast.error("Jenis Prodi harus dipilih untuk role Admin Prodi.");
            return;
        }

        try {
            if (id) {
                formData.jenisProdi = formData.jenisProdi ? mapProdiToEnum(formData.jenisProdi) : null;
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
            cleanedValue = cleanedValue.replace(/[^a-zA-Z0-9]/g, ""); // Hanya izinkan karakter alfanumerik
        }

        setFormData((prevState) => ({
            ...prevState,
            [name]: cleanedValue,
        }));
    };

    return (
        <div className="page-container">
            <Sidebar />
            <ToastContainer />
            <div className="dosen-content">
                <div className="form-container">
                    <div className="formheader">
                        <button className="back-button" onClick={handleCancel}>
                            <RiArrowLeftSLine size={24} />
                        </button>
                        <h1 className="page-title" id="title-edit-akun">Edit Akun</h1>
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

                        <div className="akun-dropdown">
                            <div className="akun-sort-filter-select">
                                <SortButtonNew
                                    options={roleOptions.map((r) => r.label)}
                                    selectedOption={roleOptions.find((r) => r.value === formData.role)?.label || ""}
                                    placeholder="Pilih role"
                                    onChange={(label) => {
                                        const value = roleOptions.find((r) => r.label === label)?.value || "";
                                        setFormData({ ...formData, role: value as User["role"], jenisKK: "", jenisProdi: "" });
                                    }}
                                />
                            </div>
                                {formData.role === "ADMIN_KK" && (
                                    <div className="akun-sort-filter-select" id="sort-kk">
                                        <SortButtonNew
                                        options={kkOptions.map((kk) => kk.label)}
                                        selectedOption={kkOptions.find((kk) => kk.value === formData.jenisKK)?.label || ""}
                                        placeholder="Pilih Kelompok Keahlian"
                                        onChange={(label) => {
                                            const value = kkOptions.find((kk) => kk.label === label)?.value || "";
                                            setFormData({ ...formData, jenisKK: value, jenisProdi: null }); // jangan diubah, biarin aja error
                                        }}
                                        />
                                    </div>
                                )}
                        </div>

                        {formData.role === "ADMIN_PRODI" && (
                            <div className="akun-sort-filter-select">
                                <SortButtonNew
                                    options={prodiOptions}
                                    selectedOption={formData.jenisProdi || ""}
                                    placeholder="Pilih Program Studi"
                                    onChange={(value) => setFormData({ ...formData, jenisKK: null, jenisProdi: value })} // jangan diubah, biarin aja error
                                />
                            </div>
                        )}
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