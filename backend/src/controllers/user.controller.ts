import { Request, Response } from "express";
import { getAllUsersService, deleteUserService, updateUserService, getUserByIdService } from "../services/user.service";

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data user" });
    }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        // Cek apakah pengguna mencoba menghapus dirinya sendiri
        if (req.user.id === id) {
            res.status(400).json({ message: "Anda tidak dapat menghapus diri sendiri" });
            return;
        }

        await deleteUserService(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus user" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { role, jenisKK, jenisProdi } = req.body;

        if (role === "ADMIN_KK" && !jenisKK) {
            res.status(400).json({ message: "Jenis KK harus diisi untuk role ADMIN_KK" });
            return;
        }

        if (role === "ADMIN_PRODI" && !jenisProdi) {
            res.status(400).json({ message: "Jenis Prodi harus diisi untuk role ADMIN_PRODI" });
            return;
        }

        const updated = await updateUserService(id, req.body);
        res.status(200).json(updated);
    } catch (error) {
        console.error("Error update user:", error);
        res.status(500).json({ message: "Gagal mengupdate akun" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const user = await getUserByIdService(id);
        if (!user) res.status(404).json({ message: "User tidak ditemukan" });
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetch user:", error);
        res.status(500).json({ message: "Gagal mengambil data user" });
    }
};