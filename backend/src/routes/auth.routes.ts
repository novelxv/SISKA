import express from "express";
import { register, login } from "../controllers/auth.controller";
import { authMiddleware, akademikMiddleware } from "../middleware/auth.middleware";
import { body } from "express-validator";
import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
    user?: any;
}

const router = express.Router();

router.post(
    "/register",
    authMiddleware,
    akademikMiddleware,
    [
        body("username").notEmpty().isString(),
        body("password").isLength({ min: 6 }),
        body("role").isIn(["AKADEMIK", "ADMIN_KK", "ADMIN_PRODI"]),
    ],
    register
);

router.post("/login", login);

router.get("/me", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json(req.user);
});

export default router;