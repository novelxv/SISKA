import type React from "react"

import { useState, useEffect } from "react"
import { FaFileArrowUp } from "react-icons/fa6"
import { FaDownload } from "react-icons/fa"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Sidebar from "../components/Navbar"
import ButtonWithIcon from "../components/Button"
import "../styles/Global.css"
import "../styles/SK.css"
import "../styles/UploadExcelAkademik.css"
import dosenPembimbingPengujiTemplate from "../assets/template-excel-dosen-pembimbing-dan-penguji.xlsx";
import pengajaranTemplate from "../assets/template-excel-pengajaran.xlsx";
import { uploadExcelPembimbingPenguji, uploadExcelPengajaran, getUploadHistory, downloadUploadedFile } from "../services/excelService"

const AdminProdi = () => {
  const [dosenPPFile, setDosenPPFile] = useState<File | null>(null);
  const [dosenPPFileName, setDosenPPFileName] = useState<string | null>(null);
  const [pengajaranFile, setPengajaranFile] = useState<File | null>(null);
  const [pengajaranFileName, setPengajaranFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<any>({});

  useEffect(() => {
    loadUploadHistory();
  }, []);

  const loadUploadHistory = async () => {
    try {
      const [pengajaranHistory, pembimbingHistory] = await Promise.all([
        getUploadHistory("pengajaran"),
        getUploadHistory("pembimbing-penguji")
      ]);
      
      setUploadHistory({
        pengajaran: pengajaranHistory.data,
        "pembimbing-penguji": pembimbingHistory.data
      });
    } catch (error) {
      console.error("Error loading upload history:", error);
    }
  };

  const handleDownloadFile = async (jenis: string, filename: string) => {
    try {
      await downloadUploadedFile(jenis, filename);
      toast.success("File berhasil didownload");
    } catch (error) {
      toast.error("Gagal mendownload file");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadPPTemplate = () => {
    try {
      const link = document.createElement("a");
      link.href = dosenPembimbingPengujiTemplate;
      link.download = "template-excel-dosen-pembimbing-dan-penguji.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.info("Template Excel Dosen Pembimbing dan Penguji berhasil diunduh");
    } catch (error) {
      toast.error("Gagal mengunduh template Excel Dosen Pembimbing dan Penguji");
    }
  };

  const handleDownloadPengajaranTemplate = () => {
    try {
      const link = document.createElement("a");
      link.href = pengajaranTemplate;
      link.download = "template-excel-pengajaran.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.info("Template Excel Pengajaran berhasil diunduh");
    } catch (error) {
      toast.error("Gagal mengunduh template Excel Pengajaran");
    }
  };

  const handleDosenPPFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        toast.error("File harus berformat Excel (.xlsx atau .xls)");
        return;
      }
      setDosenPPFile(file);
      setDosenPPFileName(file.name);
    }
  };

  const handlePengajaranFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        toast.error("File harus berformat Excel (.xlsx atau .xls)");
        return;
      }
      setPengajaranFile(file);
      setPengajaranFileName(file.name);
    }
  };

  const handleUploadPengajaran = async () => {
    if (!pengajaranFile) {
      toast.warning("Silakan pilih file Excel Pengajaran terlebih dahulu");
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadExcelPengajaran(pengajaranFile);
      toast.success(response.message || "File Excel Pengajaran berhasil diunggah");
      setPengajaranFile(null);
      setPengajaranFileName(null);
      (document.getElementById("pengajaranInput") as HTMLInputElement).value = "";
      
      // Reload history setelah upload
      await loadUploadHistory();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Gagal mengunggah file Excel Pengajaran";
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadDosenPP = async () => {
    if (!dosenPPFile) {
      toast.warning("Silakan pilih file Excel Dosen Pembimbing dan Penguji terlebih dahulu");
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadExcelPembimbingPenguji(dosenPPFile);
      toast.success(response.message || "File Excel Dosen Pembimbing dan Penguji berhasil diunggah");
      setDosenPPFile(null);
      setDosenPPFileName(null);
      (document.getElementById("dosenPPInput") as HTMLInputElement).value = "";
      
      // Reload history setelah upload
      await loadUploadHistory();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Gagal mengunggah file Excel Dosen Pembimbing dan Penguji";
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
          <h1>Upload Data Admin Prodi</h1>
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
            <h2>Upload Excel Pengajaran</h2>
          </div>
          <div className="template-download">
            <p>Download template terlebih dahulu:</p>
            <button className="download-template-btn" onClick={handleDownloadPengajaranTemplate}>
              <FaDownload /> Download
            </button>
          </div>
          <div className="terbit-sk-row">
            <div className="upload-sk">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handlePengajaranFileChange}
                hidden
                id="pengajaranInput"
                disabled={isUploading}
              />
              <label htmlFor="pengajaranInput" className="button-white">
                <FaFileArrowUp />
                Pilih file
              </label>
              <div className="file-display">
                {pengajaranFileName ? (
                  <span className="selected-file">{pengajaranFileName}</span>
                ) : uploadHistory["pengajaran"]?.latestFile ? (
                  <div 
                    className="uploaded-file-info" 
                    onClick={() => handleDownloadFile("pengajaran", uploadHistory["pengajaran"].latestFile.filename)}
                    title="Klik untuk download"
                  >
                    <span className="file-name">📄 {uploadHistory["pengajaran"].latestFile.filename}</span>
                    <span className="file-date">
                      Upload: {formatDate(uploadHistory["pengajaran"].latestFile.uploadedAt)}
                    </span>
                  </div>
                ) : (
                  <span className="no-file">Pilih file Excel Pengajaran</span>
                )}
              </div>
            </div>
            <ButtonWithIcon
              text={isUploading ? "Mengunggah..." : "Upload"}
              onClick={handleUploadPengajaran}
              hideIcon
              disabled={isUploading || !pengajaranFile}
            />
          </div>

          <div className="header mt-8">
            <h2>Upload Excel Dosen Pembimbing & Penguji</h2>
          </div>
          <div className="template-download">
            <p>Download template terlebih dahulu:</p>
            <button className="download-template-btn" onClick={handleDownloadPPTemplate}>
              <FaDownload /> Download
            </button>
          </div>
          <div className="terbit-sk-row">
            <div className="upload-sk">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleDosenPPFileChange}
                hidden
                id="dosenPPInput"
                disabled={isUploading}
              />
              <label htmlFor="dosenPPInput" className="button-white">
                <FaFileArrowUp />
                Pilih file
              </label>
              <div className="file-display">
                {dosenPPFileName ? (
                  <span className="selected-file">{dosenPPFileName}</span>
                ) : uploadHistory["pembimbing-penguji"]?.latestFile ? (
                  <div 
                    className="uploaded-file-info" 
                    onClick={() => handleDownloadFile("pembimbing-penguji", uploadHistory["pembimbing-penguji"].latestFile.filename)}
                    title="Klik untuk download"
                  >
                    <span className="file-name">📄 {uploadHistory["pembimbing-penguji"].latestFile.filename}</span>
                    <span className="file-date">
                      Upload: {formatDate(uploadHistory["pembimbing-penguji"].latestFile.uploadedAt)}
                    </span>
                  </div>
                ) : (
                  <span className="no-file">Pilih file Excel Dosen Pembimbing & Penguji</span>
                )}
              </div>
            </div>
            <ButtonWithIcon
              text={isUploading ? "Mengunggah..." : "Upload"}
              onClick={handleUploadDosenPP}
              hideIcon
              disabled={isUploading || !dosenPPFile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProdi;