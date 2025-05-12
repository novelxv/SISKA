import React, { useState, useEffect } from "react";
import Sidebar from "../components/Navbar";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import "../styles/KelolaAkun.css";
import "../styles/Global.css";
import Search from "../components/Search";
import ButtonWithIcon from "../components/Button";
import SortButtonNew from "../components/SortButtonNew";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../services/authService";
import { getUsers, deleteUser, User } from "../services/userService";

const KelolaAkun: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSort, setSelectedSort] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const userData = await getLoggedInUser();
                setLoggedInUserId(userData.id);
            } catch (error) {
                console.error("Error fetching logged-in user:", error);
                toast.error("Gagal memuat data pengguna login");
            }
        };

        fetchLoggedInUser();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const displayedUsers = users.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    const totalPages = Math.ceil(users.length / itemsPerPage);
    
    const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
        setCurrentPage(page);
    }
    };
    
    const renderPaginationItems = () => {
        const items = [];
        
        // Previous Button
        items.push(
            <button 
                key="prev"
                className="pagination-btn prev" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <span className="icon-wrapper">
                    <FaChevronLeft />
                </span>
            </button>
        );
    
        items.push(
            <button 
                key={1}
                className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(1)}
            >
                1
            </button>
        );
    
        if (currentPage > 3) {
            items.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
        }
    
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            items.push(
                <button 
                    key={i}
                    className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
    
        if (currentPage < totalPages - 2) {
            items.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
        }
    
        if (totalPages > 1) {
            items.push(
                <button 
                    key={totalPages}
                    className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }
    
        // Next Button
        items.push(
            <button 
                key="next"
                className="pagination-btn next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <span className="icon-wrapper">
                    <FaChevronRight />
                </span>
            </button>
        );
    
        return items;
    };
    

    

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const roleOptions = [
        { label: "Akademik", value: "AKADEMIK" },
        { label: "Admin KK", value: "ADMIN_KK" },
        { label: "Admin Prodi", value: "ADMIN_PRODI" },
      ];      
      
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

    const handleSort = (label: string) => {
        console.log("INI ISI DARI ROLE", label);
        if (label === "Semua Role") {
            setSelectedSort(""); 
            setUsers(allUsers);
            return;
          }
        
          const selectedRoleValue = roleOptions.find((r) => r.label === label)?.value;
          if (!selectedRoleValue) return;
        
          setSelectedSort(selectedRoleValue);
          const filteredUsers = allUsers.filter(user => user.role === selectedRoleValue);
          setUsers(filteredUsers);
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
            // Cek apakah pengguna mencoba menghapus dirinya sendiri
            if (selectedUser.id === loggedInUserId) {
                toast.error("Anda tidak dapat menghapus akun Anda sendiri.");
                setIsModalOpen(false);
                setSelectedUser(null);
                return;
            }

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
                    <ButtonWithIcon text="Tambah Akun" onClick={handleAddAkun} />
                </div>
                <div className="kelola-filtercontainer">
                    <Search searchTerm={searchTerm} setSearchTerm={handleSearch} />
                    <SortButtonNew 
                        options={["Semua Role", ...roleOptions.map((r) => r.label)]}
                        selectedOption={
                            selectedSort === ""
                            ? "Semua Role"
                            : roleOptions.find((r) => r.value === selectedSort)?.label || ""
                        }
                        onChange={handleSort}
                        />


                </div>

                <div className="dosen-table-container" id="sk-table-container">
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
                            {displayedUsers
                                .filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
                                .length > 0 ? (
                                displayedUsers
                                    .filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className={user.id === loggedInUserId ? "highlight-row" : ""} // Tambahkan kelas CSS
                                        >
                                            <td>{indexOfFirstItem + index + 1}</td>
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

                <div className="pagination-container">
                    <div className="pagination">
                    {renderPaginationItems()}
                    </div>
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
