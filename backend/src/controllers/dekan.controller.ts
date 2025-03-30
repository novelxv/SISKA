import { Request, Response } from "express";
import { updateTTDDekanService, getTTDDekanPathService } from "../services/dekan.service";
import path from "path";
import fs from "fs";

export const uploadDekanTTD = async (req: Request, res: Response) => {
    try {
        const nip = req.params.nip;
        const filePath = `/uploads/ttd/${req.file?.filename}`;

        await updateTTDDekanService(nip, filePath);
        res.status(200).json({ message: "Tanda tangan berhasil diunggah", path: filePath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal upload tanda tangan" });
    }
};

export const getDekanTTD = async (req: Request, res: Response) => {
    try {
        const nip = req.params.nip;
        const ttdPath = await getTTDDekanPathService(nip);

        if (!ttdPath) {
            res.status(404).json({ message: "Tanda tangan tidak ditemukan" });
        }

        const fullPath = path.join(__dirname, "../../public", ttdPath);
        if (!fs.existsSync(fullPath)) {
            res.status(404).json({ message: "File tidak ditemukan" });
        }

        res.sendFile(fullPath);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil tanda tangan" });
    }
};