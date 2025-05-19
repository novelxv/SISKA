import express from "express";
import multer from "multer";
import path from "path";
import { uploadFile, getUploadStatus, resetStatus, uploadExcel } from "../controllers/excel.controller";
import { authMiddleware, akademikMiddleware, AdminProdiMiddleware } from "../middleware/auth.middleware";

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only Excel files
        if (
            file.mimetype === "application/vnd.ms-excel" ||
            file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only Excel files are allowed"));
        }
    },
});

const router = express.Router();

// Route untuk akademik mengupload file
router.post(
    "/upload",
    authMiddleware,
    akademikMiddleware,
    upload.single("file"),
    uploadFile
);

// Route untuk admin prodi mengupload file
router.post(
    "/upload/prodi",
    authMiddleware,
    AdminProdiMiddleware,
    upload.single("file"),
    uploadFile
);

// Route status upload
router.get(
    "/status",
    authMiddleware,
    getUploadStatus
);

// Route untuk reset status upload
router.post(
    "/reset-status/:templateType?",
    authMiddleware,
    resetStatus
);

// Route untuk mendapatkan template yang tersedia
router.get("/templates", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        templates: [
            { id: "pengajaran", name: "Template Pengajaran" },
            { id: "pembimbing-penguji", name: "Template Pembimbing & Penguji" },
            { id: "dosen-wali", name: "Template Dosen Wali" },
            { id: "asisten-perkuliahan", name: "Template Asisten Perkuliahan" },
            { id: "pembimbing-aktif", name: "Template Pembimbing Aktif" }
        ]
    });
});

const upload2 = multer({
    dest: path.join(__dirname, "../../tmp"),
    limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== ".xlsx" && ext !== ".xls") {
            return cb(new Error("Hanya file Excel yang diperbolehkan"));
        }
        cb(null, true);
    },
});

router.post("/upload/:jenis", authMiddleware, upload2.single("file"), uploadExcel);

export default router;