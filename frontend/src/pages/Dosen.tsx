import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Navbar';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/Dosen.css';

interface DosenData {
  id: number;
  nama: string;
  nidn: string;
  nopeg: string;
  kk: string;
  jenisKepegawaian: string;
  pangkat: string;
  jabatanFungsional: string;
  statusKepegawaian: string;
  aktifMulai: string;
  aktifSampai: string;
}

export default function Dosen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [prodi, setProdi] = useState('');
  const [kk, setKK] = useState('');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<DosenData[]>([]);
  const itemsPerPage = 10;
  
  // Data dosen dummy
  const dosenNames = [
    "Achmad Imam Kistijantoro",
    "Rinaldi Munir",
    "Benhard Sitohang",
    "Dwi Hendratmo Widyantoro",
    "Rila Mandala",
    "Masayu Leylia Khodra",
    "Gusti Ayu Putri Saptawati",
    "Iping Supriana",
    "Harlili",
    "Fazat Nur Azizah",
    "Ayu Purwarianti",
    "Dessi Puji Lestari",
    "Tricya Widagdo",
    "Nur Ulfa Maulidevi",
    "Yani Widyani",
    "Saiful Akbar",
    "Bayu Hendradjaya",
    "Dana Sulistyo Kusumo",
    "Kridanto Surendro",
    "Adi Mulyanto"
  ];
  
  const kkOptions = ["KK Teknik Ketenagalistrikan", "KK Teknik Telekomunikasi", "KK Elektronika", "KK Sistem dan Komputer", "KK Teknik Komputer", "KK Teknik Biomedika", "KK Teknologi Informasi", "KK Rekayasa Perangkat Lunak dan Pengetahuan"];
  const pangkatOptions = ["III / a", "III / b", "III / c", "III / d", "IV / a", "IV / b"];
  const jabatanOptions = ["LEKTOR", "LEKTOR KEPALA", "ASISTEN AHLI", "GURU BESAR"];
  
  const generateRandomDate = (start: Date, end: Date) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return `${date.getDate()} Mei ${date.getFullYear()}`;
  };
  
  const generateDosenData = (): DosenData[] => {
    return Array(50).fill(null).map((_, index) => {
      const randomNameIndex = Math.floor(Math.random() * dosenNames.length);
      const randomKKIndex = Math.floor(Math.random() * kkOptions.length);
      const randomPangkatIndex = Math.floor(Math.random() * pangkatOptions.length);
      const randomJabatanIndex = Math.floor(Math.random() * jabatanOptions.length);
      
      const nidn = `${9000000 + Math.floor(Math.random() * 100000)}`;
      const nopeg = `${19700000 + Math.floor(Math.random() * 300000)} ${200000 + Math.floor(Math.random() * 10000)} 1 ${Math.floor(Math.random() * 999)}`;
      
      const startDate = new Date(2020, 4, 1);
      const endDate = new Date(2021, 4, 30);
      const aktifMulai = generateRandomDate(startDate, endDate);
      
      const startEndDate = new Date(2022, 4, 1);
      const endEndDate = new Date(2023, 4, 30);
      const aktifSampai = generateRandomDate(startEndDate, endEndDate);
      
      return {
        id: index + 1,
        nama: dosenNames[randomNameIndex],
        nidn: nidn,
        nopeg: nopeg,
        kk: kkOptions[randomKKIndex],
        jenisKepegawaian: "PNS",
        pangkat: pangkatOptions[randomPangkatIndex],
        jabatanFungsional: jabatanOptions[randomJabatanIndex],
        statusKepegawaian: "AKTIF",
        aktifMulai: aktifMulai,
        aktifSampai: aktifSampai
      };
    });
  };
  
  const dosenData = generateDosenData();
  
  useEffect(() => {
    let filtered = [...dosenData];
    
    if (searchTerm) {
      filtered = filtered.filter(dosen => 
        dosen.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dosen.nidn.includes(searchTerm) ||
        dosen.nopeg.includes(searchTerm)
      );
    }
    
    if (prodi) {

      filtered = filtered.filter(dosen => dosen.id % 3 === parseInt(prodi) % 3);
    }
    
    if (kk) {
      filtered = filtered.filter(dosen => dosen.kk === kk);
    }
    
    if (sortBy === 'Name A-Z') {
      filtered.sort((a, b) => a.nama.localeCompare(b.nama));
    } else if (sortBy === 'Name Z-A') {
      filtered.sort((a, b) => b.nama.localeCompare(a.nama));
    }
    
    setFilteredData(filtered);
  }, [searchTerm, prodi, kk, sortBy]);
  
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
      <button 
        key="prev"
        className="pagination-btn prev" 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <span className="icon-wrapper">
          <FaChevronLeft />
        </span>
      </button>
    );
    
    items.push(
      <button 
        key={1}
        className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );
    
    if (currentPage > 3) {
      items.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
    } else if (totalPages >= 2) {
      items.push(
        <button 
          key={2}
          className={`pagination-btn ${currentPage === 2 ? 'active' : ''}`}
          onClick={() => handlePageChange(2)}
        >
          2
        </button>
      );
    }
    
    if (currentPage > 2 && currentPage < totalPages - 1) {
      items.push(
        <button 
          key={currentPage}
          className="pagination-btn active"
          onClick={() => handlePageChange(currentPage)}
        >
          {currentPage}
        </button>
      );
    }
    
    if (currentPage < totalPages - 2) {
      items.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
    } else if (totalPages > 2) {
      items.push(
        <button 
          key={totalPages - 1}
          className={`pagination-btn ${currentPage === totalPages - 1 ? 'active' : ''}`}
          onClick={() => handlePageChange(totalPages - 1)}
        >
          {totalPages - 1}
        </button>
      );
    }
    
    if (totalPages > 1) {
      items.push(
        <button 
          key={totalPages}
          className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    
    items.push(
      <button 
        key="next"
        className="pagination-btn next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="icon-wrapper">
          <FaChevronRight />
        </span>
      </button>
    );
    
    return items;
  };

  return (
    <div className="dosen-page">
      <Sidebar />
      <main className="dosen-content">

        <div className="header-container">
          <h1>Daftar Dosen</h1>
          
          <button className="add-dosen-btn">
            <span className="icon-wrapper">
              <FaPlus />
            </span>
            <span>Tambah Dosen</span>
          </button>
        </div>
        
        <div className="filter-row">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Cari Dosen..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon-wrapper">
              <FaSearch />
            </span>
          </div>
          
          <div className="filter-select">
            <select 
              value={prodi} 
              onChange={(e) => setProdi(e.target.value)}
            >
              <option value="">Prodi</option>
              <option value="1">132 - Teknik Elektro</option>
              <option value="2">135 - Teknik Informatika</option>
              <option value="3">180 - Teknik Tenaga Listrik</option>
              <option value='4'>181 - Teknik Telekomunikasi</option>
              <option value='5'>182 - Sistem dan Teknologi Informasi</option>
              <option value='6'>183 - Teknik Biomedis</option>
            </select>
          </div>
          
          <div className="filter-select">
            <select 
              value={kk} 
              onChange={(e) => setKK(e.target.value)}
            >
              <option value="">KK</option>
              {kkOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="sort-container">
            <span>Sort:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
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
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((dosen, index) => (
                <tr key={dosen.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{dosen.nama}</td>
                  <td>{dosen.nidn}</td>
                  <td>{dosen.nopeg}</td>
                  <td>{dosen.kk}</td>
                  <td>{dosen.jenisKepegawaian}</td>
                  <td>{dosen.pangkat}</td>
                  <td>{dosen.jabatanFungsional}</td>
                  <td>{dosen.statusKepegawaian}</td>
                  <td>{dosen.aktifMulai}</td>
                  <td>{dosen.aktifSampai}</td>
                  <td className="action-buttons">
                    <button className="edit-btn" title="Edit">
                      <span className="icon-wrapper">
                        <FaEdit />
                      </span>
                    </button>
                    <button className="delete-btn" title="Delete">
                      <span className="icon-wrapper">
                        <FaTrash />
                      </span>
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
            <span className="icon-wrapper">
              <FaDownload />
            </span>
            <span>Download</span>
          </button>
        </div>
      </main>
    </div>
  );
}
