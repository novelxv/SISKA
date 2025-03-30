import React, { useState, useEffect } from "react";
import Sidebar from "../components/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/KelolaAkun.css";
import "../styles/Global.css";
import Search from "../components/Search";
import ButtonWithIcon from "../components/Button";
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
    const [allUsers, setAllUsers] = useState<User[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const displayedUsers = users.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const roleOptions = ["AKADEMIK", "ADMIN KK", "ADMIN PRODI"];

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getUsers();
                setAllUsers(usersData);
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Gagal memuat data akun");
            }
        };
        
        fetchUsers();
    }, []);

    const handleSort = (role: string) => {
        console.log("INI ISI DARI ROLE", role);
        setSelectedSort(role);
        const normalizeRole = (r: string) => r.replace(/_/g, " ");
    
        if (role === "" || role === "Semua Role") {
            console.log("MASUK SINI");
            setUsers(allUsers);
        } else {
            const filteredUsers = allUsers.filter(user => normalizeRole(user.role) === role);
            setUsers(filteredUsers);
        }
    };
    

    const handleSearch = (query: string) => {
        setSearchTerm(query);
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleEditClick = (user: User) => {
        navigate(`/edit-akun/${user.id}`);
    };

    const handleAddAkun = () => {
        navigate('/tambah-akun');
    }
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
                    <ButtonWithIcon text="Tambah Dosen" onClick={handleAddAkun} />
                </div>
                <div className="kelola-filtercontainer">
                    <Search searchTerm={searchTerm} setSearchTerm={handleSearch} />
                    <SortButtonNew 
                        options={["Semua Role", ...roleOptions]} 
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
                            {users.length > 0 ? (
                                users
                                    .filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((user, index) => (
                                        <tr key={user.id}>
                                            <td>{index + 1}</td>
                                            <td>{user.username}</td>
                                            <td>{user.password}</td>
                                            <td>{user.role.replace(/_/g, " ")}</td>
                                            <td>
                                                <div className="action-icons">
                                                    <FaEdit onClick={() => handleEditClick(user)} />
                                                    <FaTrash onClick={() => handleDeleteClick(user)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="no-data">No Data Available</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

                <div className="pagination">
                    <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        &laquo;
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <button 
                            key={index + 1} 
                            className={currentPage === index + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button 
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        &raquo;
                    </button>
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
