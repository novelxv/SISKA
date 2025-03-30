import { PrismaClient } from "@prisma/client";

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