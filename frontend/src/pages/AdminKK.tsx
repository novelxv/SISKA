import type React from "react"

import { useState } from "react"
import { useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Sidebar from "../components/Navbar"
import "../styles/Global.css"
import "../styles/SK.css"
import { useNavigate } from "react-router-dom"
import { FaDownload, FaEye } from "react-icons/fa"
import { getPublishedSK, downloadSK } from "../services/skService"
import ButtonWithIcon from "../components/Button"
import Search from "../components/Search"
import SortButtonNew from "../components/SortButtonNew"

const jenisSKMap: Record<string, string> = {
    PENGAJARAN: "SK Pengajaran",
    PEMBIMBING_PENGUJI: "SK Pembimbing dan Penguji",
    PEMBIMBING_AKTIF: "SK Pembimbing Mahasiswa Aktif",
    WALI_TPB: "SK Dosen Wali TPB",
    WALI_MHS_AKTIF: "SK Dosen Wali Mahasiswa Aktif",
    ASISTEN_PRAKTIKUM: "SK Asisten Perkuliahan dan Praktikum",
    LUAR_PRODI: "SK Luar Prodi",
}

interface SK {
    no_sk: string
    judul: string
    tanggal: string
    jenis_sk?: string
}

const AdminKK = () => {
    const [sklist, setSK] = useState<SK[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [jenis, setJenis] = useState("")
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")

    const navigate = useNavigate()

    const handleSearch = (query: string) => {
      setSearchTerm(query)
    }
  
    const handleJenisChange = (option: string): void => {
      if (option === "Semua Jenis") {
        setJenis("")
      } else {
        const selectedKey = Object.entries(jenisSKMap).find(([_, value]) => value === option)?.[0] || ""
        setJenis(selectedKey)
      }
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
  
    const handlePreview = (no_sk: string) => {
      window.open(`/preview-sk/${no_sk}`, "_blank")
    }
  
    const fetchData = async () => {
      try {
        const published = await getPublishedSK();
        const nonArchivedSK = published.filter((sk: { archived: boolean }) => !sk.archived); // Filter SK yang tidak diarsipkan
        setSK(nonArchivedSK);
      } catch {
        toast.error("Gagal mengambil data SK");
      }
    }
  
    useEffect(() => {
      fetchData()
    }, [])
  
    return (
      <div className="sk-container">
        <Sidebar />
        <ToastContainer />
        <div className="sk-content">
          <div className="header">
            <h1>SK Terbit</h1>
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
  
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Judul</th>
                <th>Tanggal</th>
                <th>Aksi</th>
                <th>Lihat Dosen</th>
              </tr>
            </thead>
            <tbody>
              {sklist
                .filter(
                  (sk) =>
                    sk.judul.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (jenis === "" || sk.jenis_sk === jenis) // Filter berdasarkan jenis SK
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
                    <td>
                      <div className="action-buttons">
                        <button className="icon-button" onClick={() => handlePreview(sk.no_sk)} title="Preview">
                          <FaEye />
                        </button>
                        <button className="icon-button" onClick={() => handleDownload(sk.no_sk)} title="Download">
                          <FaDownload />
                        </button>
                      </div>
                    </td>
                    <td>
                      <ButtonWithIcon
                        text="Data Dosen"
                        onClick={() => navigate(`/sk/${sk.no_sk.replace(/ /g, "_").replace(/\//g, "_")}/dosen`, {
                            state: { from: location.pathname },
                        })}
                        hideIcon
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )
}

export default AdminKK