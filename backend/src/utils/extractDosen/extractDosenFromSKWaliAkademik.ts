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

  const programSections = text.split(/\d+\.\s+Program Studi\s+/).slice(1)

  for (const section of programSections) {
    const tableHeaderRegex = /No\s+Dosen Wali\s+NIM\s+Nama/i
    const tableHeaderMatch = tableHeaderRegex.exec(section)
    if (!tableHeaderMatch) continue

    const tableContent = section.slice(tableHeaderMatch.index + tableHeaderMatch[0].length)

    const rows = tableContent.split(/\n\s*\d+\s+/).filter(Boolean)

    for (const row of rows) {
      const lecturerMatch = row.match(/^([^0-9]+)(?=\s+\d{8})/i)

      if (!lecturerMatch) continue

      const namaGelar = lecturerMatch[1].trim()

      const hasTitlesAtBeginning = /^(Prof\.|Dr\.|Ir\.|[A-Z][a-z]+\.)/i.test(namaGelar)
      const hasTitlesAtEnd = /,\s*(S\.[A-Z]+\.|M\.[A-Z]+\.|Ph\.D\.|IPM|ASEAN Eng\.)/i.test(namaGelar)

      const hasCapitalLetters = /[A-Z][a-z]+/.test(namaGelar)

      if (!(hasTitlesAtBeginning || hasTitlesAtEnd || hasCapitalLetters)) continue

      const escapedName = namaGelar
        .replace(/\./g, "\\.")
        .replace(/\s+/g, "\\s+")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)")
        .replace(/,/g, "\\,")

      const nipMatch = text.match(new RegExp(`${escapedName}\\s+(\\d{8}\\s*\\d{6}\\s*\\d\\s*\\d{3})`, "i"))
      const nip = nipMatch ? nipMatch[1].replace(/\s+/g, "") : null

      if (uniqueDosenNames.has(namaGelar)) continue
      uniqueDosenNames.add(namaGelar)

      const namaTanpaGelar = removeGelar(namaGelar)

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

  if (dosens.length === 0) {
    const kkSections = text.match(/KK\s+[A-Za-z\s&]+\n([\s\S]+?)(?=KK\s+|$)/g)

    if (kkSections) {
      for (const section of kkSections) {
        const lecturerMatches = section.matchAll(/\d+\s+([^0-9\n]+?)(?=\s+\d{8}|\s+\d{9})/g)

        for (const match of Array.from(lecturerMatches)) {
          const namaGelar = match[1].trim()

          if (uniqueDosenNames.has(namaGelar)) continue
          uniqueDosenNames.add(namaGelar)

          const namaTanpaGelar = removeGelar(namaGelar)

          if (namaTanpaGelar && namaTanpaGelar.length > 1) {
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

    if (dosens.length === 0) {
      const generalMatches = text.matchAll(/([A-Z][A-Za-z\s.,]+)(?:\s+NIP\s+)?(\d{8}\s*\d{6}\s*\d\s*\d{3})/g)

      for (const match of Array.from(generalMatches)) {
        const namaGelar = match[1].trim()
        const nip = match[2].replace(/\s+/g, "")

        if (uniqueDosenNames.has(namaGelar)) continue
        uniqueDosenNames.add(namaGelar)

        const namaTanpaGelar = removeGelar(namaGelar)

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


  return dosens
}
