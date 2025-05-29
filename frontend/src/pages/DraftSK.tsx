"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Sidebar from "../components/Navbar"
import "../styles/Global.css"
import "../styles/DraftSK.css"
import { FaAngleLeft, FaImage, FaRegEye } from "react-icons/fa"
import { FaFileArrowUp } from "react-icons/fa6"
import { useNavigate, useLocation } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import InputField from "../components/Input"
import SortButtonNew from "../components/SortButtonNew"
import {
  createDraftSK,
  uploadTTD,
  previewSK,
  publishSK,
  getDraftSKDetail,
  updateDraftSK,
  checkPengajaranExcel,
  checkPembimbingPengujiExcel,
  checkPembimbingAktifExcel,
  checkWaliTPBExcel,
  checkWaliAktifExcel,
  checkAsistenExcel,
} from "../services/skService"
import { RiQuestionLine } from "react-icons/ri"

const jenisSKMap: Record<string, string> = {
  PENGAJARAN: "SK Pengajaran",
  PEMBIMBING_PENGUJI: "SK Pembimbing dan Penguji",
  PEMBIMBING_AKTIF: "SK Pembimbing Mahasiswa Aktif",
  WALI_TPB: "SK Dosen Wali TPB",
  WALI_MHS_AKTIF: "SK Dosen Wali Mahasiswa Aktif",
  ASISTEN_PRAKTIKUM: "SK Asisten Perkuliahan dan Praktikum",
}
const jenisSKOptions = Object.keys(jenisSKMap)

interface DraftSKData {
  no_sk: string
  judul: string
  jenis_sk: string
  semester: number
  tahun_akademik: number
  tanggal: string
  NIP_dekan: string
  nama_dekan: string
  ttd_dekan?: string
}

interface ExcelCheckResult {
  complete: boolean;
  missingProdi?: string[];
  foundProdi?: string[];
}

const DraftSK = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const noSKParam = queryParams.get("no_sk")
  const isEditMode = !!noSKParam

  const [judul, setJudul] = useState("")
  const [noSK, setNoSK] = useState("")
  const [tanggal, setTanggal] = useState("")
  const [semester, setSemester] = useState(1)
  const [tahunAkademik, setTahunAkademik] = useState("")
  const [nipDekan, setNipDekan] = useState("")
  const [namaDekan, setNamaDekan] = useState("")
  const [ttdFile, setTtdFile] = useState<File | null>(null)
  const [ttdFilename, setTtdFilename] = useState<string | null>(null)
  const [ttdPreview, setTtdPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [excelComplete, setExcelComplete] = useState<boolean | null>(null)
  const [checkingExcel, setCheckingExcel] = useState(false)
  const [selectedJenisSK, setSelectedJenisSK] = useState("")


  const [showExcelModal, setShowExcelModal] = useState(false);
  const handleOpenExcelModal = () => setShowExcelModal(true);
  const handleCloseExcelModal = () => setShowExcelModal(false);
  const handleGoToExcelUpload = () => navigate("/upload-excel-akademik");

  const [missingProdi, setMissingProdi] = useState<string[]>([]);

  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    const fetchDraftData = async () => {
      if (!noSKParam) return

      setIsLoading(true)
      try {
        const draftData = await getDraftSKDetail(noSKParam)

        console.log("Draft data fetched:", draftData)

        // Populate form with existing data
        setSelectedJenisSK(draftData.jenis_sk || "PENGAJARAN")
        setJudul(draftData.judul || "")
        setNoSK(draftData.no_sk || "")
        setTanggal(draftData.tanggal ? draftData.tanggal.split("T")[0] : "") // Format date for input
        setSemester(draftData.semester || 1)
        setTahunAkademik(draftData.tahun_akademik.toString() + "/" + (draftData.tahun_akademik + 1).toString() || "")
        setNipDekan(draftData.NIP_dekan || "")
        setNamaDekan(draftData.Dekan?.nama || "")

        if (draftData.Dekan && draftData.Dekan.ttd_url) {
          const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000"
          setTtdPreview(apiBase + draftData.Dekan.ttd_url)
          setTtdFilename(draftData.Dekan.ttd_url)
        } else {
          setTtdPreview(null)
        }

        toast.success("Data draft SK berhasil dimuat")
      } catch (err) {
        console.error("Error fetching draft data:", err)
        toast.error("Gagal memuat data draft SK")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDraftData()
  }, [noSKParam])

  // Check Excel completeness when jenisSK changes or on initial load
  useEffect(() => {
    checkExcelCompleteness(selectedJenisSK)
  }, [selectedJenisSK])

  const checkExcelCompleteness = async (skType: string) => {
    setCheckingExcel(true)
    try {
      let result: ExcelCheckResult | null = null

      switch (skType) {
        case "PENGAJARAN":
          result = await checkPengajaranExcel()
          break
        case "PEMBIMBING_PENGUJI":
          result = await checkPembimbingPengujiExcel()
          break
        case "PEMBIMBING_AKTIF":
          result = await checkPembimbingAktifExcel()
          break
        case "WALI_TPB":
          result = await checkWaliTPBExcel()
          break
        case "WALI_MHS_AKTIF":
          result = await checkWaliAktifExcel()
          break
        case "ASISTEN_PRAKTIKUM":
          result = await checkAsistenExcel()
          break
        default:
          setExcelComplete(null)
          setCheckingExcel(false)
          return
      }

      setExcelComplete(result?.complete || false)
      setMissingProdi(result?.missingProdi || [])
      
      // Log missing prodi for debugging
      if (result?.missingProdi && result.missingProdi.length > 0) {
        console.log("Missing prodi:", result.missingProdi)
      }
    } catch (error) {
      console.error(`Error checking Excel completeness for ${skType}:`, error)
      setExcelComplete(false)
      setMissingProdi([])
    } finally {
      setCheckingExcel(false)
    }
  }

  const navToSK = () => {
    navigate("/sk")
  }

  const handleTTDChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setTtdFile(file)
      setTtdPreview(URL.createObjectURL(file))

      try {
        const result = await uploadTTD(nipDekan, file)
        setTtdFilename(result.fileName)
        toast.success("TTD berhasil diunggah")
      } catch (err) {
        toast.error("Gagal upload TTD")
      }
    }
  }

  const handleSimpan = async () => {
    if (!selectedJenisSK) {
    toast.error("Jenis SK belum dipilih.");
    return;
  }
  if (!judul.trim()) {
    toast.error("Judul SK tidak boleh kosong.");
    return;
  }
  if (!noSK.trim()) {
    toast.error("Nomor SK tidak boleh kosong.");
    return;
  }
  if (!tanggal) {
    toast.error("Tanggal belum dipilih.");
    return;
  }
  if (!semester) {
    toast.error("Semester belum diisi.");
    return;
  }
  if (!tahunAkademik.trim()) {
    toast.error("Tahun akademik harus dalam format 2024/2025.");
    return;
  }
  if (!namaDekan.trim()) {
    toast.error("Nama dekan tidak boleh kosong.");
    return;
  }
  if (!nipDekan.trim()) {
    toast.error("NIP dekan tidak boleh kosong.");
    return;
  }

    const skData: DraftSKData = {
      no_sk: noSK,
      judul,
      jenis_sk: selectedJenisSK,
      semester: Number(semester) % 2 === 0 ? 2 : 1,
      tahun_akademik: Number(tahunAkademik.substring(0, 4)),
      tanggal,
      NIP_dekan: nipDekan,
      nama_dekan: namaDekan,
    }

    if (ttdFilename) {
      skData.ttd_dekan = ttdFilename
    }

    try {
      if (isEditMode) {
        await updateDraftSK(noSK, skData)
        toast.success("Draft SK berhasil diperbarui!")
      } else {
        await createDraftSK(skData)
        toast.success("Draft SK berhasil disimpan!")
      }
      // setTimeout(() => navigate("/sk"), 1500)
    } catch (err) {
      console.error(err)
      toast.error(isEditMode ? "Gagal memperbarui draft SK" : "Gagal menyimpan draft SK")
    }
  }

  const handleTerbitkan = async () => {
    try {
      await handleSimpan()
      await publishSK(noSK)
      toast.success("SK berhasil diterbitkan!")
      setTimeout(() => navigate("/sk"), 1500)
    } catch (err) {
      toast.error("Gagal menerbitkan SK")
    }
  }

  const handlePreview = async () => {
    try {
      setPreviewLoading(true)
      const payload = {
        no_sk: noSK,
        judul,
        jenis_sk: selectedJenisSK,
        tahun_akademik: Number(tahunAkademik.substring(0, 4)),
        semester: Number(semester),
        tanggal,
        NIP_dekan: nipDekan,
        nama_dekan: namaDekan,
      }

      const blob = await previewSK(payload)
      const url = window.URL.createObjectURL(blob)
      window.open(url, "_blank")
    } catch (err) {
      toast.error("Gagal membuka preview")
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleJenisSKChange = (value: string) => {
    // const newJenisSK = e.target.value
    setSelectedJenisSK(value)
    checkExcelCompleteness(value)
  }

  // Function to get Excel status message
  const getExcelStatusMessage = () => {
  if (excelComplete === null) return null;

  if (checkingExcel) {
    return <div className="excel-status checking">Memeriksa kelengkapan data...</div>;
  }

  return excelComplete ? (
    <div className="excel-status complete">Data Excel lengkap</div>
  ) : (
    <div className="excel-status incomplete">
      Data Excel belum lengkap{" "}
      <span className="help-icon" onClick={handleOpenExcelModal} title="Info lebih lanjut">
        <RiQuestionLine />
      </span>
    </div>
  );
};


  if (isLoading) {
    return (
      <div className="container">
        <Sidebar />
        <div className="content">
          <div className="loading">Memuat data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Sidebar />
      <ToastContainer />
      <div className="dosen-content">
        <div className="draft-title">
          <div className="header" id="draft-header">
            <div className="title back-button" onClick={navToSK}>
              <FaAngleLeft />
            </div>
            <h1 className="title">{isEditMode ? "Edit Draft SK" : "Draft SK Baru"}</h1>
          </div>
            <div className="button-blue" onClick={handlePreview}>
              <FaRegEye />
              {previewLoading ? "Loading..." : "Preview"}
            </div>
        </div>
        <form className="form-container">
          <div className="draft-template">
            <p>Template: * </p>
              <div className="inputrow1">
                <div className="template">
                  <SortButtonNew
                    options={jenisSKOptions.map((key) => jenisSKMap[key])}
                    selectedOption={jenisSKMap[selectedJenisSK] ?? ""}
                    onChange={(selectedLabel) => {
                      const key = Object.entries(jenisSKMap).find(([_, label]) => label === selectedLabel)?.[0] || ""
                      handleJenisSKChange(key)
                    }}
                    placeholder="Pilih Jenis SK"
                    />
                </div>
              </div>
          </div>
          {getExcelStatusMessage()}

          <div className="inputrow2">
            <InputField
              label="Judul SK"
              name="judul"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required={true}
            />
          </div>

          <div className="inputrow3">
            <div className="input-nomor">
              <InputField
                label="Nomor SK"
                name="noSK"
                value={noSK}
                onChange={(e) => setNoSK(e.target.value)}
                required={true}
                placeholder="Contoh: 123/SK/2024"
              />
            </div>
            <div className="input-tanggal">
              <InputField
                label="Tanggal"
                name="tanggal"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required={true}
              />
            </div>
          </div>

          <div className="inputrow7">
            <InputField
              label= {selectedJenisSK == "PEMBIMBING_PENGUJI" ? "Wisuda" : "Semester"}
              name="semester"
              type="number"
              value={semester.toString()}
              onChange={(e) => {
                if (e.target.value === "") {
                  setSemester(0)
                } else {
                  setSemester(Number(e.target.value))
                }
              }}
              required={true}
            />
            <InputField
              label="Tahun Akademik"
              name="tahunAkademik"
              value={tahunAkademik}
              onChange={(e) => setTahunAkademik(e.target.value)}
              required={true}
              placeholder="2024/2025"
            />
          </div>

          <div className="inputrow4">
            <InputField
              label="Nama Dekan"
              name="namaDekan"
              value={namaDekan}
              onChange={(e) => setNamaDekan(e.target.value)}
              required={true}
            />
            <InputField
              label="NIP Dekan"
              name="nipDekan"
              value={nipDekan}
              onChange={(e) => setNipDekan(e.target.value)}
              required={true}
            />
          </div>

          <div className="inputrow5">
              <div>TTD Dekan:</div>
              <div className="signpreview">
                {ttdPreview ? (
                  <img className="previewimg" src={ttdPreview || "/placeholder.svg"} alt="Preview TTD" />
                ) : ttdFilename ? (
                  <div className="ttd-filename">File TTD tersimpan: {ttdFilename}</div>
                ) : (
                  <FaImage className="previewimg" />
                )}
              </div>
              <div className="button-white" id="button-white">
                <label htmlFor="upload-ttd" style={{ cursor: "pointer" }}>
                  <FaFileArrowUp /> Pilih file
                </label>
                <input
                  className="sign-input-button"
                  type="file"
                  id="upload-ttd"
                  accept="image/*"
                  onChange={handleTTDChange}
                  style={{ display: "none" }}
                />
              </div>
          </div>

        </form>
          <div className="inputrow6">
            <div className="downloads">
              <div className="terbit button-blue" onClick={handleTerbitkan}>
                Terbitkan
              </div>
              <div className="button-blue" onClick={handleSimpan}>
                Simpan
              </div>
            </div>
          </div>
      </div>
      {showExcelModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Data Excel Belum Lengkap</h2>
            <div>Masukkan data Excel terlebih dahulu di halaman upload Excel.</div>
            {missingProdi.length > 0 && (
              <div>
                <br />
                <strong>Prodi yang belum tersedia:</strong>
                <div style={{ marginLeft: '7px' }}>
                    {missingProdi.map((prodi) => (
                        <div key={prodi}>{prodi}</div>
                    ))}
                </div>
                <strong>Minta prodi untuk segera mengunggah excel</strong>
              </div>
            )}
            <br />
            <div className="modal-buttons">
              <button className="button-outline" onClick={handleCloseExcelModal}>Tutup</button>
                {selectedJenisSK !== "PENGAJARAN" && selectedJenisSK !== "PEMBIMBING_PENGUJI" && (
                    <button className="button-gotoexcel" onClick={handleGoToExcelUpload}>
                        Ke Halaman Upload Excel
                    </button>
                )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default DraftSK
