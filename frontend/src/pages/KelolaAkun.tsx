import React, { useState } from "react";
import Sidebar from "../components/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/KelolaAkun.css";
import "../styles/Global.css";
import SearchBar from "../components/SearchBar";
import SortButton from "../components/SortButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
    id: number;
    username: string;
    password: string;
    role: string;
}

const KelolaAkun: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedSort, setSelectedSort] = useState<string>("");
    const [users, setUsers] = useState<User[]>([
        { id: 1, username: "adminstei1", password: "admin123", role: "AKADEMIK" },
        { id: 2, username: "adminkk1", password: "admin123", role: "ADMIN_KK" },
        { id: 3, username: "adminprodi1", password: "admin123", role: "ADMIN_PRODI" },
        { id: 4, username: "user1", password: "password1", role: "AKADEMIK" },
        { id: 5, username: "user2", password: "password2", role: "ADMIN_KK" },
        { id: 6, username: "adminstei1", password: "admin123", role: "AKADEMIK" },
    ]);

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleSort = (criteria: string) => {
        setSelectedSort(criteria);
        const sortedUsers = [...users].sort((a, b) => {
            const valueA = a[criteria as keyof User];
            const valueB = b[criteria as keyof User];
            if (typeof valueA === "string" && typeof valueB === "string") {
                return valueA.localeCompare(valueB);
            }
            return 0;
        });
        setUsers(sortedUsers);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        console.log("Pencarian untuk:", query);
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedUser) {
            setUsers(users.filter(user => user.id !== selectedUser.id));
            toast.success(`Akun ${selectedUser.username} telah dihapus!`);
            setIsModalOpen(false);
            setSelectedUser(null);
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <main className="content">
                <div className="header">
                    <h1>Daftar Akun</h1>
                    <button className="button-blue">+ Tambah Akun</button>
                </div>
                <div className="kelola-filtercontainer">
                    <SearchBar onSearch={handleSearch} />
                    <SortButton items={["username", "role"]} onSelect={handleSort} />
                </div>

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
                            {users
                                .filter(user =>
                                    user.username.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td>{user.username}</td>
                                        <td>{user.password}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <div className="action-icons">
                                                <FaEdit />
                                                <FaTrash onClick={() => handleDeleteClick(user)} />
                                            </div>
                                        </td>
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

            {/* Confirmation Delete */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Yakin untuk hapus akun ini?</h2>
                        <p>Aksi ini tidak bisa dibatalkan.</p>
                        <div className="modal-buttons">
                            <button className="button-outline" onClick={() => setIsModalOpen(false)}>Batal</button>
                            <button className="button-confirm" onClick={confirmDelete}>Konfirmasi</button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default KelolaAkun;
