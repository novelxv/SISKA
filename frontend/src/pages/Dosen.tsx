import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Navbar';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/Dosen.css';
import "../styles/Global.css";
import ButtonWithIcon from "../components/Button.tsx";
import SortButtonNew from '../components/SortButtonNew';
import Search from '../components/Search';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';

interface DosenData {
  id: number;
  nama_tanpa_gelar: string;
  NIDN: string;
  NIP: string;
  KK: string;
  jenis_kepegawaian: string;
  pangkat: string;
  jabatan_fungsional: string;
  status_kepegawaian: string;
  aktif_mulai: string;
  aktif_sampai: string;
  instansi_asal: string;
}

export default function Dosen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [prodi, setProdi] = useState('');
  const [kk, setKK] = useState('');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<DosenData[]>([]);
  const [dosenData, setDosenData] = useState<DosenData[]>([]);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dosenToDelete, setDosenToDelete] = useState<number | null>(null);

  const kkOptions = [
    "KK Informatika", "KK Teknik Ketenagalistrikan", "KK Teknik Telekomunikasi",
    "KK Elektronika", "KK Sistem dan Komputer", "KK Teknik Komputer",
    "KK Teknik Biomedika", "KK Teknologi Informasi", "KK Rekayasa Perangkat Lunak dan Pengetahuan"
  ];
  const token = localStorage.getItem("token");
  // Ambil data dari API
  useEffect(() => {
    fetch('http://localhost:3000/api/dosen', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Add the token here
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch dosen data');
      }
      return response.json();
    })
    .then(data => {
      setDosenData(data);
    })
    .catch(error => {
      console.error('Error fetching dosen data:', error);
    });
  }, []);

  // Filter dan sortir data
  useEffect(() => {
    let filtered = [...dosenData];

    if (searchTerm) {
      filtered = filtered.filter(dosen =>
        dosen.nama_tanpa_gelar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dosen.NIDN.includes(searchTerm) ||
        dosen.NIP.includes(searchTerm)
      );
    }

    if (prodi) {
      filtered = filtered.filter(dosen => dosen.id % 3 === parseInt(prodi) % 3);
    }

    if (kk) {
      filtered = filtered.filter(dosen => dosen.KK === kk);
    }

    if (sortBy === 'Name A-Z') {
      filtered.sort((a, b) => a.nama_tanpa_gelar.localeCompare(b.nama_tanpa_gelar));
    } else if (sortBy === 'Name Z-A') {
      filtered.sort((a, b) => b.nama_tanpa_gelar.localeCompare(a.nama_tanpa_gelar));
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset halaman saat filter berubah
  }, [searchTerm, prodi, kk, sortBy, dosenData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];

    items.push(
      <button key="prev" className="pagination-btn prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        <span className="icon-wrapper"><FaChevronLeft /></span>
      </button>
    );

    for (let page = 1; page <= totalPages; page++) {
      if (
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - 1 && page <= currentPage + 1)
      ) {
        items.push(
          <button
            key={page}
            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        );
      } else if (
        (page === currentPage - 2 && page > 1) ||
        (page === currentPage + 2 && page < totalPages)
      ) {
        items.push(<span key={`ellipsis-${page}`} className="pagination-ellipsis">...</span>);
      }
    }

    items.push(
      <button key="next" className="pagination-btn next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <span className="icon-wrapper"><FaChevronRight /></span>
      </button>
    );

    return items;
  };

  const handleAddDosen = () => {
    navigate('/tambah-dosen');
  };

  const handleEditDosen = (id: number) => {
    navigate(`/edit-dosen/${id}`);
  };

  const handleDeleteDosen = (dosen: DosenData) => {
    setDosenToDelete(dosen.id_dosen); // Set the selected Dosen to delete
    console.log("Fetched dosen data:", dosen); 
    setIsModalOpen(true); // Open the modal
  };

  const confirmDelete = async () => {
    if (dosenToDelete === null) return;
  
    try {
      console.log("Deleting dosen with ID:", dosenToDelete);
      const response = await fetch(`http://localhost:3000/api/dosen/${dosenToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Server error:', response.status, errorBody);
        throw new Error('Gagal menghapus dosen');
      }
  
      // Update UI setelah hapus
      setDosenData(prev => prev.filter(dosen => dosen.id_dosen !== dosenToDelete));
    } catch (error) {
      console.error('Error deleting dosen:', error);
      alert('Terjadi kesalahan saat menghapus dosen.');
    } finally {
      setIsModalOpen(false);
      setDosenToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  // adjust format untuk Kelompok Keahlian
  const formatKK = (kk: string) => {
    if (kk === "INFORMATIKA") {
      return "Informatika";
    } else if (kk === "ELEKTRONIKA") {
      return "Elektronika";
    } else if (kk === "REKAYASA_PERANGKAT_LUNAK_DAN_PENGETAHUAN") {
      return "Rekayasa Perangkat Lunak dan Pengetahuan";
    } else if (kk === "SISTEM_KENDALI_DAN_KOMPUTER") {
      return "Sistem Kendali dan Komputer";
    } else if (kk === "TEKNIK_TELEKOMUNIKASI") {
      return "Teknik Telekomunikasi";
    } else if (kk === "TEKNIK_KETENAGALISTRIKAN") {
      return "Teknik Ketenagalistrikan";
    } else if (kk === "TEKNIK_KOMPUTER") {
      return "Teknik Komputer";
    } else if (kk === "TEKNOLOGI_INFORMASI") {
      return "Teknologi Informasi";
    }
    return kk;
  };

  // adjust format untuk jenis kepegawaian
  const formatJK = (jk: string) => {
    if (jk === "DOSEN_TETAP") {
      return "Dosen Tetap";
    } else if (jk === "DOSEN_TAK_TETAP_PENGAJAR") {
      return "Dosen Tak Tetap Pengajar";
    } else if (jk === "DOSEN_TAK_TETAP_PENELITI") {
      return "Dosen Tak Tetap Peneliti";
    } else if (jk === "DOSEN_LUAR_STEI") {
      return "Dosen Luar STEI";
    } else if (jk === "DOSEN_LUAR_ITB") {
      return "Dosen Luar ITB";
    } else if (jk === "DOSEN_INDUSTRI") {
      return "Dosen Industri";
    } else if (jk === "ASISTEN_AKADEMIK") {
      return "Asisten Akademik";
    } else if (jk === "TUTOR") {
      return "Tutor";
    }
    return jk;
  };
  
  const formatJF = (jf: string) => {
    if (jf === "ASISTEN_AHLI") {
      return "Asisten Ahli";
    } else if (jf === "LEKTOR") {
      return "Lektor";
    } else if (jf === "LEKTOR_KEPALA") {
      return "Lektor Kepala";
    } else if (jf === "GURU_BESAR") {
      return "Guru Besar";
    }
    return jf;
  };
  
  return (
    <div className="dosen-page">
      <Sidebar />
      <main className="dosen-content">
        <div className="header">
          <h1>Daftar Dosen</h1>
          <ButtonWithIcon text="Tambah Dosen" onClick={handleAddDosen} />
        </div>

        <div className="filter-row">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="filter-select">
            <select value={kk} onChange={(e) => setKK(e.target.value)}>
              <option value="">KK</option>
              {kkOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="sort-container">
            <span>Sort:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="Most Recent">Most Recent</option>
              <option value="Name A-Z">Name A-Z</option>
              <option value="Name Z-A">Name Z-A</option>
            </select>
          </div>
        </div>

        <div className="dosen-table-container">
          <table className="dosen-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Dosen Tanpa Gelar</th>
                <th>NIDN</th>
                <th>Nopeg</th>
                <th>KK</th>
                <th>Jenis Kepegawaian</th>
                <th>Pangkat</th>
                <th>Jabatan Fungsional</th>
                <th>Status Kepegawaian</th>
                <th>Aktif Mulai</th>
                <th>Aktif Sampai</th>
                <th>Instansi Asal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((dosen, index) => (
                <tr key={dosen.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{dosen.nama_tanpa_gelar}</td>
                  <td>{dosen.NIDN === "undefined" ? '' : dosen.NIDN}</td>
                  <td>{dosen.NIP === "undefined" ? '' : dosen.NIP}</td> 
                  <td>{formatKK(dosen.KK)}</td>
                  <td>{formatJK(dosen.jenis_kepegawaian)}</td>
                  <td>{dosen.pangkat}</td>
                  <td>{formatJF(dosen.jabatan_fungsional)}</td>
                  <td>{dosen.status_kepegawaian}</td>
                  <td>{dosen.aktif_mulai}</td>
                  <td>{dosen.aktif_sampai}</td>
                  <td>{dosen.instansi_asal}</td>
                  <td className="action-buttons">
                    <button className="edit-btn" title="Edit" onClick={() => handleEditDosen(dosen.id_dosen)}>
                      <span className="icon-wrapper"><FaEdit /></span>
                    </button>
                    <button className="delete-btn" title="Delete" onClick={() => handleDeleteDosen(dosen)}>
                      <span className="icon-wrapper"><FaTrash /></span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="pagination">
            {renderPaginationItems()}
          </div>
          <button className="download-btn">
            <span className="icon-wrapper"><FaDownload /></span>
            <span>Download</span>
          </button>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus dosen ini?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
