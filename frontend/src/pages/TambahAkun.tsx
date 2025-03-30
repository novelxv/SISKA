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

const TambahAkun: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "" as User["role"],
  });

  const handleSimpan = async () => {
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
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <select
            name="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as User["role"] })}
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

export default TambahAkun;
