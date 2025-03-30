import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/Navbar';
import "../styles/Global.css"
import "../styles/SK.css"
import { FaDownload, FaSearch, FaPencilAlt } from 'react-icons/fa';
import { FaFileArrowUp } from 'react-icons/fa6';

const dummy_sk = [
    {'no' : '74', 'judul': 'SK Dekan tentang Dosen pembimbing, Promotor dan penguji Tugas Akhir, Tesis dan Disertasi Yudisium Nov. 2024, Des. 2024, Jan. 2025 & Feb. 2025', 'tanggal': '12 Februari 2025', 'jenis' : '2'},
    {'no' : '165C', 'judul': 'SK Dekan tentang Dosen Pembimbing Tugas Akhir I Tugas Akhir II Tesis Disertasi Sem I TA 2024-2025', 'tanggal': '1 Agustus 2024', 'jenis' : '3'},
    {'no' : '165D', 'judul': 'SK Dosen Wali Akademik Mahasiswa Program Sarjana, Magister, dan Doktor Sem I TA 2024-2025', 'tanggal': '1 Agustus 2024', 'jenis' : '5'},
    {'no' : '185A', 'judul': 'SK Dekan ttg Penugasan Pengajaran Program Studi Sarjana, Magister dan Doktor STEI ITB Semester I TA 2024-2025', 'tanggal': '9 Oktober 2024', 'jenis' : '1'},
    {'no' : '190A', 'judul': 'SK Mahasiswa Asisten Kuliah dan Praktikum Program Sarjana dan Magister Sem I TA 2024-2025', 'tanggal': '17 Oktober 2024', 'jenis' : '6'},
];

const dummy_draft = [
    {'judul': 'SK Dekan tentang Dosen Pembimbing Tugas Akhir I Tugas Akhir II Tesis Disertasi Sem I TA 2025-2026', 'buat': '1 Agustus 2025', 'modif': '3 Agustus 2025'},
    {'judul': 'SK Dosen Wali Akademik Mahasiswa Program Sarjana, Magister, dan Doktor Sem I TA 2025-2026', 'buat': '1 Agustus 2025', 'modif': '3 Agustus 2025'},
    {'judul': 'SK Mahasiswa Asisten Kuliah dan Praktikum Program Sarjana dan Magister Sem I TA 2025-2026', 'buat': '1 Agustus 2025', 'modif': '3 Agustus 2025'},
];

const SKList = () => {
    const [sklist, setSK] = useState(dummy_sk);
    const [draftlist, setDraft] = useState(dummy_draft);
    const [query, setQuery] = useState('');
    const [jenis, setJenis] = useState('');
    const navigate = useNavigate();

    const navToDraft = () =>{ 
        navigate('/draft-sk');
    }

    const handleSearch = (e) => {
        setQuery(e.target.value.toLowerCase());
    }

    const handleSelect = (e) => {
        setJenis(e.target.value);
    }

    return (
        <div className='sk-container'>
            <Sidebar />
            <div className='sk-content'>
                <div className='header'>
                    <h1>Surat Keputusan</h1>
                </div>
                <div className='skfilters'>
                    <div className='search'>
                        <input onChange={handleSearch} type="text" className='sk-search' placeholder='Cari...'></input>
                        <div><FaSearch /></div>
                    </div>
                    <select className='sk-select' onChange={handleSelect}>
                        <option value="">Semua Jenis</option>
                        <option value="1">SK Pengajaran</option>
                        <option value="2">SK Pembimbing dan Penguji</option>
                        <option value="3">SK Pembimbing Mahasiswa Aktif</option>
                        <option value="4">SK Dosen Wali TPB</option>
                        <option value="5">SK Dosen Wali Mahasiswa Aktif</option>
                        <option value="6">SK Asisten Perkuliahan dan Praktikum</option>
                    </select>
                    <div></div>
                    <div className='sort'>
                        <p>Sort: </p>
                        <select className='sk-select'>
                            <option>Tanggal ↓</option>
                            <option>Tanggal ↑</option>
                        </select>
                    </div>
                </div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>No</th>
                            <th>Judul</th>
                            <th>Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                    {sklist.map((sk, _) => (
                        sk.judul.toLowerCase().includes(query) && (jenis == '' || sk.jenis == jenis) &&
                        <tr>
                            <td><a href='./src/assets/contoh_sk.pdf' target='_blank'><FaDownload/></a></td>
                            <td>{sk.no}</td>
                            <td><div className='td-judul'>{sk.judul}</div></td>
                            <td>{sk.tanggal}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className='draft-content'>
                    <div className='header'>
                        <h2 className='draft-header'>Draft SK</h2>
                        <div className='button-blue' onClick={navToDraft}>
                            + SK Baru
                        </div>
                    </div>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Judul</th>
                                <th>Dibuat</th>
                                <th>Dimodifikasi</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {draftlist.map((draft, _) => (
                            <tr>
                                <td><div className='td-judul'>{draft.judul}</div></td>
                                <td>{draft.buat}</td>
                                <td>{draft.modif}</td>
                                <td className='edit-button'><div><FaPencilAlt/></div></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {/* <div className='sk-baru-button'>
                        <div className='button-blue' onClick={navToDraft}>
                            + SK Baru
                        </div>
                    </div> */}
                    <div className='header'>
                        <h2>Penerbitan SK</h2>
                    </div>
                    <div className='terbit-sk-row'>
                        <div className='upload-sk'>
                            <div className='button-white'><FaFileArrowUp/>Pilih file</div>
                            <div>Pilih file SK untuk diterbitkan</div>
                        </div>
                        <div className='terbit button-blue'>Terbitkan</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SKList;