import type React from "react"

import { useState } from "react"
import { FaFileArrowUp } from "react-icons/fa6"
import { FaDownload } from "react-icons/fa"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Sidebar from "../components/Navbar"
import ButtonWithIcon from "../components/Button"
import "../styles/Global.css"
import "../styles/SK.css"
import "../styles/UploadExcelAkademik.css"
import dosenWaliTemplate from "../assets/template-excel-dosen-wali.xlsx"
import asistenTemplate from "../assets/template-excel-asisten.xlsx"
import dosbingAktifTemplate from "../assets/template-excel-dosen-pembimbing-aktif.xlsx"

import { uploadExcelDosenWali, uploadExcelAsisten, uploadExcelDosbingAktif } from "../services/excelService"

const UploadExcelAkademik = () => {
  const [dosenWaliFile, setDosenWaliFile] = useState<File | null>(null)
  const [dosenWaliFileName, setDosenWaliFileName] = useState<string | null>(null)
  const [asistenFile, setAsistenFile] = useState<File | null>(null)
  const [asistenFileName, setAsistenFileName] = useState<string | null>(null)
  const [dosbingAktifFile, setDosbingAktifFile] = useState<File | null>(null)
  const [dosbingAktifFileName, setDosbingAktifFileName] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleDownloadDosenWaliTemplate = () => {
    try {
      // Create a link to download the template
      const link = document.createElement("a")
      link.href = dosenWaliTemplate
      link.download = "template-excel-dosen-wali.xlsx"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.info("Template Excel Dosen Wali berhasil diunduh")
    } catch (error) {
      toast.error("Gagal mengunduh template Excel Dosen Wali")
    }
  }

  const handleDownloadAsistenTemplate = () => {
    try {
      // Create a link to download the template
      const link = document.createElement("a")
      link.href = asistenTemplate
      link.download = "template-excel-asisten.xlsx"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.info("Template Excel Asisten Perkuliahan dan Praktikum berhasil diunduh")
    } catch (error) {
      toast.error("Gagal mengunduh template Excel Asisten Perkuliahan dan Praktikum")
    }
  }

    const handleDownloadDosbingAktifTemplate = () => {
    try {
      const link = document.createElement("a")
      link.href = dosbingAktifTemplate
      link.download = "template-excel-dosen-pembimbing-aktif.xlsx"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.info("Template Excel Dosen Pembimbing Mahasiswa Aktif berhasil diunduh")
    } catch (error) {
      toast.error("Gagal mengunduh template Excel Dosen Pembimbing Mahasiswa Aktif")
    }
  }

  const handleDosenWaliFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        toast.error("File harus berformat Excel (.xlsx atau .xls)")
        return
      }
      setDosenWaliFile(file)
      setDosenWaliFileName(file.name)
    }
  }

  const handleAsistenFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        toast.error("File harus berformat Excel (.xlsx atau .xls)")
        return
      }
      setAsistenFile(file)
      setAsistenFileName(file.name)
    }
  }

    const handleDosbingAktifFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        toast.error("File harus berformat Excel (.xlsx atau .xls)")
        return
      }
      setDosbingAktifFile(file)
      setDosbingAktifFileName(file.name)
    }
  }

  const handleUploadDosenWali = async () => {
    if (!dosenWaliFile) {
      toast.warning("Silakan pilih file Excel Dosen Wali terlebih dahulu")
      return
    }

    setIsUploading(true)
    try {
      const response = await uploadExcelDosenWali(dosenWaliFile)
      toast.success(response.message || "File Excel Dosen Wali berhasil diunggah")
      setDosenWaliFile(null)
      setDosenWaliFileName(null)
      ;(document.getElementById("dosenWaliInput") as HTMLInputElement).value = ""
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Gagal mengunggah file Excel Dosen Wali"
      toast.error(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }

  const handleUploadAsisten = async () => {
    if (!asistenFile) {
      toast.warning("Silakan pilih file Excel Asisten Perkuliahan dan Praktikum terlebih dahulu");
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadExcelAsisten(asistenFile);
      toast.success(response.message || "File Excel Asisten Perkuliahan dan Praktikum berhasil diunggah");
      setAsistenFile(null);
      setAsistenFileName(null);
      (document.getElementById("asistenInput") as HTMLInputElement).value = ""; // Reset input file
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Gagal mengunggah file Excel Asisten Perkuliahan dan Praktikum";
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

    const handleUploadDosbingAktif = async () => {
      if (!dosbingAktifFile) {
        toast.warning("Silakan pilih file Excel Dosen Pembimbing Mahasiswa Aktif terlebih dahulu");
        return;
      }

      setIsUploading(true);
      try {
        const response = await uploadExcelDosbingAktif(dosbingAktifFile);
        toast.success(response.message || "File Excel Dosen Pembimbing Mahasiswa Aktif berhasil diunggah");
        setDosbingAktifFile(null);
        setDosbingAktifFileName(null);
        (document.getElementById("dosbingAktifInput") as HTMLInputElement).value = "";
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Gagal mengunggah file Excel Dosen Pembimbing Mahasiswa Aktif";
        toast.error(errorMsg);
      } finally {
        setIsUploading(false);
      }
  };


  return (
    <div className="sk-container">
      <Sidebar />
      <ToastContainer />
      <div className="sk-content">
        <div className="header">
          <h1>Upload Data Akademik</h1>
        </div>

        <div className="info-box mt-8">
          <h3>Petunjuk Upload</h3>
          <ul>
            <li>Download template Excel terlebih dahulu</li>
            <li>Isi template sesuai dengan format yang telah ditentukan</li>
            <li>File harus dalam format Excel (.xlsx atau .xls)</li>
            <li>Pastikan format data sesuai dengan template yang telah ditentukan</li>
            <li>Ukuran file maksimal 10MB</li>
            <li>Data yang sudah diupload akan menggantikan data yang sudah ada sebelumnya</li>
          </ul>
        </div>

        <div className="section-container">
          <div className="header">
            <h2>Upload Excel Dosen Wali</h2>
          </div>
          <div className="template-download">
            <p>Download template terlebih dahulu:</p>
            <button className="download-template-btn" onClick={handleDownloadDosenWaliTemplate}>
              <FaDownload /> Template Excel Dosen Wali
            </button>
          </div>
          <div className="terbit-sk-row">
            <div className="upload-sk">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleDosenWaliFileChange}
                hidden
                id="dosenWaliInput"
                disabled={isUploading}
              />
              <label htmlFor="dosenWaliInput" className="button-white">
                <FaFileArrowUp />
                Pilih file
              </label>
              <div>{dosenWaliFileName ? dosenWaliFileName : "Pilih file Excel Dosen Wali"}</div>
            </div>
            <ButtonWithIcon
              text={isUploading ? "Mengunggah..." : "Upload"}
              onClick={handleUploadDosenWali}
              hideIcon
              disabled={isUploading || !dosenWaliFile}
            />
          </div>

          <div className="header mt-8">
            <h2>Upload Excel Asisten Perkuliahan dan Praktikum</h2>
          </div>
          <div className="template-download">
            <p>Download template terlebih dahulu:</p>
            <button className="download-template-btn" onClick={handleDownloadAsistenTemplate}>
              <FaDownload /> Template Excel Asisten Perkuliahan dan Praktikum
            </button>
          </div>
          <div className="terbit-sk-row">
            <div className="upload-sk">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleAsistenFileChange}
                hidden
                id="asistenInput"
                disabled={isUploading}
              />
              <label htmlFor="asistenInput" className="button-white">
                <FaFileArrowUp />
                Pilih file
              </label>
              <div>{asistenFileName ? asistenFileName : "Pilih file Excel Asisten Perkuliahan dan Praktikum"}</div>
            </div>
            <ButtonWithIcon
              text={isUploading ? "Mengunggah..." : "Upload"}
              onClick={handleUploadAsisten}
              hideIcon
              disabled={isUploading || !asistenFile}
            />
          </div>

          <div className="header mt-8">
            <h2>Upload Excel Dosen Pembimbing Mahasiswa Aktif</h2>
          </div>
          <div className="template-download">
            <p>Download template terlebih dahulu:</p>
            <button className="download-template-btn" onClick={handleDownloadDosbingAktifTemplate}>
              <FaDownload /> Template Excel Dosen Pembimbing Mahasiswa Aktif
            </button>
          </div>
          <div className="terbit-sk-row">
            <div className="upload-sk">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleDosbingAktifFileChange}
                hidden
                id="dosbingAktifInput"
                disabled={isUploading}
              />
              <label htmlFor="dosbingAktifInput" className="button-white">
                <FaFileArrowUp />
                Pilih file
              </label>
              <div>{dosbingAktifFileName ? dosbingAktifFileName : "Pilih file Excel Dosen Pembimbing Mahasiswa Aktif"}</div>
            </div>
            <ButtonWithIcon
              text={isUploading ? "Mengunggah..." : "Upload"}
              onClick={handleUploadDosbingAktif}
              hideIcon
              disabled={isUploading || !dosbingAktifFile}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadExcelAkademik