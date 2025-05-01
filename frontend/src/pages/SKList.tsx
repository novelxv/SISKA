import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Sidebar from "../components/Navbar"
import ConfirmationModal from "../components/ConfirmationModal"
import "../styles/Global.css"
import "../styles/SK.css"
import { FaDownload, FaPencilAlt, FaEye, FaArchive, FaTrash } from "react-icons/fa"
import { FaFileArrowUp } from "react-icons/fa6"
import { getPublishedSK, getDraftSK, downloadSK, uploadSKPDF, deleteDraftSK } from "../services/skService"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ButtonWithIcon from "../components/Button"
import Search from "../components/Search"
import SortButtonNew from "../components/SortButtonNew"

const jenisSKMap: Record<string, string> = {
  LUAR_PRODI : "SK Luar Prodi",
  PENGAJARAN: "SK Pengajaran",
  PEMBIMBING_PENGUJI: "SK Pembimbing dan Penguji",
  PEMBIMBING_AKTIF: "SK Pembimbing Mahasiswa Aktif",
  WALI_TPB: "SK Dosen Wali TPB",
  WALI_MHS_AKTIF: "SK Dosen Wali Mahasiswa Aktif",
  ASISTEN_PRAKTIKUM: "SK Asisten Perkuliahan dan Praktikum",
}

type TabType = "published" | "draft" | "archived"

const SKList = () => {
  interface SK {
    no_sk: string
    judul: string
    tanggal: string
    jenis_sk?: string
    created_at?: string
    updated_at?: string
    archived?: boolean
  }

  const [sklist, setSK] = useState<SK[]>([])
  const [draftlist, setDraft] = useState<SK[]>([])
  const [archivedList, setArchivedList] = useState<SK[]>([])
  const [query, setQuery] = useState("")
  const [jenis, setJenis] = useState("")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
  const [skFile, setSkFile] = useState<File | null>(null)
  const [skFileName, setSkFileName] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("published")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const handleSearch = (query: string) => {
    setSearchTerm(query)
  }

  const navigate = useNavigate()

  useEffect(() => {
    console.log("Current state - query:", searchTerm, "jenis:", jenis, "sortOrder:", sortOrder)
  }, [query, jenis, sortOrder])

  const handleSKFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSkFile(file)
      setSkFileName(file.name)
    }
  }

  const handlePublish = async () => {
    if (!skFile) {
      toast.warning("Silakan pilih file SK terlebih dahulu")
      return
    }
    try {
      const result = await uploadSKPDF(skFile)
      toast.success("File SK berhasil diterbitkan")
      setSkFile(null)
      setSkFileName(null)
      fetchData()
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Gagal upload file SK"
      toast.error(errorMsg)
    }
  }

  const navToDraft = () => {
    navigate("/draft-sk")
  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setJenis(e.target.value)
    console.log("Jenis SK dipilih:", e.target.value)
  }

  const handleJenisChange = (option: string): void => {
    if (option === "Semua Jenis") {
      setJenis("")
    } else {
      // Find the key (jenis_sk value) that corresponds to the selected label
      const selectedKey = Object.entries(jenisSKMap).find(([key, value]) => value === option)?.[0] || ""
      setJenis(selectedKey)
      console.log("Jenis SK dipilih:", selectedKey)
    }
  }

  const handleSort = (option: string): void => {
    setSortOrder(option === "Tanggal ↓" ? "desc" : "asc")
  }

  const handleDownload = async (no_sk: string) => {
    try {
      const blob = await downloadSK(no_sk)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `SK_${no_sk}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch {
      toast.error("Gagal mengunduh SK")
    }
  }

  const handleEditDraft = (no_sk: string) => {
    navigate(`/draft-sk?no_sk=${no_sk}`)
  }

  const handlePreview = (no_sk: string) => {
    window.open(`/preview-sk/${no_sk}`, "_blank")
  }

  const handleArchive = (sk: SK) => {
    const updatedPublishedList = sklist.filter((item) => item.no_sk !== sk.no_sk)
    const skToArchive = { ...sk, archived: true }

    setSK(updatedPublishedList)
    setArchivedList((prev) => [...prev, skToArchive])

    toast.success(`SK "${sk.judul}" berhasil diarsipkan`)
  }

  const handleUnarchive = (sk: SK) => {
    // Handle unarchiving in frontend
    const updatedArchivedList = archivedList.filter((item) => item.no_sk !== sk.no_sk)
    const skToUnarchive = { ...sk, archived: false }

    setArchivedList(updatedArchivedList)
    setSK((prev) => [...prev, skToUnarchive])

    toast.success(`SK "${sk.judul}" berhasil dipulihkan`)
  }

  const openDeleteModal = (no_sk: string) => {
    setDraftToDelete(no_sk)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!draftToDelete) return

    try {
      await deleteDraftSK(draftToDelete)
      const updatedDraftList = draftlist.filter((draft) => draft.no_sk !== draftToDelete)
      setDraft(updatedDraftList)
      toast.success("Draft SK berhasil dihapus")
    } catch (err) {
      toast.error("Gagal menghapus draft SK")
    } finally {
      setIsDeleteModalOpen(false)
      setDraftToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setDraftToDelete(null)
  }

  const fetchData = async () => {
    try {
      const [published, draft] = await Promise.all([getPublishedSK(), getDraftSK()])
      setSK(published)
      setDraft(draft)
      setArchivedList([])
    } catch (err) {
      toast.error("Gagal mengambil data SK")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="sk-container">
      <Sidebar />
      <ToastContainer />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus draft SK ini?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <div className="sk-content">
        <div className="header">
          <h1>Surat Keputusan</h1>
        </div>

        <div className="skfilters">
          <Search searchTerm={searchTerm} setSearchTerm={handleSearch} />

          <div className="sort-filter-select">
            <SortButtonNew
              options={["Semua Jenis", ...Object.values(jenisSKMap)]}
              selectedOption={jenis === "" ? "Semua Jenis" : jenisSKMap[jenis]}
              onChange={handleJenisChange}
            />
          </div>
          <div></div>
          <div className="sort">
            <p>Sort: </p>
            <div className="sort-container">
              <SortButtonNew
                options={["Tanggal ↓", "Tanggal ↑"]}
                selectedOption={sortOrder === "desc" ? "Tanggal ↓" : "Tanggal ↑"}
                onChange={(option) => setSortOrder(option === "Tanggal ↓" ? "desc" : "asc")}
              />
            </div>
          </div>
        </div>

        <div className="tab-container">
          <div
            className={`tab ${activeTab === "published" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("published")}
          >
            SK Terbit
          </div>
          <div className={`tab ${activeTab === "draft" ? "active-tab" : ""}`} onClick={() => setActiveTab("draft")}>
            Draft SK
          </div>
          <div
            className={`tab ${activeTab === "archived" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("archived")}
          >
            Arsip SK
          </div>
        </div>

        {activeTab === "published" && (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Judul</th>
                  <th>Tanggal</th>
                  <th>Jenis SK</th>
                  <th>Aksi</th>
                  <th>Lihat Dosen</th>
                </tr>
              </thead>
              <tbody>
                {sklist
                  .filter(
                    (sk) => sk.judul.toLowerCase().includes(searchTerm) && (jenis === "" || sk.jenis_sk === jenis),
                  )
                  .sort((a, b) => {
                    const dateA = new Date(a.tanggal).getTime()
                    const dateB = new Date(b.tanggal).getTime()
                    return sortOrder === "desc" ? dateB - dateA : dateA - dateB
                  })
                  .map((sk) => (
                    <tr key={sk.no_sk}>
                      <td>{sk.no_sk}</td>
                      <td>
                        <div className="td-judul">{sk.judul}</div>
                      </td>
                      <td>
                        {new Date(sk.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td>{sk.jenis_sk}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-button" onClick={() => handlePreview(sk.no_sk)} title="Preview">
                            <FaEye />
                          </button>
                          <button className="icon-button" onClick={() => handleDownload(sk.no_sk)} title="Download">
                            <FaDownload />
                          </button>
                          <button className="icon-button" onClick={() => handleArchive(sk)} title="Arsipkan">
                            <FaArchive />
                          </button>
                        </div>
                      </td>
                      <td>
                        <ButtonWithIcon text="Data Dosen" onClick={() => navigate(`/sk/${sk.no_sk.replace(/ /g, "_").replace(/\//g, "_")}/dosen`)} hideIcon/>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="header">
              <h2>Upload SK</h2>
            </div>
            <div className="terbit-sk-row">
              <div className="upload-sk">
                <input type="file" accept=".pdf" key={skFileName} onChange={handleSKFileChange} hidden id="fileInput" />
                <label htmlFor="fileInput" className="button-white">
                  <FaFileArrowUp />
                  Pilih file
                </label>

                <div>{skFileName ? skFileName : "Pilih file SK untuk diterbitkan"}</div>
              </div>
              <ButtonWithIcon text="Submit" onClick={handlePublish} hideIcon />
            </div>
          </>
        )}

        {activeTab === "draft" && (
          <>
            <div className="draft-header">
              <h2>Draft SK</h2>
              <div className="button-blue" onClick={navToDraft}>
                + SK Baru
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Dibuat</th>
                  <th>Dimodifikasi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {draftlist
                  .filter(
                    (draft) => draft.judul.toLowerCase().includes(query) && (jenis === "" || draft.jenis_sk === jenis),
                  )
                  .sort((a, b) => {
                    const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0
                    const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0
                    return sortOrder === "desc" ? dateB - dateA : dateA - dateB
                  })
                  .map((draft) => (
                    <tr key={draft.no_sk}>
                      <td>
                        <div className="td-judul">{draft.judul}</div>
                      </td>
                      <td>{draft.created_at ? new Date(draft.created_at).toLocaleDateString("id-ID") : "N/A"}</td>
                      <td>{draft.updated_at ? new Date(draft.updated_at).toLocaleDateString("id-ID") : "N/A"}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-button" onClick={() => handleEditDraft(draft.no_sk)} title="Edit">
                            <FaPencilAlt />
                          </button>
                          <button className="icon-button" onClick={() => openDeleteModal(draft.no_sk)} title="Hapus">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "archived" && (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Judul</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {archivedList
                  .filter((sk) => sk.judul.toLowerCase().includes(query) && (jenis === "" || sk.jenis_sk === jenis))
                  .sort((a, b) => {
                    const dateA = new Date(a.tanggal).getTime()
                    const dateB = new Date(b.tanggal).getTime()
                    return sortOrder === "desc" ? dateB - dateA : dateA - dateB
                  })
                  .map((sk) => (
                    <tr key={sk.no_sk}>
                      <td>{sk.no_sk}</td>
                      <td>
                        <div className="td-judul">{sk.judul}</div>
                      </td>
                      <td>
                        {new Date(sk.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-button" onClick={() => handlePreview(sk.no_sk)} title="Preview">
                            <FaEye />
                          </button>
                          <button className="icon-button" onClick={() => handleDownload(sk.no_sk)} title="Download">
                            <FaDownload />
                          </button>
                          <button className="icon-button" onClick={() => handleUnarchive(sk)} title="Pulihkan">
                            <FaArchive />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  )
}

export default SKList
