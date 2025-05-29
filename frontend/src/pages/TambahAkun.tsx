import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Navbar";
import "../styles/Global.css";
import { RiArrowLeftSLine } from "react-icons/ri";
import "../styles/TambahAkun.css";
import InputField from "../components/Input";
import { toast } from "react-toastify";
import { register } from "../services/authService";
import { User } from "../services/userService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SortButtonNew from "../components/SortButtonNew";

const TambahAkun: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "" as User["role"],
    jenisKK: "",
    jenisProdi: "",
  });

  const mapProdiToEnum = (prodi: string) => `PRODI_${prodi}`;

  const handleSimpan = async () => {
    // Validasi username
    if (formData.username.length < 5 || formData.username.length > 20) {
      toast.error("Username harus memiliki panjang antara 5 hingga 20 karakter.");
      return;
    }

    // Validasi password
    if (formData.password.length < 8) {
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

    console.log(formData.jenisKK)
    console.log(formData.jenisProdi)

    try {
      await register(
        formData.username,
        formData.password,
        formData.role,
        formData.jenisKK || undefined,
        formData.jenisProdi || undefined
      );
      toast.success("Akun berhasil ditambahkan!");
      navigate("/kelola-akun");
    } catch (error: any) {
      console.error("Error adding user:", error);
      toast.error(error.message || "Gagal menambahkan akun");
    }
  };

  const handleCancel = () => {
    navigate("/kelola-akun");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let cleanedValue = value.trimStart();

    if (name === "username") {
      cleanedValue = cleanedValue.replace(/[^a-zA-Z0-9]/g, "");
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: cleanedValue,
    }));
  };

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

  const prodiOptions = [
    { label: "132 - Teknik Elektro", value: "PRODI_132" },
    { label: "135 - Teknik Informatika", value: "PRODI_135" },
    { label: "180 - Teknik Tenaga Listrik", value: "PRODI_180" },
    { label: "181 - Teknik Telekomunikasi", value: "PRODI_181" },
    { label: "182 - Sistem dan Teknologi Informasi", value: "PRODI_182" },
    { label: "183 - Teknik Biomedis", value: "PRODI_183" },
    { label: "232 - Teknik Elektro", value: "PRODI_232" },
    { label: "235 - Teknik Informatika", value: "PRODI_235" },
    { label: "332 - Teknik Elektro dan Informatika", value: "PRODI_332" },
    { label: "932 - PPI - Teknik Elektro", value: "PRODI_932" },
    { label: "935 - PPI - Teknik Informatika", value: "PRODI_935" },
  ]

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
            <h1 className="page-title" id="title-tambah-akun">Tambah Akun</h1>
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
                      setFormData({ ...formData, jenisKK: value });
                    }}
                  />
                </div>
              )}
            </div>
            {formData.role === "ADMIN_PRODI" && (
              <div className="akun-sort-filter-select">
                <SortButtonNew
                  options={prodiOptions.map((prodi) => prodi.label)}
                  selectedOption={prodiOptions.find((prodi) => prodi.value === formData.jenisProdi)?.label || ""}
                  placeholder="Pilih Program Studi"
                  onChange={(label) => {
                    const value = prodiOptions.find((prodi) => prodi.label === label)?.value || "";
                    setFormData({ ...formData, jenisProdi: value });
                  }}
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

export default TambahAkun;
