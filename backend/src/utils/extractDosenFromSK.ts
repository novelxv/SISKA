import type { KelompokKeahlian, JenisKepegawaian, StatusKepegawaian, JabatanFungsional } from "@prisma/client"
import { extractDosenFromSKPengajaran } from "./extractDosen/extractDosenFromSKPengajaran"
import { extractDosenFromSKPembimbingPenguji } from "./extractDosen/extractDosenFromSKPembimbingPenguji"
import { extractDosenFromSKDosenPembimbing } from "./extractDosen/extractDosenFromSKDosenPembimbing"
import { extractDosenFromSKWaliAkademik } from "./extractDosen/extractDosenFromSKWaliAkademik"
import { extractDosenFromSKAsistenPraktikum } from "./extractDosen/extractDosenFromSKAsistenPraktikum"

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

  // Determine SK type and call appropriate extraction function
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
  }

  // Default case if no specific type is identified
  console.log("Could not identify SK type for dosen extraction")
  return []
}









// // Helper function to map KK name to KelompokKeahlian enum
// function mapToKelompokKeahlian(kkName: string | null): KelompokKeahlian | null {
//   if (!kkName) return null

//   const kkNameLower = kkName.toLowerCase()

//   if (kkNameLower.includes("informatika")) return "INFORMATIKA"
//   if (kkNameLower.includes("elektronika")) return "ELEKTRONIKA"
//   if (kkNameLower.includes("rekayasa perangkat lunak") || kkNameLower.includes("pengetahuan"))
//     return "REKAYASA_PERANGKAT_LUNAK_DAN_PENGETAHUAN"
//   if (kkNameLower.includes("sistem kendali") || kkNameLower.includes("komputer")) return "SISTEM_KENDALI_DAN_KOMPUTER"
//   if (kkNameLower.includes("telekomunikasi")) return "TEKNIK_TELEKOMUNIKASI"
//   if (kkNameLower.includes("ketenagalistrikan")) return "TEKNIK_KETENAGALISTRIKAN"
//   if (kkNameLower.includes("teknik komputer")) return "TEKNIK_KOMPUTER"
//   if (kkNameLower.includes("teknologi informasi")) return "TEKNOLOGI_INFORMASI"

//   return null
// }

// // Helper function to remove academic titles from name
// function removeGelar(namaGelar: string): string {
//   // Remove common titles like Dr., Ir., Prof., S.T., M.T., Ph.D., etc.
//   return namaGelar
//     .replace(/(?:Prof\.|Dr\.?|Ir\.|S\.T\.|M\.T\.|M\.Sc\.|M\.Eng\.|Ph\.D\.|DEA|IPM|IPP|ASEAN Eng\.|,)+/gi, "")
//     .replace(/\s+/g, " ")
//     .trim()
// }
