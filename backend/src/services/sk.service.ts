import { PrismaClient, type JenisSK } from "@prisma/client"
import { generateSKPreviewService } from "./sk.template.service"
import fs from "fs"
import path from "path"
import { parseSKMetadata } from "../utils/parseSKMetadata"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import os from "os"
import { convertDocxToPdf } from "../utils/convertToPdf"

const prisma = new PrismaClient()

export const uploadSKService = async (filename: string) => {
  const filePath = path.join(__dirname, "../../public/uploads/sk", filename)
  console.log("Reading file SK from: ", filePath)

  try {
    const metadata = await parseSKMetadata(filePath)

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
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Nomor SK sudah ada. File dengan nomor SK ini sudah pernah diunggah.")
    }
    console.error("Error simpan file SK:", error)
    throw new Error(error.message || "Gagal menyimpan metadata file SK")
  }
}

export const createDraftSKService = async (data: {
  no_sk: string
  judul: string
  jenis_sk: JenisSK
  semester: number
  tahun_akademik: number
  tanggal: string
  NIP_dekan: string
  nama_dekan: string
  ttd_dekan: string
}) => {
  const existingDekan = await prisma.dekan.findUnique({
    where: { NIP: data.NIP_dekan },
  })

  if (!existingDekan) {
    await prisma.dekan.create({
      data: {
        NIP: data.NIP_dekan,
        nama: data.nama_dekan,
        ttd_url: data.ttd_dekan,
      },
    })
  } else {
    await prisma.dekan.update({
      where: { NIP: data.NIP_dekan },
      data: {
        nama: data.nama_dekan,
        ttd_url: data.ttd_dekan,
      },
    })
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
  })
}

// New service to generate and save draft SK PDF
export const generateAndSaveDraftSKService = async (no_sk: string): Promise<void> => {
  const skData = await prisma.sK.findUnique({
    where: { no_sk },
    include: { Dekan: true },
  })

  if (!skData || !skData.Dekan) {
    throw new Error("SK data or Dekan data not found")
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
  })

  const tmpDir = os.tmpdir()
  const tempDocxPath = path.join(tmpDir, `preview-${Date.now()}.docx`)
  const tempPdfPath = tempDocxPath.replace(".docx", ".pdf")

  fs.writeFileSync(tempDocxPath, docBuffer)
  const pdfPath = await convertDocxToPdf(tempDocxPath, tmpDir)

  const pdfBuffer = fs.readFileSync(pdfPath)

  const outputDir = path.join(__dirname, "../../public/uploads/sk")
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  const filePath = path.join(outputDir, `${no_sk.replace(/ /g, "_").replace(/\//g, "_")}.pdf`)
  fs.writeFileSync(filePath, pdfBuffer)

  // Update SK with file path but keep status as DRAFT
  await prisma.sK.update({
    where: { no_sk },
    data: {
      file_sk: `uploads/sk/${no_sk.replace(/ /g, "_").replace(/\//g, "_")}.pdf`,
    },
  })

  // Clean up temp files
  fs.unlinkSync(tempDocxPath)
  fs.unlinkSync(tempPdfPath)
}

export const getDraftSKsService = async () => {
  return await prisma.sK.findMany({
    where: {
      status: "DRAFT",
    },
    include: {
      Dekan: true,
    },
  })
}

export const publishSKService = async (no_sk: string): Promise<void> => {
  const existing = await prisma.sK.findUnique({ where: { no_sk } })
  if (!existing) throw new Error("SK tidak ditemukan")

  // If file doesn't exist, generate it first
  if (!existing.file_sk) {
    await generateAndSaveDraftSKService(no_sk)
  }

  // Update status to PUBLISHED
  await prisma.sK.update({
    where: { no_sk },
    data: {
      status: "PUBLISHED",
    },
  })
}

export const getPublishedSKsService = async () => {
  return await prisma.sK.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      Dekan: true,
    },
  })
}

export const getSKDetailService = async (no_sk: string) => {
  return await prisma.sK.findUnique({
    where: { no_sk },
    include: { Dekan: true },
  })
}

export const getDownloadPathService = async (no_sk: string): Promise<string> => {
  const sk = await prisma.sK.findUnique({ where: { no_sk } })

  if (!sk) {
    throw new Error("SK tidak ditemukan")
  }

  // If no file exists, generate it first
  if (!sk.file_sk) {
    await generateAndSaveDraftSKService(no_sk)
    // Fetch updated SK data
    const updatedSK = await prisma.sK.findUnique({ where: { no_sk } })
    if (!updatedSK?.file_sk) {
      throw new Error("Gagal generate file SK")
    }
    sk.file_sk = updatedSK.file_sk
  }

  const filePath = path.join(__dirname, "../../public", sk.file_sk)
  if (!fs.existsSync(filePath)) {
    throw new Error("File SK tidak ditemukan")
  }

  return filePath
}

export const deleteDraftSKService = async (no_sk: string) => {
  console.log("Deleting SK with no_sk:", no_sk)
  const sk = await prisma.sK.findUnique({ where: { no_sk } })
  if (!sk) throw new Error("SK tidak ditemukan")

  if (sk.status !== "DRAFT") {
    throw new Error("Hanya SK dengan status DRAFT yang bisa dihapus")
  }

  // Delete file if exists
  if (sk.file_sk) {
    const filePath = path.join(__dirname, "../../public", sk.file_sk)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }

  await prisma.sK.delete({ where: { no_sk } })
}

export const getDraftSKDetailService = async (no_sk: string) => {
  return await prisma.sK.findUnique({
    where: { no_sk },
    include: { Dekan: true },
  })
}

export const updateDraftSKService = async (no_sk: string, data: any) => {
  const existingDekan = await prisma.dekan.findUnique({
    where: { NIP: data.NIP_dekan },
  })

  if (!existingDekan) {
    await prisma.dekan.create({
      data: {
        NIP: data.NIP_dekan,
        nama: data.nama_dekan,
        ttd_url: data.ttd_dekan,
      },
    })
  } else {
    await prisma.dekan.update({
      where: { NIP: data.NIP_dekan },
      data: {
        nama: data.nama_dekan,
        ttd_url: data.ttd_dekan,
      },
    })
  }

  const updatedSK = await prisma.sK.update({
    where: { no_sk },
    data: {
      judul: data.judul,
      jenis_sk: data.jenis_sk,
      semester: data.semester,
      tahun_akademik: data.tahun_akademik,
      tanggal: new Date(data.tanggal),
      NIP_dekan: data.NIP_dekan,
    },
  })

  // If SK has a file, regenerate it with new data
  if (updatedSK.file_sk) {
    await generateAndSaveDraftSKService(no_sk)
  }

  return updatedSK
}

// Rest of the existing functions remain the same...
const PRODI_CODES = ["132", "135", "180", "181", "182", "183", "232", "235", "332", "932", "935"]

function checkExcelByProdi(dirPath: string): { complete: boolean; missingProdi: string[]; foundProdi: string[] } {
  if (!fs.existsSync(dirPath)) {
    return { complete: false, missingProdi: PRODI_CODES, foundProdi: [] }
  }

  const files = fs.readdirSync(dirPath)
  const foundCodes = new Set<string>()

  files.forEach((f) => {
    const match = f.match(/^(\d{3})[-_].+\.xlsx$/)
    if (match) foundCodes.add(match[1])
  })

  const foundProdi = Array.from(foundCodes)
  const missingProdi = PRODI_CODES.filter((code) => !foundCodes.has(code))
  const complete = PRODI_CODES.every((code) => foundCodes.has(code))

  return { complete, missingProdi, foundProdi }
}

function checkSingleExcel(dirPath: string): boolean {
  if (!fs.existsSync(dirPath)) return false
  const files = fs.readdirSync(dirPath)
  return files.some((f) => f.endsWith(".xlsx"))
}

export const checkPengajaranExcel = () =>
  checkExcelByProdi(path.join(__dirname, "../../public/uploads/excel/excel_pengajaran"))

export const checkPembimbingPengujiExcel = () =>
  checkExcelByProdi(path.join(__dirname, "../../public/uploads/excel/excel_pembimbing_penguji"))

export const checkPembimbingAktifExcel = () =>
  checkSingleExcel(path.join(__dirname, "../../public/uploads/excel/excel_pembimbing_aktif"))

export const checkWaliTPBExcel = () =>
  checkSingleExcel(path.join(__dirname, "../../public/uploads/excel/excel_dosen_wali"))

export const checkWaliAktifExcel = () =>
  checkSingleExcel(path.join(__dirname, "../../public/uploads/excel/excel_dosen_wali"))

export const checkAsistenExcel = () =>
  checkSingleExcel(path.join(__dirname, "../../public/uploads/excel/excel_asisten"))

export const archiveSKService = async (no_sk: string): Promise<void> => {
  await prisma.sK.update({
    where: { no_sk },
    data: { archived: true },
  })
}

export const unarchiveSKService = async (no_sk: string): Promise<void> => {
  await prisma.sK.update({
    where: { no_sk },
    data: { archived: false },
  })
}

export const getArchivedSKsService = async () => {
  return await prisma.sK.findMany({
    where: { archived: true },
    include: { Dekan: true },
  })
}

export const getTemplatePathService = async (jenis_sk: string): Promise<string> => {
  const filePath = path.join(__dirname, "../templates", `sk_${jenis_sk}.docx`)
  if (!fs.existsSync(filePath)) {
    throw new Error("Template SK tidak ditemukan")
  }

  return filePath
}
