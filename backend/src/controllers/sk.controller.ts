import fs from "fs";
import os from "os";
import path from "path";
import { NextFunction, Request, Response } from "express";
import { createDraftSKService, getDraftSKsService, publishSKService, getPublishedSKsService, getDownloadPathService, getSKDetailService, uploadSKService, deleteDraftSKService, getDraftSKDetailService, updateDraftSKService, archiveSKService, unarchiveSKService, getArchivedSKsService, getTemplatePathService } from "../services/sk.service";
import { generateSKPreviewService } from "../services/sk.template.service";
import { convertDocxToPdf } from "../utils/convertToPdf";
import { extractDosenFromSK } from "../utils/extractDosenFromSK";
import multer from "multer";
import {
    checkPengajaranExcel,
    checkPembimbingPengujiExcel,
    checkPembimbingAktifExcel,
    checkWaliTPBExcel,
    checkWaliAktifExcel,
    checkAsistenExcel,
} from "../services/sk.service";

export const getDosenFromSK = async (req: Request, res: Response): Promise<void> => {
    const { no_sk } = req.params;
    console.log("Received SK number:", no_sk);
    const decodedSK = decodeURIComponent(no_sk);
    console.log("Decoded SK number:", decodedSK);
    
    const safeSK = no_sk.replace(/_/g, "/");
    const sk = await getSKDetailService(safeSK);
    const sk_path = sk?.file_sk
    
    const skPdfPath = path.join(__dirname, `../../public/${sk_path}`);
    console.log("Full file path:", skPdfPath);
    
    if (!fs.existsSync(skPdfPath)) {
        res.status(404).json({ message: "File SK tidak ditemukan." });
        return;
    }
    
    try {
        const dosens = await extractDosenFromSK(skPdfPath);
        res.status(200).json(dosens);
    } catch (error: any) {
        console.error("Error extracting dosen from SK:", error);
        res.status(500).json({
            message: error.message || "Gagal mengekstrak dosen dari SK",
        });
    }
};

const storageSK = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../../public/uploads/sk")
        fs.mkdirSync(uploadPath, { recursive: true })
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const originalName = path.parse(file.originalname).name
        const ext = path.extname(file.originalname)
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const newFilename = `${originalName}-${uniqueSuffix}${ext}`
        cb(null, newFilename)
    },
})

const uploadSK = multer({ storage: storageSK })

export const uploadSKFile = [
    uploadSK.single("sk"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const file = req.file;
        
        if (!file) {
            res.status(400).json({ message: "File SK tidak ditemukan" });
            return;
        }
        
        try {
            const savedSK = await uploadSKService(file.filename);
            res.status(200).json({
                message: "File SK berhasil diunggah",
                fileName: file.filename,
                sk: savedSK,
            });
        } catch (err: any) {
            console.error("Error simpan file SK:", err);
            
            try {
                fs.unlinkSync(file.path);
            } catch (fsErr) {
                console.warn("Gagal menghapus file duplikat:", fsErr);
            }
            
            res.status(400).json({
                message: err.message || "Gagal menyimpan metadata file SK",
            });
            return;
        }
    },
];


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
        const originalNoSK = no_sk.replace(/_/g, "/");
        await publishSKService(originalNoSK);
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
    res.header('Access-Control-Allow-Origin', 'https://siska-akademik.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    try {
        console.log("Starting preview generation...");
        console.log("Request body:", JSON.stringify(req.body, null, 2));
        
        const data = req.body;
        
        // Validasi data input
        if (!data || Object.keys(data).length === 0) {
            res.status(400).json({ message: "Data SK tidak lengkap" });
            return;
        }
        
        console.log("Generating SK preview service...");
        const docBuffer = await generateSKPreviewService(data);
        
        if (!docBuffer || docBuffer.length === 0) {
            throw new Error("Document buffer is empty");
        }
        
        console.log("Document buffer generated, size:", docBuffer.length);
        
        const tmpDir = os.tmpdir();
        const timestamp = Date.now();
        const tempDocxPath = path.join(tmpDir, `preview-${timestamp}.docx`);
        const tempPdfPath = path.join(tmpDir, `preview-${timestamp}.pdf`);
        
        console.log("Temp DOCX path:", tempDocxPath);
        console.log("Temp PDF path:", tempPdfPath);
        
        // Write DOCX file
        fs.writeFileSync(tempDocxPath, docBuffer);
        console.log("DOCX file written successfully");
        
        // Convert to PDF
        console.log("Converting DOCX to PDF...");
        const pdfPath = await convertDocxToPdf(tempDocxPath, tmpDir);
        console.log("PDF conversion completed, path:", pdfPath);
        
        // Verify PDF file exists
        if (!fs.existsSync(pdfPath)) {
            throw new Error(`PDF file not found at: ${pdfPath}`);
        }
        
        const pdfBuffer = fs.readFileSync(pdfPath);
        console.log("PDF buffer size:", pdfBuffer.length);
        
        // Set headers and send response
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename=preview-${timestamp}.pdf`);
        res.setHeader("Content-Length", pdfBuffer.length.toString());
        res.status(200).send(pdfBuffer);
        
        // Cleanup temporary files
        try {
            if (fs.existsSync(tempDocxPath)) fs.unlinkSync(tempDocxPath);
            if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
            console.log("Temporary files cleaned up");
        } catch (cleanupError) {
            console.warn("Warning: Failed to cleanup temporary files:", cleanupError);
        }
        
    } catch (err: any) {
        console.error("Error in generatePreviewSK:", err);
        console.error("Error stack:", err.stack);
        
        // Send detailed error for development
        const errorMessage = process.env.NODE_ENV === 'development' 
            ? `Gagal generate preview PDF SK: ${err.message}` 
            : "Gagal generate preview PDF SK";
            
        res.status(500).json({ 
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

export const downloadPublishedSK = async (req: Request, res: Response) => {
    try {
        const { no_sk } = req.params;
        const originalNoSK = no_sk.replace(/_/g, "/");
        const filePath = await getDownloadPathService(originalNoSK);
        res.download(filePath, `SK_${no_sk.replace(/ /g, "_").replace(/\//g, "_")}.pdf`);
    } catch (err) {
        console.error("Download SK error:", err);
        res.status(500).json({ message: (err as Error).message || "Gagal mengunduh SK" });
    }
};

export const getSKDetail = async (req: Request, res: Response) => {
    try {
        const { no_sk } = req.params;
        const originalNoSK = no_sk.replace(/_/g, "/");
        const sk = await getSKDetailService(originalNoSK);
        if (!sk) {
            res.status(404).json({ message: "SK tidak ditemukan" });
            return;
        }
        
        res.status(200).json(sk);
        return;
    } catch (err) {
        console.error("Error get detail SK:", err);
        res.status(500).json({ message: "Gagal mengambil detail SK" });
        return;
    }
};

export const deleteDraftSK = async (req: Request, res: Response) => {
    try {
        const { no_sk } = req.params;
        const originalNoSK = no_sk.replace(/_/g, "/");
        await deleteDraftSKService(originalNoSK);
        res.status(200).json({ message: "Draft SK berhasil dihapus" });
    } catch (err) {
        console.error("Error delete draft SK:", err);
        res.status(500).json({ message: "Gagal menghapus draft SK" });
    }
};

export const getDraftSKDetail = async (req: Request, res: Response) => {
    try {
        const { no_sk } = req.params;
        const originalNoSK = no_sk.replace(/_/g, "/");
        const draft = await getDraftSKDetailService(originalNoSK);
        if (!draft) {
            res.status(404).json({ message: "Draft SK tidak ditemukan" });
            return;
        }
        res.status(200).json(draft);
        return;
    } catch (err) {
        console.error("Error get draft SK detail:", err);
        res.status(500).json({ message: "Gagal mengambil detail draft SK" });
        return;
    }
};

export const updateDraftSK = async (req: Request, res: Response) => {
    try {
        const { no_sk } = req.params;
        const originalNoSK = no_sk.replace(/_/g, "/");
        const data = req.body;
        const updatedDraft = await updateDraftSKService(originalNoSK, data);
        res.status(200).json(updatedDraft);
    } catch (err) {
        console.error("Error update draft SK:", err);
        res.status(500).json({ message: "Gagal memperbarui draft SK" });
    }
};

export const validatePengajaranExcel = (req: Request, res: Response) => {
    const result = checkPengajaranExcel();
    res.json(result);
};

export const validatePembimbingPengujiExcel = (req: Request, res: Response) => {
    const result = checkPembimbingPengujiExcel();
    res.json(result);
};

export const validatePembimbingAktifExcel = (req: Request, res: Response) => {
    res.json({ complete: checkPembimbingAktifExcel() });
};

export const validateWaliTPBExcel = (req: Request, res: Response) => {
    res.json({ complete: checkWaliTPBExcel() });
};

export const validateWaliAktifExcel = (req: Request, res: Response) => {
    res.json({ complete: checkWaliAktifExcel() });
};

export const validateAsistenExcel = (req: Request, res: Response) => {
    res.json({ complete: checkAsistenExcel() });
};

export const archiveSK = async (req: Request, res: Response): Promise<void> => {
  try {
    const { no_sk } = req.params;
    const originalNoSK = no_sk.replace(/_/g, "/");
    await archiveSKService(originalNoSK);
    res.status(200).json({ message: "SK berhasil diarsipkan" });
  } catch (err) {
    console.error("Error mengarsipkan SK:", err);
    res.status(500).json({ message: "Gagal mengarsipkan SK" });
  }
};

export const unarchiveSK = async (req: Request, res: Response): Promise<void> => {
  try {
    const { no_sk } = req.params;
    const originalNoSK = no_sk.replace(/_/g, "/");
    await unarchiveSKService(originalNoSK);
    res.status(200).json({ message: "SK berhasil dipulihkan" });
  } catch (err) {
    console.error("Error memulihkan SK:", err);
    res.status(500).json({ message: "Gagal memulihkan SK" });
  }
};

export const getArchivedSKs = async (req: Request, res: Response): Promise<void> => {
  try {
    const archivedSKs = await getArchivedSKsService();
    res.status(200).json(archivedSKs);
  } catch (err) {
    console.error("Error fetching archived SKs:", err);
    res.status(500).json({ message: "Gagal mengambil data SK yang diarsipkan" });
  }
};

export const previewPublishedSK = async(req: Request, res: Response) => {
    try {
        const { no_sk } = req.params;
        const originalNoSK = no_sk.replace(/_/g, "/");
        const filePath = await getDownloadPathService(originalNoSK);
        var pdfBuffer = fs.readFileSync(filePath);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename=preview.pdf`);
        res.status(200).send(pdfBuffer);
    } catch (err) {
        console.error("Error getting SK preview:", err);
        res.status(500).json({ message: "Gagal preview SK" })
    }
}

export const downloadSKTemplate = async (req: Request, res: Response) => {
    try {
        const { jenis_sk } = req.params;
        const filePath = await getTemplatePathService(jenis_sk);
        res.download(filePath, `template_sk_${jenis_sk}.pdf`);
    } catch (err) {
        console.error("Download SK error:", err);
        res.status(500).json({ message: (err as Error).message || "Gagal mengunduh SK" });
    }
};

export const uploadSKTemplateController = async (req: Request, res: Response) => {
    try {
        const { jenis_sk } = req.params;
        const filePath = path.join(__dirname, "../../public/uploads", `sk_${jenis_sk}.docx`)

        const templatePath = path.join(__dirname, "../templates", `sk_${jenis_sk}.docx`)
        const backupPath = path.join(__dirname, "../templates", `sk_${jenis_sk}_backup.docx`)

        if (fs.existsSync(templatePath)) {
            fs.copyFileSync(templatePath, backupPath);
        }

        fs.copyFileSync(filePath, templatePath);

        fs.unlinkSync(filePath);
        res.status(200).json({ message: "Template SK berhasil diunggah", path: filePath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal upload template SK" });
    }
};

export const undoSKTemplate = async (req: Request, res: Response) => {
    try {
        const { jenis_sk } = req.params;
        const filePath = path.join(__dirname, "../../public/uploads", `sk_${jenis_sk}.docx`)

        const templatePath = path.join(__dirname, "../templates", `sk_${jenis_sk}.docx`)
        const backupPath = path.join(__dirname, "../templates", `sk_${jenis_sk}_backup.docx`)

        if (fs.existsSync(templatePath)) {
            fs.unlinkSync(templatePath);
        }

        fs.renameSync(backupPath, templatePath);
        res.status(200).json({ message: "Berhasil undo upload template", path: filePath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal undo upload template" });
    }
};