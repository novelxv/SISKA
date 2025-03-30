import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUsers, FaFileAlt, FaUserCog, FaSignOutAlt } from "react-icons/fa";
import "../styles/Navbar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo">
        <img src="/Logo SiSKA.png" alt="SISKA Logo" className="logo-img" />
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul>
          <li className={location.pathname === "/dosen" ? "active" : ""}>
            <a href="/dosen">
              <FaUsers />
              Dosen
            </a>
          </li>
          <li className={location.pathname === "/sk" ? "active" : ""}>
            <a href="/sk">
              <FaFileAlt />
              Surat Keputusan (SK)
            </a>
          </li>
          <li className={location.pathname === "/kelola-akun" ? "active" : ""}>
            <a href="/kelola-akun">
              <FaUserCog />
              Kelola Akun
            </a>
          </li>
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