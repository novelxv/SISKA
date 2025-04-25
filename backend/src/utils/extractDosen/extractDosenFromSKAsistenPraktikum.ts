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


// Extract dosen from SK Asisten Praktikum
export const extractDosenFromSKAsistenPraktikum = (text: string): ExtractedDosen[] => {
    const dosens: ExtractedDosen[] = []
  
    // Find the section with the list of lab assistants
    const asistenSection = text.match(/ASISTEN PRAKTIKUM(?:\s|\n)+([\s\S]+?)(?=DEKAN|$)/i)
  
    if (asistenSection && asistenSection[1]) {
      const entries = asistenSection[1].split(/\d+\s+(?=[A-Z][a-z]+\.?\s+[A-Z])/g)
  
      for (const entry of entries) {
        // Extract NIP/NIM
        const nipMatch = entry.match(/(\d{8}\s+\d{6}\s+\d+\s+\d+)/i)
        const nip = nipMatch ? nipMatch[1].replace(/\s+/g, "") : null
  
        // Extract name with titles
        const nameMatch = entry.match(/([A-Z][a-z]+\.?\s+[^0-9]+?)(?=\d{8}|\s+\d+\s+\d+|$)/i)
        const namaGelar = nameMatch ? nameMatch[1].trim() : ""
  
        // Extract name without titles
        const namaTanpaGelar = removeGelar(namaGelar)
  
        // Add dosen to the list if we have at least a name
        if (namaGelar) {
          dosens.push({
            nama_tanpa_gelar: namaTanpaGelar,
            nama_plus_gelar: namaGelar,
            NIP: nip,
            jenis_kepegawaian: "ASISTEN_AKADEMIK",
            status_kepegawaian: "AKTIF",
          })
        }
      }
    }
  
    return dosens
  }