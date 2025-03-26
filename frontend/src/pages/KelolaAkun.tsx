import React, { useState } from "react";
import Sidebar from "../components/Navbar";
import "../styles/KelolaAkun.css";
import "../styles/Global.css";
import SearchBar from "../components/SearchBar";
// Dummy list of users
const users = [
  { id: 1, username: "adminstei1", password: "admin123", role: "AKADEMIK" },
  { id: 2, username: "adminkk1", password: "admin123", role: "ADMIN_KK" },
  { id: 3, username: "adminprodi1", password: "admin123", role: "ADMIN_PRODI" },
  { id: 4, username: "user1", password: "password1", role: "AKADEMIK" },
  { id: 5, username: "user2", password: "password2", role: "ADMIN_KK" },
];

const KelolaAkun = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (query) => {
        setSearchQuery(query);
        console.log("Pencarian untuk:", query);
    };
    return (
        <div className="container">
            <Sidebar />
            <main className="content">
                <div className="header">
                <h1>Daftar Akun</h1>
                <button className="button">+ Tambah Akun</button>
                </div>
                <SearchBar onSearch={handleSearch} />

                <div className="table-container">
                <table className="table">
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Role</th>
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.password}</td>
                        <td>{user.role}</td>
                        <td>✏️ 🗑</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                <div className="pagination">
                <button className="active">1</button>
                <button>2</button>
                <button>...</button>
                <button>10</button>
                </div>
            </main>
        </div>
    );
};

export default KelolaAkun;
