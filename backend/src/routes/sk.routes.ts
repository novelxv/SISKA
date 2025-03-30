import express from "express";
import { createDraftSK, getDraftSKs, publishSK, getPublishedSKs, generatePreviewSK, downloadPublishedSK, getSKDetail } from "../controllers/sk.controller";
import { authMiddleware, akademikMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, akademikMiddleware, createDraftSK);
router.get("/draft", authMiddleware, akademikMiddleware, getDraftSKs);
router.put("/:no_sk/publish", authMiddleware, akademikMiddleware, publishSK);
router.get("/published", authMiddleware, getPublishedSKs);
router.get("/:no_sk/preview", authMiddleware, akademikMiddleware, generatePreviewSK);
router.get("/:no_sk/download", authMiddleware, downloadPublishedSK);
router.get("/:no_sk/detail", authMiddleware, getSKDetail);

export default router;