import type { KelompokKeahlian, JenisKepegawaian, StatusKepegawaian, JabatanFungsional } from "@prisma/client"
import { removeGelar } from "./extractDosenUtils"

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

export const extractDosenFromSKWaliAkademik = (text: string): ExtractedDosen[] => {
  const dosens: ExtractedDosen[] = []
  const uniqueDosenNames = new Set<string>()

  // Find all program study sections
  const programSections = text.split(/\d+\.\s+Program Studi\s+/).slice(1)

  for (const section of programSections) {
    // Find the table header
    const tableHeaderRegex = /No\s+Dosen Wali\s+NIM\s+Nama/i
    const tableHeaderMatch = tableHeaderRegex.exec(section)
    if (!tableHeaderMatch) continue

    const tableContent = section.slice(tableHeaderMatch.index + tableHeaderMatch[0].length)

    // Extract rows from the table
    // Each row typically starts with a number followed by lecturer name
    const rows = tableContent.split(/\n\s*\d+\s+/).filter(Boolean)

    for (const row of rows) {
      // Extract lecturer name - it's the first part of the row before NIM
      // NIM is typically an 8-digit number
      const lecturerMatch = row.match(/^([^0-9]+)(?=\s+\d{8})/i)

      if (!lecturerMatch) continue

      const namaGelar = lecturerMatch[1].trim()

      // Check if the name has academic titles either at the beginning or end
      // Common patterns for titles at beginning: Prof., Dr., Ir.
      // Common patterns for titles at end: S.T., M.T., Ph.D., etc. (usually after a comma)
      const hasTitlesAtBeginning = /^(Prof\.|Dr\.|Ir\.|[A-Z][a-z]+\.)/i.test(namaGelar)
      const hasTitlesAtEnd = /,\s*(S\.[A-Z]+\.|M\.[A-Z]+\.|Ph\.D\.|IPM|ASEAN Eng\.)/i.test(namaGelar)

      // Also check for names with capital letters (most names start with capitals)
      const hasCapitalLetters = /[A-Z][a-z]+/.test(namaGelar)

      // Skip if it doesn't look like a name with titles or proper capitalization
      if (!(hasTitlesAtBeginning || hasTitlesAtEnd || hasCapitalLetters)) continue

      // Check for NIP in the document that might be associated with this lecturer
      const escapedName = namaGelar
        .replace(/\./g, "\\.")
        .replace(/\s+/g, "\\s+")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")
        .replace(/,/g, "\\,")

      const nipMatch = text.match(new RegExp(`${escapedName}\\s+(\\d{8}\\s*\\d{6}\\s*\\d\\s*\\d{3})`, "i"))
      const nip = nipMatch ? nipMatch[1].replace(/\s+/g, "") : null

      // Skip if we've already processed this lecturer
      if (uniqueDosenNames.has(namaGelar)) continue
      uniqueDosenNames.add(namaGelar)

      const namaTanpaGelar = removeGelar(namaGelar)

      // Only add if we have a valid name after removing titles
      if (namaTanpaGelar && namaTanpaGelar.length > 1) {
        dosens.push({
          nama_tanpa_gelar: namaTanpaGelar,
          nama_plus_gelar: namaGelar,
          NIP: nip,
          jenis_kepegawaian: "DOSEN_TETAP", // Default assumption
          status_kepegawaian: "AKTIF", // Default assumption for active lecturers
        })
      }
    }
  }

  // If we couldn't extract any lecturers using the table approach,
  // try alternative methods
  if (dosens.length === 0) {
    // Try to extract from the KK sections which often list lecturers
    const kkSections = text.match(/KK\s+[A-Za-z\s&]+\n([\s\S]+?)(?=KK\s+|$)/g)

    if (kkSections) {
      for (const section of kkSections) {
        // Look for patterns like "1 Name NIM" where Name is the lecturer
        const lecturerMatches = section.matchAll(/\d+\s+([^0-9\n]+?)(?=\s+\d{8}|\s+\d{9})/g)

        for (const match of Array.from(lecturerMatches)) {
          const namaGelar = match[1].trim()

          // Skip if we've already processed this lecturer
          if (uniqueDosenNames.has(namaGelar)) continue
          uniqueDosenNames.add(namaGelar)

          const namaTanpaGelar = removeGelar(namaGelar)

          // Only add if we have a valid name after removing titles
          if (namaTanpaGelar && namaTanpaGelar.length > 1) {
            // Try to find NIP for this lecturer
            const nipMatch = text.match(
              new RegExp(
                `${namaGelar.replace(/\./g, "\\.").replace(/\s+/g, "\\s+")}\\s+(\\d{8}\\s*\\d{6}\\s*\\d\\s*\\d{3})`,
                "i",
              ),
            )
            const nip = nipMatch ? nipMatch[1].replace(/\s+/g, "") : null

            dosens.push({
              nama_tanpa_gelar: namaTanpaGelar,
              nama_plus_gelar: namaGelar,
              NIP: nip,
              jenis_kepegawaian: "DOSEN_TETAP",
              status_kepegawaian: "AKTIF",
            })
          }
        }
      }
    }

    // If still no results, try a more general approach
    if (dosens.length === 0) {
      // Look for any name-like patterns followed by NIP
      const generalMatches = text.matchAll(/([A-Z][A-Za-z\s.,]+)(?:\s+NIP\s+)?(\d{8}\s*\d{6}\s*\d\s*\d{3})/g)

      for (const match of Array.from(generalMatches)) {
        const namaGelar = match[1].trim()
        const nip = match[2].replace(/\s+/g, "")

        // Skip if we've already processed this lecturer
        if (uniqueDosenNames.has(namaGelar)) continue
        uniqueDosenNames.add(namaGelar)

        const namaTanpaGelar = removeGelar(namaGelar)

        // Only add if we have a valid name after removing titles
        if (namaTanpaGelar && namaTanpaGelar.length > 1) {
          dosens.push({
            nama_tanpa_gelar: namaTanpaGelar,
            nama_plus_gelar: namaGelar,
            NIP: nip,
            jenis_kepegawaian: "DOSEN_TETAP",
            status_kepegawaian: "AKTIF",
          })
        }
      }
    }
  }

  // Add debugging information
  console.log(`Extracted ${dosens.length} unique lecturers from SK Wali Akademik`)

  return dosens
}
