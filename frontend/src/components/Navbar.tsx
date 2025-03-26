import { Link, useLocation } from "react-router-dom";
import { FaUsers, FaFileAlt, FaUserCog, FaSignOutAlt } from "react-icons/fa";
import "../styles/Navbar.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo">
        <img src="../../public/Logo SiSKA.png" alt="SISKA Logo" className="logo-img" />
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul>
          <li className={location.pathname === "/dosen" ? "active" : ""}>
            <Link to="/dosen">
              <FaUsers className="icon" />
              Dosen
            </Link>
          </li>
          <li className={location.pathname === "/sk" ? "active" : ""}>
            <Link to="/sk">
              <FaFileAlt className="icon" />
              Surat Keputusan (SK)
            </Link>
          </li>
          <li className={location.pathname === "/kelola-akun" ? "active" : ""}>
            <Link to="/kelola-akun">
              <FaUserCog className="icon" />
              Kelola Akun
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="logout">
        <Link to="/logout">
          <FaSignOutAlt className="icon" />
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
