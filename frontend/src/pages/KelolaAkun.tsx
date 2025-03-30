import React, { useState, useEffect } from "react";
import Sidebar from "../components/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/KelolaAkun.css";
import "../styles/Global.css";
import Search from "../components/Search";
import SortButtonNew from "../components/SortButtonNew";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser, User } from "../services/userService";

const KelolaAkun: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSort, setSelectedSort] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getUsers();
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Gagal memuat data akun");
            }
        };
        fetchUsers();
    }, []);

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
        setSearchTerm(query);
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedUser) {
            try {
                await deleteUser(selectedUser.id);
                setUsers(users.filter(user => user.id !== selectedUser.id));
                toast.success(`Akun ${selectedUser.username} berhasil dihapus.`);
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Gagal menghapus akun");
            } finally {
                setIsModalOpen(false);
                setSelectedUser(null);
            }
        }
    };    

    return (
        <div className="container">
            <Sidebar />
            <main className="content">
                <div className="header">
                    <h1>Daftar Akun</h1>
                    <button className="button-blue" onClick={() => navigate("/tambah-akun")}>+ Tambah Akun</button>
                </div>
                <div className="kelola-filtercontainer">
                    <Search searchTerm={searchTerm} setSearchTerm={handleSearch} />
                    <SortButtonNew 
                        options={["username", "role"]} 
                        selectedOption={selectedSort} 
                        onChange={handleSort} 
                    />
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
                                    user.username.toLowerCase().includes(searchTerm.toLowerCase())
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
                                                <button className="icon-button" onClick={() => handleDeleteClick(user)}>
                                                    <FaTrash />
                                                </button>
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
