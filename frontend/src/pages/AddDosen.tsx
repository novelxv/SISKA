import React from 'react';
import Sidebar from '../components/Navbar';
import InputField from "../components/Input" 
import { ArrowLeft } from "lucide-react"
import "../styles/AddDosen.css"
import "../styles/Global.css";
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState } from 'react';

export default function AddDosen() {
  const navigate = useNavigate()
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/dosen");
    //dummy
  }
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="form-container">
          <h1 className="page-title">
            <ArrowLeft className="back-arrow" /> Tambah Dosen
          </h1>

          <form className="dosen-form" onSubmit={handleSubmit}>
            <InputField 
              label="Nama Dosen (Tanpa Gelar)"
              name = "Nama Dosen (Tanpa Gelar)"
              value=""
            />

            <InputField
              label="Nama Dosen (Dengan Gelar)"
              name="Nama Dosen (Dengan Gelar)"
              value=""
            />

            <InputField
              label="Nomor Pegawai"
              name="Nomor Pegawai"
              value=""
            />

            <div className="form-row">
              <InputField
                label="NIDN"
                name="NIDN"
                value=""

              />
              <InputField
                label="Pangkat"
                name="Pangkat"
                value=""
              />
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="kelompokKeahlian">Kelompok Keahlian</label>
                <select id="kelompokKeahlian" name="kelompokKeahlian">
                  <option value="">Pilih Opsi</option>
                  <option value="komputer">KK Informatika</option>
                  <option value="komputer">KK Teknik Ketenagalistrikan</option>
                  <option value="komputer">KK Teknik Telekomunikasi</option>
                  <option value="komputer">KK Elektronika</option>
                  <option value="komputer">KK Sistem dan Komputer</option>
                  <option value="komputer">KK Teknik Komputer</option>
                  <option value="komputer">KK Teknik Biomedika</option>
                  <option value="komputer">KK Teknologi Informasi</option>
                  <option value="komputer">KK Rekayasa Perangkat Lunak dan Pengetahuan</option>
                </select>
              </div>

              <div className="form-group half-width">
                <label htmlFor="jabatanFungsional">Jabatan Fungsional</label>
                <select id="jabatanFungsional" name="jabatanFungsional">
                  <option value="">Pilih Opsi</option>
                  <option value="asisten">Asisten Ahli</option>
                  <option value="lektor">Lektor</option>
                  <option value="lektorKepala">Lektor Kepala</option>
                  <option value="lektorKepala">Guru Besar</option>

                  <option value="profesor">Profesor</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="jenisKepegawaian">Jenis Kepegawaian</label>
                <select id="jenisKepegawaian" name="jenisKepegawaian">
                  <option value="">Pilih Opsi</option>
                  <option value="tetap">Dosen Tetap</option>
                  <option value="kontrak">Dosen Tidak Tetap Pengajar</option>
                  <option value="honorer">Dosen Tidak Tetap Peneliti</option>
                  <option value="honorer">Dosen Luar STEI</option>
                  <option value="honorer">Dosen Luar ITB</option>
                  <option value="honorer">Dosen Industri</option>
                  <option value="honorer">Tutor</option>
                </select>
              </div>

              <div className="form-group half-width">
                <label htmlFor="statusKepegawaian">Status Kepegawaian</label>
                <select id="statusKepegawaian" name="statusKepegawaian">
                  <option value="">Pilih Opsi</option>
                  <option value="aktif">Aktif</option>
                  <option value="cuti">Tugas Belajar</option>
                  <option value="pensiun">Pensiun</option>
                  <option value="pensiun">Pensiun Janda/Duda</option>
                  <option value="pensiun">Mengundurkan Diri</option>
                  <option value="pensiun">Diberhentikan hormat</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-cancel">
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