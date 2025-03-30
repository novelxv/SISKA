import { Request, Response } from "express";
import { getAllUsersService, deleteUserService, updateUserService, getUserByIdService } from "../services/user.service";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data user" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await deleteUserService(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus user" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
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