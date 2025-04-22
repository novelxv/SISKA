import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Navbar";
import "../styles/Global.css";
import "../styles/SK.css";
import { FaDownload, FaSearch, FaPencilAlt } from "react-icons/fa";
import { FaFileArrowUp } from "react-icons/fa6";
import { getPublishedSK, getDraftSK, downloadSK, uploadSKPDF } from "../services/skService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const jenisSKMap: Record<string, string> = {
  PENGAJARAN: "SK Pengajaran",
  PEMBIMBING_PENGUJI: "SK Pembimbing dan Penguji",
  PEMBIMBING_AKTIF: "SK Pembimbing Mahasiswa Aktif",
  WALI_TPB: "SK Dosen Wali TPB",
  WALI_MHS_AKTIF: "SK Dosen Wali Mahasiswa Aktif",
  ASISTEN_PRAKTIKUM: "SK Asisten Perkuliahan dan Praktikum"
};

const SKList = () => {
  interface SK {
    no_sk: string;
    judul: string;
    tanggal: string;
    jenis_sk?: string;
    created_at?: string;
    updated_at?: string;
  }

  const [sklist, setSK] = useState<SK[]>([]);
  const [draftlist, setDraft] = useState<SK[]>([]);
  const [query, setQuery] = useState("");
  const [jenis, setJenis] = useState("");
  const [skFile, setSkFile] = useState<File | null>(null);
  const [skFileName, setSkFileName] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSKFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSkFile(file);
      setSkFileName(file.name);
    }
  };

  const handlePublish = async () => {
    if (!skFile) {
      toast.warning("Silakan pilih file SK terlebih dahulu");
      return;
    }
    try {
      const result = await uploadSKPDF(skFile);
      toast.success("File SK berhasil diterbitkan");
      setSkFile(null);
      setSkFileName(null);
    } catch (err) {
      // console.error("Upload Error:", err);
      toast.error("Gagal upload file SK");
    }
  };
  

  const navToDraft = () => {
    navigate("/draft-sk");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value.toLowerCase());
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setJenis(e.target.value);
  };

  const handleDownload = async (no_sk: string) => {
    try {
      const blob = await downloadSK(no_sk);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `SK_${no_sk}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error("Gagal mengunduh SK");
    }
  };

  const handleEditDraft = (no_sk: string) => {
    navigate(`/draft-sk?no_sk=${no_sk}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [published, draft] = await Promise.all([
          getPublishedSK(),
          getDraftSK()
        ]);
        setSK(published);
        setDraft(draft);
      } catch (err) {
        toast.error("Gagal mengambil data SK");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="sk-container">
      <Sidebar />
      <ToastContainer />
      <div className="sk-content">
        <div className="header">
          <h1>Surat Keputusan</h1>
        </div>

        <div className="skfilters">
          <div className="search">
            <input
              onChange={handleSearch}
              type="text"
              className="sk-search"
              placeholder="Cari..."
            />
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
            <select className="sk-select">
              <option>Tanggal ↓</option>
              <option>Tanggal ↑</option>
            </select>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>No</th>
              <th>Judul</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {sklist
              .filter(
                (sk) =>
                  sk.judul.toLowerCase().includes(query) &&
                  (jenis === "" || sk.jenis_sk === jenis)
              )
              .map((sk) => (
                <tr key={sk.no_sk}>
                  <td>
                    <div onClick={() => handleDownload(sk.no_sk)}>
                      <FaDownload />
                    </div>
                  </td>
                  <td>{sk.no_sk}</td>
                  <td>
                    <div className="td-judul">{sk.judul}</div>
                  </td>
                  <td>
                    {new Date(sk.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="draft-content">
          <div className="header">
            <h2 className="draft-header">Draft SK</h2>
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {draftlist.map((draft) => (
                <tr key={draft.no_sk}>
                  <td>
                    <div className="td-judul">{draft.judul}</div>
                  </td>
                  <td>
                    {draft.created_at ? new Date(draft.created_at).toLocaleDateString("id-ID") : "N/A"}
                  </td>
                  <td>
                    {draft.updated_at ? new Date(draft.updated_at).toLocaleDateString("id-ID") : "N/A"}
                  </td>
                  <td className="edit-button">
                    <div onClick={() => handleEditDraft(draft.no_sk)}>
                      <FaPencilAlt />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="header">
            <h2>Penerbitan SK</h2>
          </div>
          <div className="terbit-sk-row">
            <div className="upload-sk">
              <input
                type="file"
                accept=".pdf"
                onChange={handleSKFileChange}
                hidden
                id="fileInput"
              />
              <label htmlFor="fileInput" className="button-white">
                <FaFileArrowUp />
                Pilih file
              </label>

              <div>
                {skFileName ? skFileName : "Pilih file SK untuk diterbitkan"}
              </div>
            </div>
            <div className="terbit button-blue" onClick={handlePublish}>Terbitkan</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SKList;