import fs from "fs"
import type { JenisSK } from "@prisma/client"
import pdfParse from "pdf-parse"
import { parseTanggalIndoToDate } from "./parseTanggalIndoToDate"

interface ParsedSKMetadata {
  no_sk: string
  judul: string
  tanggal: Date
  semester: number
  tahun_akademik: number
  jenis_sk: JenisSK
  NIP_dekan: string
  nama_dekan: string
  ttd_dekan?: string
}

export const parseSKDosenWaliAktifMetadata = async (filePath: string): Promise<ParsedSKMetadata> => {
  const dataBuffer = fs.readFileSync(filePath)
  const pdfData = await pdfParse(dataBuffer)
  const text = pdfData.text

  const no_sk = text.match(/NOMOR\s*:\s*([^\n]+)/i)?.[1].trim() || ""
  const judul = text.match(/TENTANG\s+([^\n]+)/i)?.[1].trim() || ""
  const tanggalStr = text.match(/Ditetapkan di Bandung\s+.*tanggal\s+([\d]+\s+\w+\s+\d{4})/i)?.[1]
  const tanggal = parseTanggalIndoToDate(tanggalStr || "") || new Date()
  if (!tanggal || isNaN(tanggal.getTime())) {
    throw new Error("Tanggal tidak valid")
  }
  const tahunAkademikMatch = text.match(/TAHUN AKADEMIK\s+(\d{4})\/\d{4}/i)
  const tahun_akademik = tahunAkademikMatch ? parseInt(tahunAkademikMatch[1], 10) : 0

  const semester = /Semester\s+I/i.test(text) ? 1 : /Semester\s+II/i.test(text) ? 2 : 0
  const rawNIPMatch = text.match(/NIP[.\s]*((?:\d{8}\s*\d{6}\s*\d\s*\d{3}))/i)
  const rawNIP = rawNIPMatch?.[1]?.replace(/\s+/g, "") || ""
  const nip = rawNIP.length === 18 ? rawNIP : ""
  const namaDekan = text.match(/DEKAN[,\s]*([\w\s.,'-]+)\s+NIP/i)?.[1].trim() || ""
  return {
    no_sk,
    judul,
    tanggal,
    semester,
    tahun_akademik,
    jenis_sk: "WALI_MHS_AKTIF",
    NIP_dekan: nip,
    nama_dekan: namaDekan,
  }
}
