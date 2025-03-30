import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const getAllUsersService = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            password: true,
            role: true,
        },
    });
};

export const deleteUserService = async (id: number) => {
    return await prisma.user.delete({ where: { id } });
};

export const updateUserService = async (id: number, data: {
    username: string;
    password: string;
    role: "AKADEMIK" | "ADMIN_KK" | "ADMIN_PRODI";
}) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    return await prisma.user.update({
        where: { id },
        data,
    });
};

export const getUserByIdService = async (id: number) => {
    return await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            password: true,
            role: true,
        },
    });
};