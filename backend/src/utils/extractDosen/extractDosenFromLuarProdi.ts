import {
    KelompokKeahlian,
    JenisKepegawaian,
    StatusKepegawaian,
    JabatanFungsional,
  } from "@prisma/client";
  import { removeGelar } from "./extractDosenUtils";
  
  export interface ExtractedDosen {
    nama_tanpa_gelar: string;
    nama_plus_gelar: string;
    NIDN?: string | null;
    NIP?: string | null;
    KK?: KelompokKeahlian | null;
    jenis_kepegawaian?: JenisKepegawaian | null;
    pangkat?: string | null;
    jabatan_fungsional?: JabatanFungsional | null;
    status_kepegawaian: StatusKepegawaian;
    instansi_asal?: string | null;
  }
  
  export const extractDosenFromSKLuarProdi = (text: string): ExtractedDosen[] => {
    const dosens: ExtractedDosen[] = [];
    const uniqueNames = new Set<string>();
    
    // console.log("Extracting faculty from SK Luar Prodi...");
    
    const attachmentMatch = text.match(/LAMPIRAN KEPUTUSAN REKTOR[\s\S]+?PERIODE TAHUN \d{4}/i);
    if (!attachmentMatch) {
      console.log("Could not find attachment section");
      return dosens;
    }
    
    let attachmentText = text.substring(attachmentMatch.index!);
    
    const memberListMatch = attachmentText.match(/Anggota\s*:[\s\S]*/i);
    if (!memberListMatch) {
      console.log("Could not find member list section");
      return dosens;
    }
    
    const memberListText = memberListMatch[0];
    const tembusanIndex = memberListText.indexOf("Tembusan");
    const signatureIndex = memberListText.indexOf("a.n. REKTOR");
    
    // Determine where to cut off the text
    let endIndex = memberListText.length;
    if (tembusanIndex > 0 && tembusanIndex < endIndex) {
      endIndex = tembusanIndex;
    }
    if (signatureIndex > 0 && signatureIndex < endIndex) {
      endIndex = signatureIndex;
    }
    
    const cleanMemberListText = memberListText.substring(0, endIndex);
    
    // console.log("Found member list section");
    const dosenEntryPattern = /^\s*(\d+)\.\s+((?:Prof\.|Dr\.?|Ir\.|S\.\w+\.|M\.\w+\.|Ph\.D\.|[A-Z][a-z]+\.?)?\s*[A-Z][a-zA-Z'`.\- ]+(?:,\s*[A-Z][a-zA-Z.]+)*\s*(?:$$[^)]+$$)?)/gm;
    let match;
    while ((match = dosenEntryPattern.exec(cleanMemberListText)) !== null) {
      const fullEntry = match[0];
      const namaGelar = match[2].trim();
      
      if (isAdministrativePosition(namaGelar)) {
        // console.log(`Skipping administrative position: ${namaGelar}`);
        continue;
      }
      
      // Extract faculty/department information if available (in parentheses)
      let instansiAsal: string | null = null;
      const instansiMatch = namaGelar.match(/$$([^)]+)$$/);
      let cleanedNamaGelar = namaGelar;
      
      if (instansiMatch) {
        instansiAsal = instansiMatch[1].trim();
        cleanedNamaGelar = namaGelar.replace(/\s*$$[^)]+$$\s*/, ' ').trim();
      }
      
      const namaTanpaGelar = removeGelar(cleanedNamaGelar);
      
      if (uniqueNames.has(namaTanpaGelar)) {
        continue;
      }
      
    //   console.log(`Found faculty: ${namaTanpaGelar} (${cleanedNamaGelar})`);
      
      let jenisKepegawaian: JenisKepegawaian = JenisKepegawaian.DOSEN_TETAP;
      if (instansiAsal) {
        if (instansiAsal.includes("STEI")) {
          jenisKepegawaian = JenisKepegawaian.DOSEN_TETAP;
        } else if (instansiAsal.includes("ITB") && !instansiAsal.includes("STEI")) {
          jenisKepegawaian = JenisKepegawaian.DOSEN_LUAR_STEI;
        } else {
          jenisKepegawaian = JenisKepegawaian.DOSEN_LUAR_ITB;
        }
      }
      
      // Add to the list
      uniqueNames.add(namaTanpaGelar);
      dosens.push({
        nama_tanpa_gelar: namaTanpaGelar,
        nama_plus_gelar: cleanedNamaGelar,
        NIDN: null,
        NIP: null,
        KK: null,
        jenis_kepegawaian: null,
        pangkat: null,
        jabatan_fungsional: null,
        status_kepegawaian: StatusKepegawaian.AKTIF,
        instansi_asal: instansiAsal,
      });
    }
    
    console.log(`Extracted ${dosens.length} faculty members`);
    return dosens;
  };
  
  function isAdministrativePosition(text: string): boolean {
    const administrativeKeywords = [
      "rektor", "wakil rektor", "dekan", "ketua", "kepala", "direktur", "sekretaris",
      "satuan", "biro", "kantor", "lembaga", "unit", "pelaksana", "teknis", "masing-masing",
      "yang bersangkutan", "penanggung jawab"
    ];
    
    const lowerText = text.toLowerCase();
    return administrativeKeywords.some(keyword => lowerText.includes(keyword));
  }