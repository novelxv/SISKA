import fs from "fs";
import os from "os";
import path from "path";
import { Request, Response } from "express";
import { createDraftSKService, getDraftSKsService, publishSKService, getPublishedSKsService, getDownloadPathService, getSKDetailService } from "../services/sk.service";
import { generateSKPreviewService } from "../services/sk.template.service";
import { convertDocxToPdf } from "../utils/convertToPdf";

export const createDraftSK = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const draft = await createDraftSKService(data);
        res.status(201).json(draft);
    } catch (err) {
        console.error("Error create draft SK:", err);
        res.status(500).json({ message: "Gagal membuat draft SK" });
    }
};

export const getDraftSKs = async (req: Request, res: Response) => {
    try {
        const drafts = await getDraftSKsService();
        res.status(200).json(drafts);
    } catch (err) {
        console.error("Error fetch draft SK:", err);
        res.status(500).json({ message: "Gagal mengambil data draft SK" });
    }
};

export const publishSK = async (req: Request, res: Response) => {
    try {
        const { no_sk } = req.params;
        await publishSKService(no_sk);
        res.status(200).json({ message: "SK berhasil diterbitkan" });
    } catch (err) {
        res.status(500).json({ message: "Gagal menerbitkan SK" });
    }
};  

export const getPublishedSKs = async (req: Request, res: Response) => {
    try {
        const published = await getPublishedSKsService();
        res.status(200).json(published);
    } catch (err) {
        console.error("Error fetch published SK:", err);
        res.status(500).json({ message: "Gagal mengambil data SK terbit" });
    }
};

export const generatePreviewSK = async (req: Request, res: Response) => {
    try {
        const { no_sk } = req.params;
        const docBuffer = await generateSKPreviewService(no_sk);

        const tmpDir = os.tmpdir();
        const tempDocxPath = path.join(tmpDir, `${no_sk}.docx`);
        const tempPdfPath = path.join(tmpDir, `${no_sk}.pdf`);

        fs.writeFileSync(tempDocxPath, docBuffer);
        const pdfPath = await convertDocxToPdf(tempDocxPath, tmpDir);

        const pdfBuffer = fs.readFileSync(pdfPath);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename=preview-${no_sk}.pdf`);
        res.send(pdfBuffer);

        fs.unlinkSync(tempDocxPath);
        fs.unlinkSync(tempPdfPath);
    } catch (err) {
        console.error("Error preview SK PDF:", err);
        res.status(500).json({ message: "Gagal generate preview PDF SK" });
    }
};

export const downloadPublishedSK = async (req: Request, res: Response) => {
    try {
        const { no_sk } = req.params;
        const filePath = await getDownloadPathService(no_sk);
        res.download(filePath, `SK_${no_sk}.pdf`);
    } catch (err) {
        console.error("Download SK error:", err);
        res.status(500).json({ message: (err as Error).message || "Gagal mengunduh SK" });
    }
};

export const getSKDetail = async (req: Request, res: Response) => {
    try {
        const { no_sk } = req.params;
        const sk = await getSKDetailService(no_sk);
        if (!sk) res.status(404).json({ message: "SK tidak ditemukan" });

        res.status(200).json(sk);
    } catch (err) {
        console.error("Error get detail SK:", err);
        res.status(500).json({ message: "Gagal mengambil detail SK" });
    }
};