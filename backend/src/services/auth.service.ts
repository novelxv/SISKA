import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const registerUser = async (username: string, password: string, role: "AKADEMIK" | "ADMIN_KK" | "ADMIN_PRODI") => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return await prisma.user.create({
        data: { username, password: hashedPassword, role },
    });
};

export const loginUser = async (username: string, password: string): Promise<string | null> => {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
};