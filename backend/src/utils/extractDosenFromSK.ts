import type { KelompokKeahlian, JenisKepegawaian, StatusKepegawaian, JabatanFungsional } from "@prisma/client"

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

// Extract dosen from SK Pengajaran
export const extractDosenFromSKPengajaran = (text: string): ExtractedDosen[] => {
  const dosens: ExtractedDosen[] = []

  // Find all program study sections
  const programStudySections = text.split(
    /(?=A\.\s+Program\s+Studi|B\.\s+Program\s+Studi|C\.\s+Program\s+Studi|D\.\s+Program\s+Studi|E\.\s+Program\s+Studi|F\.\s+Program\s+Studi)/i,
  )

  // Skip the first section if it's just the header
  const sections = programStudySections.length > 1 ? programStudySections.slice(1) : programStudySections

  for (const section of sections) {
    // Extract KK sections within each program study
    const kkSections = section.split(/(?=KK\s+[A-Za-z\s]+)/i)

    for (const kkSection of kkSections) {
      // Skip if not a valid KK section
      if (!kkSection.trim().startsWith("KK")) continue

      // Extract KK name
      const kkMatch = kkSection.match(/KK\s+([A-Za-z\s&]+)/i)
      const kkName = kkMatch ? kkMatch[1].trim() : null
      const kk = mapToKelompokKeahlian(kkName)

      // Extract dosen entries
      const dosenEntries = kkSection.split(/\d+\s+(?=[A-Z][a-z]+\.?\s+[A-Z])/g)

      for (const entry of dosenEntries.slice(1)) {
        // Skip the first entry which is usually the header
        // Extract NIP
        const nipMatch = entry.match(/(\d{8}\s+\d{6}\s+\d+\s+\d+)/i)
        const nip = nipMatch ? nipMatch[1].replace(/\s+/g, "") : null

        // Extract name with titles
        const nameMatch = entry.match(/([A-Z][a-z]+\.?\s+[^0-9]+?)(?=\d{8}|\s+\d+\s+\d+|$)/i)
        const namaGelar = nameMatch ? nameMatch[1].trim() : ""

        // Extract name without titles
        const namaTanpaGelar = removeGelar(namaGelar)

        // Extract institution for external lecturers
        const instansiMatch = entry.match(/(?:Instansi\s+Asal|KETERANGAN)\s*(?:\n|\r|\s)+([A-Za-z\s]+)/i)
        const instansiAsal = instansiMatch ? instansiMatch[1].trim() : null

        // Determine employment type
        let jenisKepegawaian: JenisKepegawaian | null = null
        if (entry.includes("Dosen Tidak Tetap")) {
          jenisKepegawaian = "DOSEN_TAK_TETAP_PENGAJAR"
        } else if (entry.includes("Dosen Kontrak")) {
          jenisKepegawaian = "DOSEN_TAK_TETAP_PENGAJAR"
        } else if (instansiAsal && instansiAsal !== "STEI ITB") {
          jenisKepegawaian = instansiAsal.includes("ITB") ? "DOSEN_LUAR_STEI" : "DOSEN_LUAR_ITB"
        } else {
          jenisKepegawaian = "DOSEN_TETAP"
        }

        // Add dosen to the list if we have at least a name
        if (namaGelar) {
          dosens.push({
            nama_tanpa_gelar: namaTanpaGelar,
            nama_plus_gelar: namaGelar,
            NIP: nip,
            KK: kk,
            jenis_kepegawaian: jenisKepegawaian,
            status_kepegawaian: "AKTIF", // Assuming active status for all lecturers in the SK
            instansi_asal: instansiAsal,
          })
        }
      }
    }
  }

  return dosens
}

// Extract dosen from SK Pembimbing dan Penguji
export const extractDosenFromSKPembimbingPenguji = (text: string): ExtractedDosen[] => {
  const dosens: ExtractedDosen[] = []

  // Find the section with the list of supervisors and examiners
  const pembimbingSection = text.match(/DOSEN PEMBIMBING\/PROMOTOR DAN PENGUJI(?:\s|\n)+([\s\S]+?)(?=DEKAN|$)/i)

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

      // Determine employment type
      let jenisKepegawaian: JenisKepegawaian | null = null
      if (instansiAsal) {
        jenisKepegawaian = instansiAsal.includes("ITB") ? "DOSEN_LUAR_STEI" : "DOSEN_LUAR_ITB"
      } else {
        jenisKepegawaian = "DOSEN_TETAP"
      }

      // Add dosen to the list if we have at least a name
      if (namaGelar) {
        dosens.push({
          nama_tanpa_gelar: namaTanpaGelar,
          nama_plus_gelar: namaGelar,
          NIP: nip,
          jenis_kepegawaian: jenisKepegawaian,
          status_kepegawaian: "AKTIF", // Assuming active status for all lecturers in the SK
          instansi_asal: instansiAsal,
        })
      }
    }
  }

  return dosens
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

// Extract dosen from SK Wali Akademik
export const extractDosenFromSKWaliAkademik = (text: string): ExtractedDosen[] => {
  const dosens: ExtractedDosen[] = []

  // Find the section with the list of academic advisors
  const waliSection = text.match(/DOSEN WALI AKADEMIK(?:\s|\n)+([\s\S]+?)(?=DEKAN|$)/i)

  if (waliSection && waliSection[1]) {
    const entries = waliSection[1].split(/\d+\s+(?=[A-Z][a-z]+\.?\s+[A-Z])/g)

    for (const entry of entries) {
      // Extract NIP
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
          jenis_kepegawaian: "DOSEN_TETAP",
          status_kepegawaian: "AKTIF", // Assuming active status for all lecturers in the SK
        })
      }
    }
  }

  return dosens
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
          status_kepegawaian: "AKTIF", // Assuming active status for all assistants in the SK
        })
      }
    }
  }

  return dosens
}

// Helper function to map KK name to KelompokKeahlian enum
function mapToKelompokKeahlian(kkName: string | null): KelompokKeahlian | null {
  if (!kkName) return null

  const kkNameLower = kkName.toLowerCase()

  if (kkNameLower.includes("informatika")) return "INFORMATIKA"
  if (kkNameLower.includes("elektronika")) return "ELEKTRONIKA"
  if (kkNameLower.includes("rekayasa perangkat lunak") || kkNameLower.includes("pengetahuan"))
    return "REKAYASA_PERANGKAT_LUNAK_DAN_PENGETAHUAN"
  if (kkNameLower.includes("sistem kendali") || kkNameLower.includes("komputer")) return "SISTEM_KENDALI_DAN_KOMPUTER"
  if (kkNameLower.includes("telekomunikasi")) return "TEKNIK_TELEKOMUNIKASI"
  if (kkNameLower.includes("ketenagalistrikan")) return "TEKNIK_KETENAGALISTRIKAN"
  if (kkNameLower.includes("teknik komputer")) return "TEKNIK_KOMPUTER"
  if (kkNameLower.includes("teknologi informasi")) return "TEKNOLOGI_INFORMASI"

  return null
}

// Helper function to remove academic titles from name
function removeGelar(namaGelar: string): string {
  // Remove common titles like Dr., Ir., Prof., S.T., M.T., Ph.D., etc.
  return namaGelar
    .replace(/(?:Prof\.|Dr\.?|Ir\.|S\.T\.|M\.T\.|M\.Sc\.|M\.Eng\.|Ph\.D\.|DEA|IPM|IPP|ASEAN Eng\.|,)+/gi, "")
    .replace(/\s+/g, " ")
    .trim()
}
