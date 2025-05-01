import type { JenisSK } from "@prisma/client"
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

export const parseSKDosenPembimbingMetadata = async (filePath: string): Promise<ParsedSKMetadata> => {
  const fs = (await import("fs")).default
  const pdfParse = (await import("pdf-parse")).default

  const dataBuffer = fs.readFileSync(filePath)
  const pdfData = await pdfParse(dataBuffer)
  const text = pdfData.text

  // Extract SK number
  const noSkMatch = text.match(/NOMOR\s*:\s*([^\n]+)/i)
  const no_sk = noSkMatch ? noSkMatch[1].trim() : ""

  // Extract title
  const judul = text.match(/TENTANG\s+([^\n]+)/i)?.[1].trim() || ""

  // Extract date
  const tanggalStr = text.match(/Ditetapkan di Bandung\s+.*tanggal\s+([\d]+\s+\w+\s+\d{4})/i)?.[1]
  const tanggal = parseTanggalIndoToDate(tanggalStr || "") || new Date()
  if (!tanggal || isNaN(tanggal.getTime())) {
    throw new Error("Tanggal tidak valid")
  }

  // Extract semester
  const semesterMatch = text.match(/SEMESTER\s+([IV]+)\s+TAHUN\s+AKADEMIK\s+(\d{4})\/(\d{4})/i)
  let semester = 1
  if (semesterMatch) {
    const romawi = semesterMatch[1].trim()
    semester = romawi === "I" ? 1 : 2
  }

  const tahunAkademikMatch = text.match(/TAHUN AKADEMIK\s+(\d{4})\/\d{4}/i)
  const tahun_akademik = tahunAkademikMatch ? parseInt(tahunAkademikMatch[1], 10) : 0

  // Extract dean's information
  const namaDekan = text.match(/DEKAN[,\s]*([\w\s.,'-]+)\s+NIP/i)?.[1].trim() || ""
  const rawNIPMatch = text.match(/NIP[.\s]*((?:\d{8}\s*\d{6}\s*\d\s*\d{3}))/i)
  const rawNIP = rawNIPMatch?.[1]?.replace(/\s+/g, "") || ""
  const nip = rawNIP.length === 18 ? rawNIP : ""

  return {
    no_sk,
    judul,
    tanggal,
    semester,
    tahun_akademik,
    jenis_sk: "PEMBIMBING_AKTIF",
    NIP_dekan: nip,
    nama_dekan: namaDekan,
  }
}
