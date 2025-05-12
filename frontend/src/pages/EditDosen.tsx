import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Navbar';
import InputField from "../components/Input";
import { ArrowLeft } from "lucide-react";
import "../styles/AddDosen.css";
import "../styles/Global.css";
import { useNavigate, useParams } from 'react-router-dom';  // useParams to get URL params
import { FormEvent } from 'react';
import SortButtonNew from '../components/SortButtonNew';
import { ToastContainer } from 'react-toastify';
import { RiArrowLeftSLine } from 'react-icons/ri';

const fetchDosenData = async (id: string) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`http://localhost:3000/api/dosen/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil data dosen. Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};


export default function EditDosen() {
  const { id } = useParams();  // Ambil id dari URL params
  const navigate = useNavigate();

  // State untuk menampung data dosen
  const [dosenData, setDosenData] = useState({
    nama_tanpa_gelar: '',
    nama_dengan_gelar: '',
    NIP: '',
    NIDN: '',
    pangkat: '',
    KK: '',
    jabatan_fungsional: '',
    jenis_kepegawaian: '',
    status_kepegawaian: '',
  });

  useEffect(() => {
    if (id) {
      fetchDosenData(id)
        .then(data => {
          setDosenData({
            nama_tanpa_gelar: data.nama_tanpa_gelar || '',
            nama_dengan_gelar: data.nama_plus_gelar || '',
            NIP: data.NIP || '',
            NIDN: data.NIDN || '',
            pangkat: data.pangkat || '',
            KK: data.KK || '',
            jabatan_fungsional: data.jabatan_fungsional || '',
            jenis_kepegawaian: data.jenis_kepegawaian || '',
            status_kepegawaian: data.status_kepegawaian || '',
          });
        })
        .catch(error => {
          console.error('Error fetching dosen data:', error);
        });
    }
  }, [id]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    fetch(`http://localhost:3000/api/dosen/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dosenData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (response.status === 401) {
          // Token tidak valid atau kadaluarsa
          alert("Sesi Anda telah berakhir. Silakan login kembali.");
          localStorage.removeItem("token");
          navigate("/login"); // ganti dengan route login kamu
          return;
        }
  
        if (!response.ok) {
          throw new Error("Gagal menyimpan data dosen.");
        }
  
        return response.json();
      })
      .then(() => {
        navigate("/dosen");
      })
      .catch(error => {
        console.error("Error saat menyimpan data dosen:", error);
        alert("Terjadi kesalahan saat menyimpan data.");
      });
  };

  const handleCancel = () => {
    navigate("/dosen");
  };
  

  return (
    <div className="sk-container">
      <Sidebar />
      <ToastContainer />
      <div className="form-container">
        <div className="form-container">
          <div className="formheader">
            <button className="back-button" onClick={handleCancel}>
              <RiArrowLeftSLine size={24} />
            </button>
            <h1 className="page-title" id="title-tambah-akun">Edit Dosen</h1>
          </div>
          
          <form className="dosen-form" onSubmit={handleSubmit}>
            <InputField
              required
              label="Nama Dosen (Tanpa Gelar)"
              name="nama_tanpa_gelar"
              value={dosenData.nama_tanpa_gelar}
              onChange={(e) => setDosenData({ ...dosenData, nama_tanpa_gelar: e.target.value })}
            />

            <InputField
              required
              label="Nama Dosen (Dengan Gelar)"
              name="nama_dengan_gelar"
              value={dosenData.nama_dengan_gelar}
              onChange={(e) => setDosenData({ ...dosenData, nama_dengan_gelar: e.target.value })}
            />

            <InputField
              label="Nomor Pegawai"
              name= "NIP"
              value={dosenData.NIP}
              onChange={(e) => setDosenData({ ...dosenData, NIP: e.target.value })}
            />

            <div className="form-row">
              <InputField
                label="NIDN"
                name="NIDN"
                value={dosenData.NIDN}
                onChange={(e) => setDosenData({ ...dosenData, NIDN: e.target.value })}
              />
              <InputField
                label="Pangkat"
                name="pangkat"
                value={dosenData.pangkat}
                onChange={(e) => setDosenData({ ...dosenData, pangkat: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="KK">Kelompok Keahlian</label>
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
                  selectedOption={dosenData.KK}
                  placeholder="Pilih KK"
                  onChange={(value) => setDosenData((prev) => ({ ...prev, KK: value }))}
                />
              </div>

              <div className="form-group half-width">
                <label htmlFor="jabatan_fungsional">Jabatan Fungsional</label>
                <SortButtonNew
                  options={["ASISTEN_AHLI", "LEKTOR", "LEKTOR_KEPALA", "GURU_BESAR"]}
                  selectedOption={dosenData.jabatan_fungsional}
                  placeholder="Pilih Jabatan Fungsional"
                  onChange={(value) => setDosenData((prev) => ({ ...prev, jabatan_fungsional: value }))}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="jenis_kepegawaian">Jenis _kepegawaian</label>
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
                  selectedOption={dosenData.jenis_kepegawaian}
                  placeholder="Pilih Jenis Kepegawaian"
                  onChange={(value) => setDosenData((prev) => ({ ...prev, jenis_kepegawaian: value }))}
                />
              </div>

              <div className="form-group half-width">
                <label htmlFor="status_kepegawaian">Status _kepegawaian</label>
                <SortButtonNew
                  options={[
                    "AKTIF",
                    "TIDAK_AKTIF",
                    "PENSIUN",
                    "PENSIUN_JANDA_DUDA",
                    "MENGUNDURKAN_DIRI",
                    "DIBERHENTIKAN_HORMAT",
                  ]}
                  selectedOption={dosenData.status_kepegawaian}
                  placeholder="Pilih Status"
                  onChange={(value) => setDosenData((prev) => ({ ...prev, status_kepegawaian: value }))}
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
