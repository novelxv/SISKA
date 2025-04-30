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
    // Asumsi tidak dosen di SK Asisten
    return dosens
  }