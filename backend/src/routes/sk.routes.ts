import express from "express";
import { createDraftSK, getDraftSKs, publishSK, getPublishedSKs, generatePreviewSK, downloadPublishedSK, getSKDetail, uploadSKFile, deleteDraftSK, getDraftSKDetail, updateDraftSK, getDosenFromSK, getArchivedSKs, previewPublishedSK } from "../controllers/sk.controller";
import { authMiddleware, akademikMiddleware } from "../middleware/auth.middleware";
import {
    validatePengajaranExcel,
    validatePembimbingPengujiExcel,
    validatePembimbingAktifExcel,
    validateWaliTPBExcel,
    validateWaliAktifExcel,
    validateAsistenExcel,
    archiveSK,
    unarchiveSK,
} from "../controllers/sk.controller";

const router = express.Router();

router.post("/", authMiddleware, akademikMiddleware, createDraftSK);
router.get("/draft", authMiddleware, akademikMiddleware, getDraftSKs);
router.put("/:no_sk/publish", authMiddleware, akademikMiddleware, publishSK);
router.get("/published", authMiddleware, getPublishedSKs);
router.post("/preview", authMiddleware, akademikMiddleware, generatePreviewSK);
router.get("/:no_sk/download", authMiddleware, downloadPublishedSK);
router.get("/:no_sk/detail", authMiddleware, getSKDetail);
router.post("/upload/sk", authMiddleware, akademikMiddleware, uploadSKFile);
router.delete("/draft/:no_sk", authMiddleware, akademikMiddleware, deleteDraftSK);
router.get("/draft/:no_sk/detail", authMiddleware, akademikMiddleware, getDraftSKDetail);
router.put("/draft/:no_sk", authMiddleware, akademikMiddleware, updateDraftSK);
router.get("/:no_sk/dosen", authMiddleware, getDosenFromSK);
router.get("/validate/pengajaran", authMiddleware, akademikMiddleware, validatePengajaranExcel);
router.get("/validate/pembimbing-penguji", authMiddleware, akademikMiddleware, validatePembimbingPengujiExcel);
router.get("/validate/pembimbing-aktif", authMiddleware, akademikMiddleware, validatePembimbingAktifExcel);
router.get("/validate/wali-tpb", authMiddleware, akademikMiddleware, validateWaliTPBExcel);
router.get("/validate/wali-aktif", authMiddleware, akademikMiddleware, validateWaliAktifExcel);
router.get("/validate/asisten", authMiddleware, akademikMiddleware, validateAsistenExcel);
router.put("/:no_sk/archive", authMiddleware, akademikMiddleware, archiveSK);
router.put("/:no_sk/unarchive", authMiddleware, akademikMiddleware, unarchiveSK);
router.get("/archived", authMiddleware, akademikMiddleware, getArchivedSKs);
router.get("/:no_sk/preview", authMiddleware, previewPublishedSK);

export default router;