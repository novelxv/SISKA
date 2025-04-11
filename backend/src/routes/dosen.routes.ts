import express from "express";
import {
    createDosen,
    getAllDosen,
    getDosenById,
    updateDosen,
    deleteDosen,
} from "../controllers/dosen.controller";
import { authMiddleware, akademikMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// CREATE dosen
router.post("/", authMiddleware, akademikMiddleware, createDosen);

// READ all dosen
router.get("/", authMiddleware, getAllDosen);

// READ dosen by ID
router.get("/:id", authMiddleware, getDosenById);

// UPDATE dosen
router.put("/:id", authMiddleware, akademikMiddleware, updateDosen);

// DELETE dosen
router.delete("/:id", authMiddleware, akademikMiddleware, deleteDosen);

export default router;
