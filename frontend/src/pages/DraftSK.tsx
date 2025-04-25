import type React from "react"
import { useState, useEffect } from "react"
import Sidebar from "../components/Navbar"
import "../styles/Global.css"
import "../styles/DraftSK.css"
import { FaAngleLeft, FaImage, FaRegEye } from "react-icons/fa"
import { FaFileArrowUp } from "react-icons/fa6"
import { useNavigate, useLocation } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { createDraftSK, uploadTTD, previewSK, publishSK, getDraftSKDetail, updateDraftSK, getTTDPreview } from "../services/skService"

const jenisSKOptions = [
  { label: "SK Pengajaran", value: "PENGAJARAN" },
  { label: "SK Pembimbing dan Penguji", value: "PEMBIMBING_PENGUJI" },
  { label: "SK Pembimbing Mahasiswa Aktif", value: "PEMBIMBING_AKTIF" },
  { label: "SK Dosen Wali TPB", value: "WALI_TPB" },
  { label: "SK Dosen Wali Mahasiswa Aktif", value: "WALI_MHS_AKTIF" },
  { label: "SK Asisten Perkuliahan dan Praktikum", value: "ASISTEN_PRAKTIKUM" },
]

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

const DraftSK = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const noSKParam = queryParams.get("no_sk")
  const isEditMode = !!noSKParam

  const [jenisSK, setJenisSK] = useState("PENGAJARAN")
  const [judul, setJudul] = useState("")
  const [noSK, setNoSK] = useState("")
  const [tanggal, setTanggal] = useState("")
  const [semester, setSemester] = useState(1)
  const [tahunAkademik, setTahunAkademik] = useState("");
  const [nipDekan, setNipDekan] = useState("")
  const [namaDekan, setNamaDekan] = useState("")
  const [ttdFile, setTtdFile] = useState<File | null>(null)
  const [ttdFilename, setTtdFilename] = useState<string | null>(null)
  const [ttdPreview, setTtdPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchDraftData = async () => {
      if (!noSKParam) return

      setIsLoading(true)
      try {
        const draftData = await getDraftSKDetail(noSKParam)

        console.log("Draft data fetched:", draftData)

        // Populate form with existing data
        setJenisSK(draftData.jenis_sk || "PENGAJARAN")
        setJudul(draftData.judul || "")
        setNoSK(draftData.no_sk || "")
        setTanggal(draftData.tanggal ? draftData.tanggal.split("T")[0] : "") // Format date for input
        setSemester(draftData.semester || 1)
        setTahunAkademik(draftData.tahun_akademik || 0);
        setNipDekan(draftData.NIP_dekan || "")
        setNamaDekan(draftData.Dekan?.nama || "")
        
        if (draftData.Dekan && draftData.Dekan.ttd_url) {
            const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000";
            setTtdPreview(apiBase + draftData.Dekan.ttd_url);
            setTtdFilename(draftData.Dekan.ttd_url);
          } else {
            setTtdPreview(null);
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
    const skData: DraftSKData = {
      no_sk: noSK,
      judul,
      jenis_sk: jenisSK,
      semester: Number(semester),
      tahun_akademik: Number(tahunAkademik),
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
      setTimeout(() => navigate("/sk"), 1500)
    } catch (err) {
      console.error(err)
      toast.error(isEditMode ? "Gagal memperbarui draft SK" : "Gagal menyimpan draft SK")
    }
  }

  const handleTerbitkan = async () => {
    try {
      await publishSK(noSK)
      toast.success("SK berhasil diterbitkan!")
      setTimeout(() => navigate("/sk"), 1500)
    } catch (err) {
      toast.error("Gagal menerbitkan SK")
    }
  }

  const handlePreview = async () => {
    try {
      const payload = {
        no_sk: noSK,
        judul,
        jenis_sk: jenisSK,
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
    }
  }

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
    <div className="container">
      <Sidebar />
      <ToastContainer />
      <div className="content">
        <div className="draftheader">
          <div className="title back-button" onClick={navToSK}>
            <FaAngleLeft />
          </div>
          <h1 className="title">{isEditMode ? "Edit Draft SK" : "Draft SK Baru"}</h1>
        </div>
        <form>
          <div className="inputrow1">
            <div className="template">
              <div>Template: </div>
              <select name="jenisSK" className="sk-select" value={jenisSK} onChange={(e) => setJenisSK(e.target.value)}>
                {jenisSKOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="button-blue" onClick={handlePreview}>
              <FaRegEye />
              Preview
            </div>
          </div>

          <div className="inputrow2">
            <div>
              Judul SK <br />
              <input type="text" className="sk-input" value={judul} onChange={(e) => setJudul(e.target.value)} />
            </div>
          </div>

          <div className="inputrow3">
            <div>
              Nomor SK <br />
              <input
                type="text"
                className="sk-input"
                value={noSK}
                onChange={(e) => setNoSK(e.target.value)}
                readOnly={isEditMode} // Make read-only if editing
              />
            </div>
            <div>
              Tanggal <br />
              <input type="date" className="sk-input" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
            </div>
            <div>
              Semester <br />
              <input
                type="number"
                className="sk-input"
                value={semester}
                onChange={(e) => {
                    if (e.target.value === "") {
                      setSemester(null);
                    } else {
                      setSemester(Number(e.target.value));
                    }
                  }}
                  min={1}
                  max={20}
              />
            </div>
            <div>
                Tahun Akademik <br />
                <input
                    type="text"
                    className="sk-input"
                    value={tahunAkademik}
                    onChange={(e) => setTahunAkademik(e.target.value)}
                    placeholder="2024/2025"
                />
                </div>
          </div>

          <div className="inputrow4">
            <div>
              Nama Dekan <br />
              <input
                type="text"
                className="sk-input"
                value={namaDekan}
                onChange={(e) => setNamaDekan(e.target.value)}
              />
            </div>
            <div>
              NIP Dekan <br />
              <input type="text" className="sk-input" value={nipDekan} onChange={(e) => setNipDekan(e.target.value)} />
            </div>
          </div>

          <div className="inputrow5">
            <div>
              <div>TTD Dekan</div>
              <div className="button-white">
                <label htmlFor="upload-ttd" style={{ cursor: "pointer" }}>
                  <FaFileArrowUp /> Pilih file
                </label>
                <input
                  type="file"
                  id="upload-ttd"
                  accept="image/*"
                  onChange={handleTTDChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="signpreview">
              {ttdPreview ? (
                <img className="previewimg" src={ttdPreview || "/placeholder.svg"} alt="Preview TTD" />
              ) : ttdFilename ? (
                <div className="ttd-filename">File TTD tersimpan: {ttdFilename}</div>
              ) : (
                <FaImage className="previewimg"/>
              )}
            </div>
          </div>

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
        </form>
      </div>
    </div>
  )
}

export default DraftSK