import type { KelompokKeahlian, JenisKepegawaian, StatusKepegawaian, JabatanFungsional } from "@prisma/client"
import { extractDosenFromSKPengajaran } from "./extractDosen/extractDosenFromSKPengajaran"
import { extractDosenFromSKPembimbingPenguji } from "./extractDosen/extractDosenFromSKPembimbingPenguji"
import { extractDosenFromSKDosenPembimbing } from "./extractDosen/extractDosenFromSKDosenPembimbing"
import { extractDosenFromSKWaliAkademik } from "./extractDosen/extractDosenFromSKWaliAkademik"
import { extractDosenFromSKAsistenPraktikum } from "./extractDosen/extractDosenFromSKAsistenPraktikum"
import { extractDosenFromSKLuarProdi } from "./extractDosen/extractDosenFromLuarProdi"

export interface ExtractedDosen {
  nama_tanpa_gelar: string
  nama_plus_gelar: string
  NIDN?: string | null
  NIP?: string | null
  KK?: KelompokKeahlian | null
  jenis_kepegawaian?: JenisKepegawaian | null
  pangkat?: string | null
  jabatan_fungsional?: JabatanFungsional | null
  status_kepegawaian: StatusKepegawaian
  instansi_asal?: string | null
}

export const extractDosenFromSK = async (filePath: string): Promise<ExtractedDosen[]> => {
  const fs = (await import("fs")).default
  const pdfParse = (await import("pdf-parse")).default

  const dataBuffer = fs.readFileSync(filePath)
  const pdfData = await pdfParse(dataBuffer)
  const text = pdfData.text

  if (/PENUGASAN PENGAJARAN PROGRAM STUDI/i.test(text)) {
    return extractDosenFromSKPengajaran(text)
  } else if (/PROMOTOR DAN PENGUJI/i.test(text)) {
    return extractDosenFromSKPembimbingPenguji(text)
  } else if (/DOSEN PEMBIMBING/i.test(text)) {
    return extractDosenFromSKDosenPembimbing(text)
  } else if (/DOSEN WALI AKADEMIK MAHASISWA/i.test(text) || /DOSEN WALI AKADEMIK/i.test(text)) {
    return extractDosenFromSKWaliAkademik(text)
  } else if (/Asisten Kuliah dan Praktikum/i.test(text)) {
    return extractDosenFromSKAsistenPraktikum(text)
  } else if (/BOARD OF REVIEWER/i.test(text) && /Lampiran Keputusan/i.test(text)) {
    return extractDosenFromSKLuarProdi(text)
  }

  console.log("Could not identify SK type for dosen extraction")
  return []
}