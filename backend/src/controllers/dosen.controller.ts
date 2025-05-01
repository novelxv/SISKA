import { Request, Response } from "express";
import {
    createDosenService,
    getAllDosenService,
    getDosenByIdService,
    updateDosenService,
    deleteDosenService,
} from "../services/dosen.service";

export const createDosen = async (req: Request, res: Response) => {
    console.log("nyampe di sini")
    try {
        const data = req.body;
        console.log("data", req.body);
        const dosen = await createDosenService(data);
        console.log("Data dosen yang dikirim:", dosen);
        res.status(201).json(dosen);
    } catch (err) {
        console.error("Error create dosen:", err);
        res.status(500).json({ message: "Gagal membuat data dosen" });
    }
};

export const getAllDosen = async (_req: Request, res: Response) => {
    try {
        const dosenList = await getAllDosenService();
        res.status(200).json(dosenList);
    } catch (err) {
        console.error("Error get all dosen:", err);
        res.status(500).json({ message: "Gagal mengambil data dosen" });
    }
};

export const getDosenById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const dosen = await getDosenByIdService(id);
        if (!dosen) {
            res.status(404).json({ message: "Dosen tidak ditemukan" });
        }
        res.status(200).json(dosen);
    } catch (err) {
        console.error("Error get dosen by ID:", err);
        res.status(500).json({ message: "Gagal mengambil detail dosen" });
    }
};

export const updateDosen = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        console.log("Data yang diterima untuk diupdate:", data);
        const updated = await updateDosenService(id, data);
        res.status(200).json(updated);
    } catch (err) {
        console.error("Error update dosen:", err);
        res.status(500).json({ message: "Gagal memperbarui data dosen" });
    }
};

export const deleteDosen = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        console.log("ID yang diterima untuk dihapus:", id);
        await deleteDosenService(id);
        res.status(200).json({ message: "Data dosen berhasil dihapus" });
    } catch (err) {
        console.error("Error delete dosen:", err);
        res.status(500).json({ message: "Gagal menghapus data dosen" });
    }
};
