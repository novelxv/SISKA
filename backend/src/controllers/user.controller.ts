import { Request, Response } from "express";
import { getAllUsersService, deleteUserService } from "../services/user.service";

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