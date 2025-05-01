import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUsers, FaFileAlt, FaUserCog, FaSignOutAlt, FaUpload } from "react-icons/fa";
import "../styles/Navbar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  const isAkademik = auth?.role === 'AKADEMIK';
  const isAdminProdi = auth?.role === 'ADMIN_PRODI';
  const isAdminKK = auth?.role === 'ADMIN_KK';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo">
        <img src="/Logo SiSKA.png" alt="SISKA Logo" className="logo-img" />
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul>
          {isAkademik && (
            <li className={location.pathname === "/dosen" ? "active" : ""}>
              <a href="/dosen">
                <FaUsers />
                Dosen
              </a>
            </li>            
          )}

          {isAkademik && (
            <li className={location.pathname === "/sk" ? "active" : ""}>
              <a href="/sk">
                <FaFileAlt />
                Surat Keputusan (SK)
              </a>
            </li>
          )}

          {isAkademik && (
            <li className={location.pathname === "/kelola-akun" ? "active" : ""}>
              <a href="/kelola-akun">
                <FaUserCog />
                Kelola Akun
              </a>
            </li>
          )}

          {isAkademik && (
            <li className={location.pathname === "/upload-excel-akademik" ? "active" : ""}>
              <a href="/upload-excel-akademik">
                <FaUpload />
                Upload Excel
              </a>
            </li>            
          )}

          {isAdminProdi && (
            <li className={location.pathname === "/upload-excel-prodi" ? "active" : ""}>
              <a href="/upload-excel-prodi">
                <FaUpload />
                Upload Excel
              </a>
            </li>            
          )}

          {isAdminKK && (
            <li className={location.pathname === "/admin-kk" ? "active" : ""}>
              <a href="/admin-kk">
                <FaFileAlt />
                Surat Keputusan (SK)
              </a>
            </li>
          )}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="logout">
        <button onClick={handleLogout} className="logout">
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;