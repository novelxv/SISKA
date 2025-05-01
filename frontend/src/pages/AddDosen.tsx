import React, { useState, FormEvent } from 'react';
import Sidebar from '../components/Navbar';
import InputField from '../components/Input';
import { ArrowLeft } from 'lucide-react';
import '../styles/AddDosen.css';
import '../styles/Global.css';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="form-container">
          <h1 className="page-title">
            <ArrowLeft className="back-arrow" /> Tambah Dosen
          </h1>

          <form className="dosen-form" onSubmit={handleSubmit}>
            <InputField label="Nama Dosen (Tanpa Gelar)" name="namaTanpaGelar" value={formData.namaTanpaGelar} onChange={handleChange} />
            <InputField label="Nama Dosen (Dengan Gelar)" name="namaDenganGelar" value={formData.namaDenganGelar} onChange={handleChange} />
            <InputField label="Nomor Pegawai" name="nomorPegawai" value={formData.nomorPegawai} onChange={handleChange} />

            <div className="form-row">
              <InputField label="NIDN" name="nidn" value={formData.nidn} onChange={handleChange} />
              <InputField label="Pangkat" name="pangkat" value={formData.pangkat} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="kelompokKeahlian">Kelompok Keahlian</label>
                <select id="kelompokKeahlian" name="kelompokKeahlian" value={formData.kelompokKeahlian} onChange={handleChange}>
                  <option value="">Pilih Opsi</option>
                  <option value="INFORMATIKA">KK Informatika</option>
                  <option value="TEKNIK_KETENAGALISTRIKAN">KK Teknik Ketenagalistrikan</option>
                  <option value="TEKNIK_TELEKOMUNIKASI">KK Teknik Telekomunikasi</option>
                  <option value="ELEKTRONIKA">KK Elektronika</option>
                  <option value="SISTEM_KENDALI_DAN_KOMPUTER">KK Sistem Kendali dan Komputer</option>
                  <option value="TEKNIK_KOMPUTER">KK Teknik Komputer</option>
                  <option value="TEKNOLOGI_INFORMASI">KK Teknologi Informasi</option>
                  <option value="REKAYASA_PERANGKAT_LUNAK_DAN_PENGETAHUAN">KK Rekayasa Perangkat Lunak dan Pengetahuan</option>
                </select>
              </div>

              <div className="form-group half-width">
                <label htmlFor="jabatanFungsional">Jabatan Fungsional</label>
                <select id="jabatanFungsional" name="jabatanFungsional" value={formData.jabatanFungsional} onChange={handleChange}>
                  <option value="">Pilih Opsi</option>
                  <option value="ASISTEN_AHLI">Asisten Ahli</option>
                  <option value="LEKTOR">Lektor</option>
                  <option value="LEKTOR_KEPALA">Lektor Kepala</option>
                  <option value="GURU_BESAR">Guru Besar</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="jenisKepegawaian">Jenis Kepegawaian</label>
                <select id="jenisKepegawaian" name="jenisKepegawaian" value={formData.jenisKepegawaian} onChange={handleChange}>
                  <option value="">Pilih Opsi</option>
                  <option value="DOSEN_TETAP">Dosen Tetap</option>
                  <option value="DOSEN_TAK_TETAP_PENGAJAR">Dosen Tidak Tetap Pengajar</option>
                  <option value="DOSEN_TAK_TETAP_PENELITI">Dosen Tidak Tetap Peneliti</option>
                  <option value="DOSEN_LUAR_STEI">Dosen Luar STEI</option>
                  <option value="DOSEN_LUAR_ITB">Dosen Luar ITB</option>
                  <option value="DOSEN_INDUSTRI">Dosen Industri</option>
                  <option value="TUTOR">Tutor</option>
                </select>
              </div>

              <div className="form-group half-width">
                <label htmlFor="statusKepegawaian">Status Kepegawaian</label>
                <select id="statusKepegawaian" name="statusKepegawaian" value={formData.statusKepegawaian} onChange={handleChange}>
                  <option value="">Pilih Opsi</option>
                  <option value="AKTIF">Aktif</option>
                  <option value="TIDAK_AKTIF">Tidak Aktif</option>
                  <option value="PENSIUN">Pensiun</option>
                  <option value="PENSIUN_JANDA_DUDA">Pensiun Janda/Duda</option>
                  <option value="MENGUNDURKAN_DIRI">Mengundurkan Diri</option>
                  <option value="DIBERHENTIKAN_HORMAT">Diberhentikan hormat</option>
                </select>
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
