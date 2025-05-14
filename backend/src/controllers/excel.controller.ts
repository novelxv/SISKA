import { Request, Response } from 'express';
import path from "path";
import fs from "fs";
import {
    saveFileToDisk,
    updateUploadStatus,
    shouldProcessFile,
    processFiles,
    getAllUploadStatuses,
    resetUploadStatus
} from '../services/excel.service';

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { file } = req;
    const templateType = req.body.templateType;

    if (!file) {
      res.status(400).json({ success: false, message: 'No file uploaded.' });
      return;
    }

    if (!templateType) {
      res.status(400).json({ success: false, message: 'Template type is required.' });
      return;
    }

    const multerFile = file as Express.Multer.File;
    
    const filePath = await saveFileToDisk(multerFile, templateType);
    
    await updateUploadStatus(templateType, filePath);
    
    const shouldProcess = await shouldProcessFile(templateType);
    
    if (shouldProcess) {
      await processFiles(templateType);
      
      res.status(200).json({
        success: true,
        message: 'File uploaded and processed successfully.',
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'File uploaded successfully. It will be processed when all required files are available.',
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error processing the file:', error.message);
      res.status(500).json({
        success: false,
        message: 'An error occurred while processing the file.',
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred.',
      });
    }
  }
};

export const getUploadStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const statuses = await getAllUploadStatuses();
    
    res.status(200).json({
      success: true,
      data: statuses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching upload statuses.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const resetStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { templateType } = req.params;
    
    await resetUploadStatus(templateType);
    
    res.status(200).json({
      success: true,
      message: 'Upload status reset successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while resetting upload status.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const ALLOWED_TYPES = ["pengajaran", "pembimbing-penguji", "dosen-wali", "asisten"];

export const uploadExcel = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { jenis } = req.params;

  if (!ALLOWED_TYPES.includes(jenis)) {
    res.status(400).json({ message: "Jenis SK tidak valid" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ message: "File tidak ditemukan" });
    return;
  }

  const folderMap: Record<string, string> = {
    pengajaran: "excel_pengajaran",
    "pembimbing-penguji": "excel_pembimbing_penguji",
    "dosen-wali": "excel_dosen_wali",
    asisten: "excel_asisten",
  };

  const destDir = path.join(__dirname, "../../public/uploads/excel", folderMap[jenis]);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  const kodeProdi = req.user?.kodeProdi ? req.user.kodeProdi.replace("PRODI_", "") : "UNKNOWN";

  let fileName: string;
  if (jenis === "dosen-wali") {
    fileName = "excel-dosen-wali.xlsx";
  } else if (jenis === "asisten") {
    fileName = "excel-asisten.xlsx";
  } else {
    fileName = `${kodeProdi}-excel-${jenis}.xlsx`;
  }

  const destPath = path.join(destDir, fileName);
  fs.renameSync(req.file.path, destPath);

  res.status(200).json({
    message: `File berhasil diunggah ke ${folderMap[jenis]}`,
    filename: fileName,
  });
};