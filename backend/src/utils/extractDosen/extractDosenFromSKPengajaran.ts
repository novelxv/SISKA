import { KelompokKeahlian, JenisKepegawaian, StatusKepegawaian, JabatanFungsional } from "@prisma/client"
import { mapToKelompokKeahlian, removeGelar } from "./extractDosenUtils"

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

export const extractDosenFromSKPengajaran = (text: string): ExtractedDosen[] => {
  const dosens: ExtractedDosen[] = [];
  const uniqueNames = new Set<string>();
  
  // Find all program study sections
  const programStudySections = text.split(
    /(?=A\.\s+Program\s+Studi|B\.\s+Program\s+Studi|C\.\s+Program\s+Studi|D\.\s+Program\s+Studi|E\.\s+Program\s+Studi|F\.\s+Program\s+Studi|G\.\s+Program\s+Studi|H\.\s+Program\s+Studi|I\.\s+Program\s+Studi|J\.\s+Program\s+Studi|K\.\s+Program\s+Studi)/i
  );

  // Skip the first section if it's just the header
  const sections = programStudySections.length > 1 ? programStudySections.slice(1) : programStudySections;

  for (const section of sections) {
    // Extract KK sections within each program study
    const kkSections = section.split(/(?=KK\s+[A-Za-z\s&]+|Dosen\s+Tidak\s+Tetap|Dosen\s+Kontrak|Dosen\s+Industri|Pengampu\s+Luar|Tutor)/i);

    for (const kkSection of kkSections) {
      // Skip if not a valid section
      if (!kkSection.trim().match(/^(KK|Dosen|Pengampu|Tutor)/i)) continue;

      // Extract KK name
      const kkMatch = kkSection.match(/KK\s+([A-Za-z\s&]+)/i);
      const kkName = kkMatch ? kkMatch[1].trim() : null;
      const kk = mapToKelompokKeahlian(kkName);

      // Determine employment type based on section header
      let defaultJenisKepegawaian: JenisKepegawaian | null = JenisKepegawaian.DOSEN_TETAP;
      if (kkSection.match(/Dosen\s+Tidak\s+Tetap\s+Peneliti/i)) {
        defaultJenisKepegawaian = JenisKepegawaian.DOSEN_TAK_TETAP_PENELITI;
      } else if (kkSection.match(/Dosen\s+Tidak\s+Tetap/i)) {
        defaultJenisKepegawaian = JenisKepegawaian.DOSEN_TAK_TETAP_PENGAJAR;
      } else if (kkSection.match(/Dosen\s+Kontrak/i)) {
        defaultJenisKepegawaian = JenisKepegawaian.DOSEN_TAK_TETAP_PENGAJAR;
      } else if (kkSection.match(/Dosen\s+Industri/i)) {
        defaultJenisKepegawaian = JenisKepegawaian.DOSEN_INDUSTRI;
      } else if (kkSection.match(/Tutor/i)) {
        defaultJenisKepegawaian = JenisKepegawaian.TUTOR;
      }

      // Use regex to find patterns that match faculty entries
      // This pattern looks for numbered entries (1, 2, 3, etc.) followed by a name with titles
      const dosenEntryPattern = /^\s*(\d+)\s+((?:Prof\.|Dr\.?|Ir\.)?\s*[A-Z][a-zA-Z'`.\- ]+(?:,\s*[A-Z][a-zA-Z.]+)*\s*)/gm;

      //   const dosenEntryPattern = /^\s*(\d+)\s+((?:Prof\.|Dr\.?|Ir\.|[A-Z][a-z]+\.?)\s+(?:[A-Z][a-z]+\.?\s*)+)/gm;
      let match;
      
      // Find all matches in the section
      while ((match = dosenEntryPattern.exec(kkSection)) !== null) {
        const namaGelar = match[2].trim();
        const namaTanpaGelar = removeGelar(namaGelar);
        
        // Skip if we've already processed this person
        if (uniqueNames.has(namaTanpaGelar)) {
          continue;
        }
        
        // Get the position where this entry was found
        const entryPosition = match.index;
        
        // Get the text following this entry (up to the next entry or end of section)
        const followingText = kkSection.substring(entryPosition, kkSection.length);
        const lines = followingText.split('\n');
        
        // Look for NIP in the next few lines
        let nip: string | null = null;
        for (let i = 1; i < Math.min(5, lines.length); i++) {
          const nipMatch = lines[i].match(/^\s*(\d{8}\s+\d{6}\s+\d+\s+\d+)/);
          if (nipMatch) {
            nip = nipMatch[1].replace(/\s+/g, "");
            break;
          }
        }
        
        let instansiAsal: string | null = null;
        for (let i = 0; i < Math.min(10, lines.length); i++) {
          if (lines[i].includes("Instansi Asal")) {
            const instansiMatch = lines[i].match(/Instansi\s+Asal\s+(.+?)$/);
            if (instansiMatch) {
              instansiAsal = instansiMatch[1].trim();
              break;
            }
          }
        }
        
        const skipKeywords = [
          "material teknik", "sistem digital", "praktikum", "rangkaian", "elektronika",
          "probabilitas", "statistika", "matematika", "pengantar", "analisis", "struktur",
          "diskrit", "pemrograman", "jaringan", "komputer", "pengolahan", "sinyal", "data",
          "komunikasi", "arsitektur", "algoritma", "basis data", "database", "interaksi",
          "manusia", "rekayasa", "perangkat lunak", "software", "keamanan", "artificial",
          "intelligence", "kecerdasan", "buatan", "machine learning", "pembelajaran mesin",
          "kelas", "prodi", "stei itb", "fmipa", "sith"
        ];
        
        const lowerNameTanpaGelar = namaTanpaGelar.toLowerCase();
        const shouldSkip = skipKeywords.some(keyword => lowerNameTanpaGelar.includes(keyword.toLowerCase()));
        
        if (shouldSkip) {
          continue;
        }
        
        let jenisKepegawaian: JenisKepegawaian | null = defaultJenisKepegawaian;
            if (instansiAsal) {
                if (instansiAsal.includes("ITB") && !instansiAsal.includes("STEI ITB")) {
                    jenisKepegawaian = JenisKepegawaian.DOSEN_LUAR_STEI;
                } else if (!instansiAsal.includes("ITB")) {
                    jenisKepegawaian = JenisKepegawaian.DOSEN_LUAR_ITB;
                }
            }
        
        // Add dosen to the list
        uniqueNames.add(namaTanpaGelar);
        dosens.push({
          nama_tanpa_gelar: namaTanpaGelar,
          nama_plus_gelar: namaGelar,
          NIP: nip,
          KK: kk,
          jenis_kepegawaian: jenisKepegawaian,
          status_kepegawaian: StatusKepegawaian.AKTIF,
          instansi_asal: instansiAsal,
        });
      }
    }
  }

  return dosens;
}