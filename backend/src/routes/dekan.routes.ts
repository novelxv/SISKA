import express from "express";
import { uploadTTD } from "../utils/multer";
import { uploadDekanTTD, getDekanTTD } from "../controllers/dekan.controller";

const router = express.Router();

router.post("/:nip/ttd", uploadTTD.single("ttd"), uploadDekanTTD);
router.get("/:nip/ttd", getDekanTTD);

export default router;