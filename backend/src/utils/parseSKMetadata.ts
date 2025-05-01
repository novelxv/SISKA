import type { JenisSK } from "@prisma/client"
import { parseSKAsistenPraktikumMetadata } from "./parseSKAsistenPraktikumMetadata"
import { parseSKDosenWaliAktifMetadata } from "./parseSKDosenWaliAktifMetadata"
import { parseSKWaliAktifMetadata } from "./parseSKWaliAktifMetadata"
import { parseSKPengajaranMetadata } from "./parseSKPengajaranMetadata"
import { parseSKPembimbingPengujiMetadata } from "./parseSKPembimbingPengujiMetadata"
import { parseSKDosenPembimbingMetadata } from "./parseSKDosenPembimbingMetadata"
import { parseSKLuarProdi } from "./parseSKLuarProdi"
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

export const parseSKMetadata = async (filePath: string): Promise<ParsedSKMetadata> => {
  const fs = (await import("fs")).default
  const pdfParse = (await import("pdf-parse")).default

  const dataBuffer = fs.readFileSync(filePath)
  const pdfData = await pdfParse(dataBuffer)
  const text = pdfData.text

  if (/Asisten Kuliah dan Praktikum/i.test(text)) {
    console.log("Identified as ASISTEN_PRAKTIKUM")
    return await parseSKAsistenPraktikumMetadata(filePath)
  }

  if (/PENUGASAN PENGAJARAN PROGRAM STUDI/i.test(text)) {
    console.log("Identified as PENGAJARAN")
    return await parseSKPengajaranMetadata(filePath)
  }

  if (/DOSEN WALI AKADEMIK MAHASISWA/i.test(text)) {
    console.log("Identified as WALI_MHS_AKTIF")
    return await parseSKDosenWaliAktifMetadata(filePath)
  }
  
  if (/PROMOTOR DAN PENGUJI/i.test(text)) {
    console.log("Identified as PEMBIMBING_PENGUJI")
    return await parseSKPembimbingPengujiMetadata(filePath)
  }

  if (/DOSEN PEMBIMBING/i.test(text)) {
    console.log("Identified as PEMBIMBING_AKTIF")
    return await parseSKDosenPembimbingMetadata(filePath)
  }
  
  if (/BOARD OF REVIEWER/i.test(text) && /Lampiran Keputusan/i.test(text)) {
    console.log("Identified as LUAR_PRODI")
    return await parseSKLuarProdi(filePath)
  }

  console.log("Could not identify SK type, defaulting to WALI_MHS_AKTIF")
  throw new Error("File upload bukan SK");
}
