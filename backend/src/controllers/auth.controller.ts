import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { validationResult } from "express-validator";

export const register = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    
    const { username, password, role } = req.body;
    if (!["AKADEMIK", "ADMIN_KK", "ADMIN_PRODI"].includes(role)) {
        res.status(400).json({ error: "Invalid role" });
        return;
    }
    
    try {
        const user = await registerUser(username, password, role);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
        res.status(500).json({ error: "Error registering user" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    
    try {
        const token = await loginUser(username, password);
        if (!token) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: "Login error" });
    }
};