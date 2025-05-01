import { PrismaClient, JenisSK } from "@prisma/client";
import { generateSKPreviewService } from "./sk.template.service";
// import { parseSKWaliAktifMetadata } from "../utils/parseUploadedPdfToMetadata";
import fs from "fs";
import path from "path";
import { parseSKMetadata } from "../utils/parseSKMetadata";
import { extractDosenFromSK } from "../utils/extractDosenFromSK";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const uploadSKService = async (filename: string) => {
    const filePath = path.join(__dirname, "../../public/uploads/sk", filename)
    console.log("Reading file SK from: ", filePath)
    // console.log(JSON.stringify(dosens, null, 2))
    
    try {
      const metadata = await parseSKMetadata(filePath)
  
      // Validasi jika nomor SK tidak ditemukan
      if (!metadata.no_sk || metadata.no_sk.trim() === "") {
        throw new Error("File yang diunggah bukan SK yang valid (nomor SK tidak ditemukan)")
      }
  
      const { NIP_dekan, nama_dekan, ttd_dekan, ...skData } = metadata
  
      const existingDekan = await prisma.dekan.findUnique({
        where: { NIP: NIP_dekan },
      })
  
      if (!existingDekan) {
        await prisma.dekan.create({
          data: {
            NIP: NIP_dekan,
            nama: nama_dekan,
            ttd_url: ttd_dekan,
          },
        })
      } else {   
            await prisma.dekan.update({
            where: { NIP: NIP_dekan },
            data: {
                nama: nama_dekan,
                ttd_url: ttd_dekan,
            },
            })
      }
  
      return await prisma.sK.create({
        data: {
          ...skData,
          NIP_dekan,
          status: "PUBLISHED",
          file_sk: `uploads/sk/${filename}`,
        },
      })
    } catch (error: any) {
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === "P2002"
          ) {
            throw new Error("Nomor SK sudah ada. File dengan nomor SK ini sudah pernah diunggah.");
          }
      console.error("Error simpan file SK:", error)
      throw new Error(error.message || "Gagal menyimpan metadata file SK")
    }
  }
  


export const createDraftSKService = async (data: {
    no_sk: string;
    judul: string;
    jenis_sk: JenisSK;
    semester: number;
    tahun_akademik: number;
    tanggal: string;
    NIP_dekan: string;
    nama_dekan: string;
    ttd_dekan: string;
}) => {
    const existingDekan = await prisma.dekan.findUnique({
        where: { NIP: data.NIP_dekan },
    });

    if (!existingDekan) {
        await prisma.dekan.create({
            data: {
                NIP: data.NIP_dekan,
                nama: data.nama_dekan,
                ttd_url: data.ttd_dekan,
            },
        });
    } else {
            await prisma.dekan.update({
                where: { NIP: data.NIP_dekan },
                data: {
                    nama: data.nama_dekan,
                    ttd_url: data.ttd_dekan,
                },
            });
        }

    return await prisma.sK.create({
        data: {
            no_sk: data.no_sk,
            judul: data.judul,
            jenis_sk: data.jenis_sk,
            semester: data.semester,
            tahun_akademik: data.tahun_akademik,
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

    // Generate file
    const skData = await prisma.sK.findUnique({
        where: { no_sk },
        include: { Dekan: true },
    });

    if (!skData || !skData.Dekan) {
        throw new Error("SK data or Dekan data not found");
    }

    const docBuffer = await generateSKPreviewService({
        no_sk: skData.no_sk,
        judul: skData.judul,
        jenis_sk: skData.jenis_sk,
        semester: skData.semester,
        tahun_akademik: skData.tahun_akademik,
        tanggal: skData.tanggal.toISOString(),
        NIP_dekan: skData.NIP_dekan,
        nama_dekan: skData.Dekan.nama,
    });
    const outputDir = path.join(__dirname, "../../public/uploads/sk");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const filePath = path.join(outputDir, `${no_sk}.pdf`);
    fs.writeFileSync(filePath, docBuffer);

    await prisma.sK.update({
        where: { no_sk },
        data: {
            status: "PUBLISHED",
            file_sk: `uploads/sk/${no_sk}.pdf`,
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

export const getSKDetailService = async (no_sk: string) => {
    return await prisma.sK.findUnique({
        where: { no_sk },
        include: { Dekan: true },
    });
};

export const getDownloadPathService = async (no_sk: string): Promise<string> => {
    const sk = await prisma.sK.findUnique({ where: { no_sk } });

    if (!sk || sk.status !== "PUBLISHED" || !sk.file_sk) {
        throw new Error("SK tidak ditemukan atau belum terbit");
    }

    const filePath = path.join(__dirname, "../../public", sk.file_sk);
    if (!fs.existsSync(filePath)) {
        throw new Error("File SK tidak ditemukan");
    }

    return filePath;
};

export const deleteDraftSKService = async (no_sk: string) => {
    const sk = await prisma.sK.findUnique({ where: { no_sk } });
    if (!sk) throw new Error("SK tidak ditemukan");

    if (sk.status !== "DRAFT") {
        throw new Error("Hanya SK dengan status DRAFT yang bisa dihapus");
    }

    await prisma.sK.delete({ where: { no_sk } });
};

export const getDraftSKDetailService = async (no_sk: string) => {
    return await prisma.sK.findUnique({
        where: { no_sk },
        include: { Dekan: true },
    });
};

export const updateDraftSKService = async (no_sk: string, data: any) => {
    const existingDekan = await prisma.dekan.findUnique({
        where: { NIP: data.NIP_dekan },
    });

    if (!existingDekan) {
        await prisma.dekan.create({
            data: {
                NIP: data.NIP_dekan,
                nama: data.nama_dekan,
                ttd_url: data.ttd_dekan,
            },
        });
    } else {
            await prisma.dekan.update({
                where: { NIP: data.NIP_dekan },
                data: {
                    nama: data.nama_dekan,
                    ttd_url: data.ttd_dekan,
                },
            });
    }

    return await prisma.sK.update({
        where: { no_sk },
        data: {
            judul: data.judul,
            jenis_sk: data.jenis_sk,
            semester: data.semester,
            tahun_akademik: data.tahun_akademik,
            tanggal: new Date(data.tanggal),
            NIP_dekan: data.NIP_dekan,
        },
    });
};