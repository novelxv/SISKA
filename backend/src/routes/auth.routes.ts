import express from "express";
import { register, login } from "../controllers/auth.controller";
import { authMiddleware, akademikMiddleware } from "../middleware/auth.middleware";
import { body } from "express-validator";

const router = express.Router();

router.post(
    "/register",
    authMiddleware,
    akademikMiddleware,
    [
        body("username").notEmpty().isString(),
        body("password").isLength({ min: 6 }),
        body("role").isIn(["AKADEMIK", "ADMIN_KK"]),
    ],
    register
);

router.post("/login", login);

export default router;