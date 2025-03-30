import { PrismaClient, JenisSK } from "@prisma/client";

const prisma = new PrismaClient();

export const createDraftSKService = async (data: {
    no_sk: string;
    judul: string;
    jenis_sk: JenisSK;
    semester: number;
    tanggal: string;
    NIP_dekan: string;
}) => {
    return await prisma.sK.create({
        data: {
            no_sk: data.no_sk,
            judul: data.judul,
            jenis_sk: data.jenis_sk,
            semester: data.semester,
            tanggal: new Date(data.tanggal),
            NIP_dekan: data.NIP_dekan,
            status: "DRAFT",
        },
    });
};

export const getDraftSKsService = async () => {
    return await prisma.sK.findMany({
        where: {
            status: "DRAFT",
        },
        include: {
            Dekan: true,
        },
    });
};

export const publishSKService = async (no_sk: string): Promise<void> => {
    const existing = await prisma.sK.findUnique({ where: { no_sk } });
    if (!existing) throw new Error("SK tidak ditemukan");
    
    await prisma.sK.update({
        where: { no_sk },
        data: {
            status: "PUBLISHED"
        },
    });
};

export const getPublishedSKsService = async () => {
    return await prisma.sK.findMany({
        where: {
            status: "PUBLISHED",
        },
        include: {
            Dekan: true,
        },
    });
};