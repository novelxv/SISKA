import React from 'react';
import { useState } from "react";
import Sidebar from '../components/Navbar';
import "../styles/Global.css"
import "../styles/SK.css"
import { FaDownload, FaSearch, FaCaretDown, FaPencilAlt } from 'react-icons/fa';

const dummy_sk = [
    {'no' : '74', 'judul': 'SK Dekan tentang Dosen pembimbing, Promotor dan penguji Tugas Akhir, Tesis dan Disertasi Yudisium Nov. 2024, Des. 2024, Jan. 2025 & Feb. 2025', 'tanggal': '12 Februari 2025'},
    {'no' : '165C', 'judul': 'SK Dekan tentang Dosen Pembimbing Tugas Akhir I Tugas Akhir II Tesis Disertasi Sem I TA 2024-2025', 'tanggal': '1 Agustus 2024'},
    {'no' : '165D', 'judul': 'SK Dosen Wali Akademik Mahasiswa Program Sarjana, Magister, dan Doktor Sem I TA 2024-2025', 'tanggal': '1 Agustus 2024'},
    {'no' : '185A', 'judul': 'SK Dekan ttg Penugasan Pengajaran Program Studi Sarjana, Magister dan Doktor STEI ITB Semester I TA 2024-2025', 'tanggal': '9 Oktober 2024'},
    {'no' : '190A', 'judul': 'SK Mahasiswa Asisten Kuliah dan Praktikum Program Sarjana dan Magister Sem I TA 2024-2025', 'tanggal': '17 Oktober 2024'},
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

    return (
        <div className='container'>
            <Sidebar />
            <div className='content'>
                <h1 className='skheader'>Surat Keputusan</h1>
                <div className='skfilters'>
                    <div className='filter search'>
                        <div>Cari...</div>
                        <div><FaSearch /></div>
                    </div>
                    <div className='filter dropdown'>
                        <div>Jenis SK</div>
                        <div><FaCaretDown /></div>
                    </div>
                    <div></div>
                    <div className='sort'>
                        <p>Sort: </p>
                        <div className='filter dropdown'>
                            <div>Tanggal ↓</div>
                            <div><FaCaretDown /></div>
                        </div>
                    </div>
                </div>
                <div className='table'>
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
                        <tr>
                            <td><a href='./src/assets/contoh_sk.pdf' target='_blank'><FaDownload/></a></td>
                            <td>{sk.no}</td>
                            <td>{sk.judul}</td>
                            <td>{sk.tanggal}</td>
                        </tr>
                    ))}
                    </tbody>
                </div>
                <div className='draft-content'>
                    <h2 className='draft-header'>Draft SK</h2>
                    <div className='table'>
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
                                <td>{draft.judul}</td>
                                <td>{draft.buat}</td>
                                <td>{draft.modif}</td>
                                <td><FaPencilAlt/></td>
                            </tr>
                        ))}
                        </tbody>
                    </div>
                    <div className='skbaru'>
                        <div className='button'>
                            + SK Baru
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SKList;