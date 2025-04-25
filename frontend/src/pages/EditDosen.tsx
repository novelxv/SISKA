import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Navbar';
import InputField from "../components/Input";
import { ArrowLeft } from "lucide-react";
import "../styles/AddDosen.css";
import "../styles/Global.css";
import { useNavigate, useParams } from 'react-router-dom';  // useParams to get URL params
import { FormEvent } from 'react';

// Contoh fungsi fetch data dari API
const fetchDosenData = async (id: string) => {
  // Gantilah URL dengan endpoint API yang sesuai
  const response = await fetch(`/api/dosen/${id}`);
  const data = await response.json();
  return data;
};

export default function EditDosen() {
  const { id } = useParams();  // Ambil id dari URL params
  const navigate = useNavigate();

  // State untuk menampung data dosen
  const [dosenData, setDosenData] = useState({
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

  useEffect(() => {
    if (id) {
      fetchDosenData(id)
        .then(data => {
          setDosenData({
            namaTanpaGelar: data.namaTanpaGelar || '',
            namaDenganGelar: data.namaDenganGelar || '',
            nomorPegawai: data.nomorPegawai || '',
            nidn: data.nidn || '',
            pangkat: data.pangkat || '',
            kelompokKeahlian: data.kelompokKeahlian || '',
            jabatanFungsional: data.jabatanFungsional || '',
            jenisKepegawaian: data.jenisKepegawaian || '',
            statusKepegawaian: data.statusKepegawaian || '',
          });
        })
        .catch(error => {
          console.error('Error fetching dosen data:', error);
        });
    }
  }, [id]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lakukan proses update data dosen ke API atau server
    // Misalnya API update
    // fetch(`/api/dosen/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(dosenData),
    //   headers: { 'Content-Type': 'application/json' }
    // }).then(() => {
    //   navigate("/dosen");
    // });

    // Dummy navigation for now
    navigate("/dosen");
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
              name="namaTanpaGelar"
              value={dosenData.namaTanpaGelar}
              onChange={(e) => setDosenData({ ...dosenData, namaTanpaGelar: e.target.value })}
            />

            <InputField
              label="Nama Dosen (Dengan Gelar)"
              name="namaDenganGelar"
              value={dosenData.namaDenganGelar}
              onChange={(e) => setDosenData({ ...dosenData, namaDenganGelar: e.target.value })}
            />

            <InputField
              label="Nomor Pegawai"
              name="nomorPegawai"
              value={dosenData.nomorPegawai}
              onChange={(e) => setDosenData({ ...dosenData, nomorPegawai: e.target.value })}
            />

            <div className="form-row">
              <InputField
                label="NIDN"
                name="nidn"
                value={dosenData.nidn}
                onChange={(e) => setDosenData({ ...dosenData, nidn: e.target.value })}
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
                <label htmlFor="kelompokKeahlian">Kelompok Keahlian</label>
                <select
                  id="kelompokKeahlian"
                  name="kelompokKeahlian"
                  value={dosenData.kelompokKeahlian}
                  onChange={(e) => setDosenData({ ...dosenData, kelompokKeahlian: e.target.value })}
                >
                  <option value="">Pilih Opsi</option>
                  <option value="komputer">KK Informatika</option>
                  {/* Tambahkan opsi lainnya */}
                </select>
              </div>

              <div className="form-group half-width">
                <label htmlFor="jabatanFungsional">Jabatan Fungsional</label>
                <select
                  id="jabatanFungsional"
                  name="jabatanFungsional"
                  value={dosenData.jabatanFungsional}
                  onChange={(e) => setDosenData({ ...dosenData, jabatanFungsional: e.target.value })}
                >
                  <option value="">Pilih Opsi</option>
                  <option value="asisten">Asisten Ahli</option>
                  {/* Tambahkan opsi lainnya */}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="jenisKepegawaian">Jenis Kepegawaian</label>
                <select
                  id="jenisKepegawaian"
                  name="jenisKepegawaian"
                  value={dosenData.jenisKepegawaian}
                  onChange={(e) => setDosenData({ ...dosenData, jenisKepegawaian: e.target.value })}
                >
                  <option value="">Pilih Opsi</option>
                  <option value="tetap">Dosen Tetap</option>
                  {/* Tambahkan opsi lainnya */}
                </select>
              </div>

              <div className="form-group half-width">
                <label htmlFor="statusKepegawaian">Status Kepegawaian</label>
                <select
                  id="statusKepegawaian"
                  name="statusKepegawaian"
                  value={dosenData.statusKepegawaian}
                  onChange={(e) => setDosenData({ ...dosenData, statusKepegawaian: e.target.value })}
                >
                  <option value="">Pilih Opsi</option>
                  <option value="aktif">Aktif</option>
                  {/* Tambahkan opsi lainnya */}
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
