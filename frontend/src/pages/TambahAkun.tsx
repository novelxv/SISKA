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
import SortButtonNew from "../components/SortButtonNew"; // Import komponen SortButtonNew

const TambahAkun: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "" as User["role"],
  });

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

    try {
        await register(formData.username, formData.password, formData.role);
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
        cleanedValue = cleanedValue.replace(/[^a-zA-Z0-9]/g, ''); // Hanya izinkan karakter alfanumerik
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
  
  return (
    <div className="page-container">
      <Sidebar />
      <ToastContainer />
      <div className="content-area">
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

            <div className="akun-sort-filter-select">
            <SortButtonNew
                options={roleOptions.map((r) => r.label)}
                selectedOption={roleOptions.find((r) => r.value === formData.role)?.label || ""}
                placeholder="Pilih role"
                onChange={(label) => {
                    const value = roleOptions.find((r) => r.label === label)?.value || "";
                    setFormData({ ...formData, role: value as User["role"] });
                }}
              />
            </div>

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
