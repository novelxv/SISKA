import React from 'react';
import { useState } from "react";
import Sidebar from '../components/Navbar';
import "../styles/Global.css"
import "../styles/DraftSK.css"
import { FaAngleLeft, FaDownload, FaImage, FaRegEye } from 'react-icons/fa';
import { FaFileArrowUp } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const DraftSK = () => {
    const [draft, setDraft] = useState({});
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const navToSK = () =>{ 
        navigate('/sk');
    }

    return (
        <div className='draft-sk-container'>
            <Sidebar />
            <div className='draft-sk-content'>
                <div className='draftheader'>
                    <div className='title back-button' onClick={navToSK}><FaAngleLeft/></div>
                    <h1 className='title'>Draft SK</h1>
                </div>
                <form>
                    <div className='inputrow1'>
                        <div className='template'>
                            <div>Template: </div>
                            <select name="jenisSK" id="jenisSK" className='sk-select'>
                                <option>SK Pengajaran</option>
                                <option>SK Pembimbing dan Penguji</option>
                                <option>SK Pembimbing Mahasiswa Aktif</option>
                                <option>SK Dosen Wali TPB</option>
                                <option>SK Dosen Wali Mahasiswa Aktif</option>
                                <option>SK Asisten Perkuliahan dan Praktikum</option>
                            </select>
                        </div>
                        <div className='button-blue'><FaRegEye/>Preview</div>
                    </div>
                    <div className='inputrow2'>
                        <div>
                            Judul SK <br></br>
                            <input type="text" className='sk-input'></input>
                        </div>
                    </div>
                    <div className='inputrow3'>
                        <div>
                            Nomor SK <br></br>
                            <input type="text" className='sk-input'></input>
                        </div>
                        <div>
                            Tanggal <br></br>
                            <input type="text" className='sk-input'></input>
                        </div>
                        <div>
                            Semester <br></br>
                            <input type="text" className='sk-input'></input>
                        </div>
                    </div>
                    <div className='inputrow4'>
                        <div>
                            Nama Dekan <br></br>
                            <input type="text" className='sk-input'></input>
                        </div>
                        <div>
                            NIP Dekan <br></br>
                            <input type="text" className='sk-input'></input>
                        </div>
                    </div>
                    <div className='inputrow5'>
                        <div>
                            <div>TTD Dekan</div>
                            <div className='button-white'><FaFileArrowUp/>Pilih file</div>
                        </div>
                        <div className='signpreview'><FaImage /></div>
                    </div>
                    <div className='inputrow6'>
                        <div className='downloads'>
                            <div className='button-white'><FaDownload/>PDF</div>
                            <div className='button-white'><FaDownload/>DOCX</div>
                        </div>
                        <div className='downloads'>
                            <div className='button-blue' onClick={navToSK}>Simpan</div>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default DraftSK;