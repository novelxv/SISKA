import { Request, Response } from "express";
import { createDraftSKService, getDraftSKsService, publishSKService, getPublishedSKsService } from "../services/sk.service";
import { generateSKPreviewService } from "../services/sk.template.service";

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
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.setHeader("Content-Disposition", `attachment; filename=preview-${no_sk}.docx`);
        res.send(docBuffer);
    } catch (err) {
        console.error("Error generate preview:", err);
        res.status(500).json({ message: "Gagal generate preview SK" });
    }
};