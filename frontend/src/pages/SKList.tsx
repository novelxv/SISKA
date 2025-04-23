import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Navbar"
import ConfirmationModal from "../components/ConfirmationModal"
import "../styles/Global.css"
import "../styles/SK.css"
import { FaDownload, FaSearch, FaPencilAlt, FaEye, FaArchive, FaTrash } from "react-icons/fa"
import { FaFileArrowUp } from "react-icons/fa6"
import { getPublishedSK, getDraftSK, downloadSK, uploadSKPDF, deleteDraftSK } from "../services/skService"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const jenisSKMap: Record<string, string> = {
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
  const navigate = useNavigate()

  useEffect(() => {
    console.log("Current state - query:", query, "jenis:", jenis, "sortOrder:", sortOrder)
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value.toLowerCase())
  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setJenis(e.target.value)
    console.log("Jenis SK dipilih:", e.target.value)
  }

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSortOrder(e.target.value as "desc" | "asc")
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
    // Open preview in a new tab or modal
    window.open(`/preview-sk/${no_sk}`, "_blank")
  }

  const handleArchive = (sk: SK) => {
    // Handle archiving in frontend
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
      // Initialize empty archived list (in a real app, you'd fetch this from an API)
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
          <div className="search">
            <input onChange={handleSearch} type="text" className="sk-search" placeholder="Cari..." />
            <div>
              <FaSearch />
            </div>
          </div>
          <select className="sk-select" onChange={handleSelect}>
            <option value="">Semua Jenis</option>
            {Object.entries(jenisSKMap).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
          <div></div>
          <div className="sort">
            <p>Sort: </p>
            <select className="sk-select" onChange={handleSort} value={sortOrder}>
              <option value="desc">Tanggal ↓</option>
              <option value="asc">Tanggal ↑</option>
            </select>
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
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sklist
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
                          <button className="icon-button" onClick={() => handleArchive(sk)} title="Arsipkan">
                            <FaArchive />
                          </button>
                        </div>
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
                <input type="file" accept=".pdf" onChange={handleSKFileChange} hidden id="fileInput" />
                <label htmlFor="fileInput" className="button-white">
                  <FaFileArrowUp />
                  Pilih file
                </label>

                <div>{skFileName ? skFileName : "Pilih file SK untuk diterbitkan"}</div>
              </div>
              <div className="terbit button-blue" onClick={handlePublish}>
                Submit
              </div>
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