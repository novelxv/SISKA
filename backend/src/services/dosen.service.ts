import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createDosenService = async (data: any) => {
    return await prisma.dosen.create({
        data: {
            nama_tanpa_gelar: data.nama_tanpa_gelar,
            nama_plus_gelar: data.nama_plus_gelar,
            NIDN: data.NIDN,
            NIP: data.NIP,
            KK: data.KK,
            jenis_kepegawaian: data.jenis_kepegawaian,
            pangkat: data.pangkat,
            jabatan_fungsional: data.jabatan_fungsional,
            status_kepegawaian: data.status_kepegawaian,
            aktif_mulai: data.aktif_mulai ? new Date(data.aktif_mulai) : undefined,
            aktif_sampai: data.aktif_sampai ? new Date(data.aktif_sampai) : undefined,
            instansi_asal: data.instansi_asal,
        },
    });
};

export const getAllDosenService = async () => {
    return await prisma.dosen.findMany({
        include: {
            Pembimbing: true,
            Penguji: true,
            DosenMatkul: true,
        },
    });
};

export const getDosenByIdService = async (id: number) => {
    return await prisma.dosen.findUnique({
        where: { id_dosen: id },
        include: {
            Pembimbing: true,
            Penguji: true,
            DosenMatkul: true,
        },
    });
};

export const updateDosenService = async (id: number, data: any) => {
    return await prisma.dosen.update({
        where: { id_dosen: id },
        data: {
            nama_tanpa_gelar: data.nama_tanpa_gelar,
            nama_plus_gelar: data.nama_plus_gelar,
            NIDN: data.NIDN,
            NIP: data.NIP,
            KK: data.KK,
            jenis_kepegawaian: data.jenis_kepegawaian,
            pangkat: data.pangkat,
            jabatan_fungsional: data.jabatan_fungsional,
            status_kepegawaian: data.status_kepegawaian,
            aktif_mulai: data.aktif_mulai ? new Date(data.aktif_mulai) : undefined,
            aktif_sampai: data.aktif_sampai ? new Date(data.aktif_sampai) : undefined,
            instansi_asal: data.instansi_asal,
        },
    });
};

export const deleteDosenService = async (id: number) => {
    return await prisma.dosen.delete({
        where: { id_dosen: id },
    });
};
