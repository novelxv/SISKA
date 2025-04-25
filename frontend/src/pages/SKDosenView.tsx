import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Sidebar from "../components/Navbar"
import { FaChevronLeft, FaChevronRight, FaArrowLeft } from "react-icons/fa"
import "../styles/Dosen.css"
import "../styles/Global.css"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { RiArrowLeftSLine } from "react-icons/ri"
import { getDosenFromSK } from "../services/skService"

interface Dosen {
  nama_tanpa_gelar: string
  nama_plus_gelar: string
  NIP?: string | null
  KK?: string | null
  jenis_kepegawaian?: string | null
  status_kepegawaian: string
  instansi_asal?: string | null
}

const SKDosenView: React.FC = () => {
  const { no_sk } = useParams<{ no_sk: string }>()
  const navigate = useNavigate()
  const [dosenList, setDosenList] = useState<Dosen[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchDosen = async () => {
      try {
        setIsLoading(true)
        if (!no_sk) return
        const data = await getDosenFromSK(no_sk)
        
        console.log("Dosen data:", data)
        setDosenList(data)
      } catch (error) {
        console.error("Gagal mengambil data dosen dari SK:", error)
        toast.error("Gagal mengambil data dosen dari SK")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDosen()
  }, [no_sk])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = dosenList.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(dosenList.length / itemsPerPage)

  const formatKK = (kk: string | null | undefined) => {
    if (!kk) return "-"
    return kk.replace(/_/g, " ")
  }

  const formatJenisKepegawaian = (jenis: string | null | undefined) => {
    if (!jenis) return "-"
    return jenis.replace(/_/g, " ")
  }

  const handleCancel = () => {
    navigate("/sk");
  };

  return (
    <div className="dosen-page">
      <Sidebar />
      <ToastContainer />
      <main className="dosen-content">
        <div className="formheader">
          <button className="back-button" onClick={handleCancel}>
            <RiArrowLeftSLine size={24} />
          </button>
          <h1>Daftar Dosen dari SK {decodeURIComponent(no_sk || "")}</h1>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Memuat data dosen...</p>
          </div>
        ) : dosenList.length === 0 ? (
          <div className="no-data">
            {/* <Image></Image> */}
            <p>Tidak ada data dosen yang ditemukan dalam SK ini.</p>
          </div>
        ) : (
          <>
            <div className="dosen-table-container">
              <table className="dosen-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Tanpa Gelar</th>
                    <th>Nama Lengkap</th>
                    <th>NIP</th>
                    <th>KK</th>
                    <th>Jenis Kepegawaian</th>
                    <th>Status</th>
                    <th>Instansi Asal</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((dosen, index) => (
                    <tr key={index}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{dosen.nama_tanpa_gelar}</td>
                      <td>{dosen.nama_plus_gelar}</td>
                      <td>{dosen.NIP || "-"}</td>
                      <td>{formatKK(dosen.KK)}</td>
                      <td>{formatJenisKepegawaian(dosen.jenis_kepegawaian)}</td>
                      <td>{dosen.status_kepegawaian.replace(/_/g, " ")}</td>
                      <td>{dosen.instansi_asal || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                <FaChevronLeft />
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <FaChevronRight />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default SKDosenView
