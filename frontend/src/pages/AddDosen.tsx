import React, { useState, FormEvent } from 'react';
import Sidebar from '../components/Navbar';
import InputField from '../components/Input';
import { ArrowLeft } from 'lucide-react';
import '../styles/AddDosen.css';
import '../styles/Global.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { RiArrowLeftSLine } from 'react-icons/ri';
import SortButtonNew from '../components/SortButtonNew';


export default function AddDosen() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaTanpaGelar: '',
    namaDenganGelar: '',
    nomorPegawai: '',
    nidn: '',
    pangkat: '',
    kelompokKeahlian: '',
    jabatanFungsional: '',
    jenisKepegawaian: '',
    statusKepegawaian: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Tidak ada token, silakan login kembali.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/dosen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal menambahkan dosen.");
      }

      alert("Dosen berhasil ditambahkan!");
      navigate("/dosen");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };

  const handleCancel = () => {
    navigate("/dosen");
  };

  return (
    <div className="sk-container">
      <Sidebar />
      <ToastContainer />
      <div className="dosen-content">
        <div className="form-container">
          <div className="formheader">
            <button className="back-button" onClick={handleCancel}>
              <RiArrowLeftSLine size={24} />
            </button>
            <h1 className="page-title" id="title-tambah-akun">Tambah Dosen</h1>
          </div>

          <form className="dosen-form" onSubmit={handleSubmit}>
            <InputField required label="Nama Dosen (Tanpa Gelar)" name="namaTanpaGelar" value={formData.namaTanpaGelar} onChange={handleChange} />
            <InputField required label="Nama Dosen (Dengan Gelar)" name="namaDenganGelar" value={formData.namaDenganGelar} onChange={handleChange} />
            <InputField label="Nomor Pegawai" name="nomorPegawai" value={formData.nomorPegawai} onChange={handleChange} />

            <div className="form-row">
              <InputField label="NIDN" name="nidn" value={formData.nidn} onChange={handleChange} />
              <InputField label="Pangkat" name="pangkat" value={formData.pangkat} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="kelompokKeahlian">Kelompok Keahlian</label>
                <SortButtonNew
                  options={[
                    "INFORMATIKA",
                    "TEKNIK_KETENAGALISTRIKAN",
                    "TEKNIK_TELEKOMUNIKASI",
                    "ELEKTRONIKA",
                    "SISTEM_KENDALI_DAN_KOMPUTER",
                    "TEKNIK_KOMPUTER",
                    "TEKNOLOGI_INFORMASI",
                    "REKAYASA_PERANGKAT_LUNAK_DAN_PENGETAHUAN",
                  ]}
                  selectedOption={formData.kelompokKeahlian}
                  placeholder="Pilih KK"
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, kelompokKeahlian: value }))
                  }
                />
              </div>

              <div className="form-group half-width">
                <label htmlFor="jabatanFungsional">Jabatan Fungsional</label>
                  <SortButtonNew
                    options={["ASISTEN_AHLI", "LEKTOR", "LEKTOR_KEPALA", "GURU_BESAR"]}
                    selectedOption={formData.jabatanFungsional}
                    placeholder="Pilih Jabatan Fungsional"
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, jabatanFungsional: value }))
                    }
                  />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="jenisKepegawaian">Jenis Kepegawaian</label>
                <SortButtonNew
                  options={[
                    "DOSEN_TETAP",
                    "DOSEN_TAK_TETAP_PENGAJAR",
                    "DOSEN_TAK_TETAP_PENELITI",
                    "DOSEN_LUAR_STEI",
                    "DOSEN_LUAR_ITB",
                    "DOSEN_INDUSTRI",
                    "TUTOR",
                  ]}
                  selectedOption={formData.jenisKepegawaian}
                  placeholder="Pilih Kepegawaian"
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, jenisKepegawaian: value }))
                  }
                />
              </div>

              <div className="form-group half-width">
                <label htmlFor="statusKepegawaian">Status Kepegawaian</label>
                <SortButtonNew
                  options={[
                    "AKTIF",
                    "TIDAK_AKTIF",
                    "PENSIUN",
                    "PENSIUN_JANDA_DUDA",
                    "MENGUNDURKAN_DIRI",
                    "DIBERHENTIKAN_HORMAT",
                  ]}
                  selectedOption={formData.statusKepegawaian}
                  placeholder="Pilih Kepegawaian"
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, statusKepegawaian: value }))
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-cancel" onClick={() => navigate("/dosen")}>
                Batal
              </button>
              <button type="submit" className="btn btn-save">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
