import React, { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import Sidebar from "../components/Navbar"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
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
  const location = useLocation();
  const itemsPerPage = 10
  const formatNoSk = (no_sk: string | undefined) => {
    return no_sk ? no_sk.replace(/_/g, " ") : ""
  }

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
    navigate(location.state?.from || "/sk");
  };

  const handlePageChange = (page: number) => {
  if (page > 0 && page <= totalPages) {
    setCurrentPage(page)
  }
}

const renderPaginationItems = () => {
  const items = []

  items.push(
    <button
      key="prev"
      className="pagination-btn prev"
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      <span className="icon-wrapper"><FaChevronLeft /></span>
    </button>
  )

  if (totalPages <= 1) return items

  items.push(
    <button
      key={1}
      className={`pagination-btn ${currentPage === 1 ? "active" : ""}`}
      onClick={() => handlePageChange(1)}
    >
      1
    </button>
  )

  if (currentPage > 3) {
    items.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>)
  }

  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    items.push(
      <button
        key={i}
        className={`pagination-btn ${currentPage === i ? "active" : ""}`}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </button>
    )
  }

  if (currentPage < totalPages - 2) {
    items.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>)
  }

  if (totalPages > 1) {
    items.push(
      <button
        key={totalPages}
        className={`pagination-btn ${currentPage === totalPages ? "active" : ""}`}
        onClick={() => handlePageChange(totalPages)}
      >
        {totalPages}
      </button>
    )
  }

  items.push(
    <button
      key="next"
      className="pagination-btn next"
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      <span className="icon-wrapper"><FaChevronRight /></span>
    </button>
  )

  return items
}


  return (
    <div className="dosen-page">
      <Sidebar />
      <ToastContainer />
      <main className="dosen-content">
        <div className="formheader">
          <button className="back-button" onClick={handleCancel}>
            <RiArrowLeftSLine size={24} />
          </button>
          <h1>Daftar Dosen dari SK {formatNoSk(no_sk)}</h1>
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
            <div className="dosen-table-container" id="sk-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Tanpa Gelar</th>
                    <th>Nama Lengkap</th>
                    <th>NIP</th>
                    <th>KK</th>
                    <th>Jenis Kepegawaian</th>
                    <th>Status</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-container">
              <div className="pagination">
                {renderPaginationItems()}
              </div>
            </div>

          </>
        )}
      </main>
    </div>
  )
}

export default SKDosenView
