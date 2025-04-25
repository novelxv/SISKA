import type { KelompokKeahlian, JenisKepegawaian, StatusKepegawaian, JabatanFungsional } from "@prisma/client"
import { removeGelar } from "./extractDosenUtils"

// Extract dosen from SK Pengajaran
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

// Extract dosen from SK Dosen Pembimbing
export const extractDosenFromSKDosenPembimbing = (text: string): ExtractedDosen[] => {
  const dosens: ExtractedDosen[] = []

  // Find the section with the list of supervisors
  const pembimbingSection = text.match(/DOSEN PEMBIMBING(?:\s|\n)+([\s\S]+?)(?=DEKAN|$)/i)

  if (pembimbingSection && pembimbingSection[1]) {
    const entries = pembimbingSection[1].split(/\d+\s+(?=[A-Z][a-z]+\.?\s+[A-Z])/g)

    for (const entry of entries) {
      // Extract NIP
      const nipMatch = entry.match(/(\d{8}\s+\d{6}\s+\d+\s+\d+)/i)
      const nip = nipMatch ? nipMatch[1].replace(/\s+/g, "") : null

      // Extract name with titles
      const nameMatch = entry.match(/([A-Z][a-z]+\.?\s+[^0-9]+?)(?=\d{8}|\s+\d+\s+\d+|$)/i)
      const namaGelar = nameMatch ? nameMatch[1].trim() : ""

      // Extract name without titles
      const namaTanpaGelar = removeGelar(namaGelar)

      // Extract institution for external lecturers
      const instansiMatch = entry.match(/(?:Instansi\s+Asal)\s*(?:\n|\r|\s)+([A-Za-z\s]+)/i)
      const instansiAsal = instansiMatch ? instansiMatch[1].trim() : null

      // Add dosen to the list if we have at least a name
      if (namaGelar) {
        dosens.push({
          nama_tanpa_gelar: namaTanpaGelar,
          nama_plus_gelar: namaGelar,
          NIP: nip,
          jenis_kepegawaian: instansiAsal ? "DOSEN_LUAR_ITB" : "DOSEN_TETAP",
          status_kepegawaian: "AKTIF", // Assuming active status for all lecturers in the SK
          instansi_asal: instansiAsal,
        })
      }
    }
  }

  return dosens
}