import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createDosenService = async (data: any) => {
    return await prisma.dosen.create({
        data: {
            nama_tanpa_gelar: data.namaTanpaGelar,
            nama_plus_gelar: data.namaDenganGelar,
            NIDN: data.nidn ? data.nidn : undefined,
            NIP: data.nomorPegawai ? data.nomorPegawai : undefined,
            KK: data.kelompokKeahlian ? data.kelompokKeahlian : undefined,
            jenis_kepegawaian: data.jenisKepegawaian ? data.jenisKepegawaian : undefined,
            pangkat: data.pangkat ? data.pangkat : undefined,
            jabatan_fungsional: data.jabatanFungsional ? data.jabatanFungsional : undefined,
            status_kepegawaian: data.statusKepegawaian,
            aktif_mulai: data.aktif_mulai ? new Date(data.aktif_mulai) : undefined,
            aktif_sampai: data.aktif_sampai ? new Date(data.aktif_sampai) : undefined,
            instansi_asal: data.instansi_asal ? data.instansi_asal : undefined,
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
            NIDN: data.NIDN ? data.NIDN : undefined,
            NIP: data.NIP ? data.NIP : undefined,
            KK: data.KK ? data.KK : undefined,
            jenis_kepegawaian: data.jenis_kepegawaian ? data.jenis_kepegawaian : undefined,
            pangkat: data.pangkat ? data.pangkat : undefined,
            jabatan_fungsional: data.jabatan_fungsional ? data.jabatan_fungsional : undefined,
            status_kepegawaian: data.status_kepegawaian ? data.status_kepegawaian : undefined,
            aktif_mulai: data.aktif_mulai ? new Date(data.aktif_mulai) : undefined,
            aktif_sampai: data.aktif_sampai ? new Date(data.aktif_sampai) : undefined,
            instansi_asal: data.instansi_asal ? data.instansi_asal : undefined,
        },
    });
};

export const deleteDosenService = async (id: number) => {
    return await prisma.dosen.delete({
        where: { id_dosen: id },
    });
};

export const getDosenPengajaran = async (namaDosen: String) => {
    try {
        const dosen = await prisma.dosen.findFirst({
            where: {
                nama_plus_gelar: namaDosen.trim()
            },
            select: {
                nama_plus_gelar: true,
                NIP: true,
                KK: true,
                jenis_kepegawaian: true,
            }
        });

        if (dosen) {
            return {
                nama_dosen: dosen.nama_plus_gelar,
                nip_dosen: dosen.NIP,
                kk: dosen.KK,
                jenis_kepegawaian: dosen.jenis_kepegawaian,
            };
        } else {
            console.log(`Dosen dengan nama ${namaDosen} tidak ditemukan`);
        }
    } catch (error) {
        console.error('Error saat mengambil data dosen:', error);
    }
}