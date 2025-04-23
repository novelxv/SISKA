import express from "express";
import { createDraftSK, getDraftSKs, publishSK, getPublishedSKs, generatePreviewSK, downloadPublishedSK, getSKDetail, uploadSKFile, deleteDraftSK } from "../controllers/sk.controller";
import { authMiddleware, akademikMiddleware } from "../middleware/auth.middleware";

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

export default router;