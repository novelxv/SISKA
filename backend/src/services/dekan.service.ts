import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateTTDDekanService = async (nip: string, filePath: string) => {
    const existing = await prisma.dekan.findUnique({ where: { NIP: nip } });

    if (existing) {
        return await prisma.dekan.update({
            where: { NIP: nip },
            data: { ttd_url: filePath },
        });
    } else {
        return await prisma.dekan.create({
            data: {
                NIP: nip,
                nama: "",
                ttd_url: filePath,
            },
        });
    }
};

export const getTTDDekanPathService = async (nip: string) => {
    const dekan = await prisma.dekan.findUnique({ where: { NIP: nip } });
    return dekan?.ttd_url;
};