import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Navbar';
import InputField from "../components/Input";
import { ArrowLeft } from "lucide-react";
import "../styles/AddDosen.css";
import "../styles/Global.css";
import { useNavigate, useParams } from 'react-router-dom';  // useParams to get URL params
import { FormEvent } from 'react';

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
  

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="form-container">
          <h1 className="page-title">
            <ArrowLeft className="back-arrow" /> Edit Dosen
          </h1>

          <form className="dosen-form" onSubmit={handleSubmit}>
            <InputField
              label="Nama Dosen (Tanpa Gelar)"
              name="nama_tanpa_gelar"
              value={dosenData.nama_tanpa_gelar}
              onChange={(e) => setDosenData({ ...dosenData, nama_tanpa_gelar: e.target.value })}
            />

            <InputField
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
                <select
                  id="KK"
                  name="KK"
                  value={dosenData.KK}
                  onChange={(e) => setDosenData({ ...dosenData, KK: e.target.value })}
                >
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
                <label htmlFor="jabatan_fungsional">Jabatan Fungsional</label>
                <select
                  id="jabatan_fungsional"
                  name="jabatan_fungsional"
                  value={dosenData.jabatan_fungsional}
                  onChange={(e) => setDosenData({ ...dosenData, jabatan_fungsional: e.target.value })}
                >
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
                <label htmlFor="jenis_kepegawaian">Jenis _kepegawaian</label>
                <select
                  id="jenis_kepegawaian"
                  name="jenis_kepegawaian"
                  value={dosenData.jenis_kepegawaian}
                  onChange={(e) => setDosenData({ ...dosenData, jenis_kepegawaian: e.target.value })}
                >
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
                <label htmlFor="status_kepegawaian">Status _kepegawaian</label>
                <select
                  id="status_kepegawaian"
                  name="status_kepegawaian"
                  value={dosenData.status_kepegawaian}
                  onChange={(e) => setDosenData({ ...dosenData, status_kepegawaian: e.target.value })}
                >
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
