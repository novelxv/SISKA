import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Navbar";
import "../styles/Global.css";
import { RiArrowLeftSLine } from "react-icons/ri";
import "../styles/TambahAkun.css";
import InputField from "../components/Input";
import { toast } from "react-toastify";


const TambahAkun: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSimpan = () => {
    console.log("Saved:", formData);
    toast.success("Akun berhasil ditambahkan!");
    navigate("/kelola-akun");
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
          <div className="header">
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
