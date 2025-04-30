import {
  KelompokKeahlian,
  JenisKepegawaian,
  StatusKepegawaian,
} from "@prisma/client";
import { mapToKelompokKeahlian, removeGelar } from "./extractDosenUtils";
import { ExtractedDosen } from "../extractDosenFromSK";

export const extractDosenFromSKDosenPembimbing = (text: string): ExtractedDosen[] => {
  const dosens: ExtractedDosen[] = [];
  const uniqueNames = new Set<string>();

  // Ambil semua bagian lampiran
  const attachmentMatch = text.match(/LAMPIRAN KEPUTUSAN DEKAN[\s\S]+/i);
  if (!attachmentMatch) {
    console.log("Could not find attachment section");
    return dosens;
  }

  const attachmentText = attachmentMatch[0];
  const lines = attachmentText.split("\n").map(line => line.trim()).filter(Boolean);

  let currentKK: string | null = null;
  let currentJenisKepegawaian: JenisKepegawaian = JenisKepegawaian.DOSEN_TETAP;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const kkMatch = line.match(/^KK\s+(.+)$/i);
    if (kkMatch) {
      currentKK = kkMatch[1].trim();
      continue;
    }

    if (/Dosen\s+Tidak\s+Tetap\s+Peneliti/i.test(line)) {
      currentJenisKepegawaian = JenisKepegawaian.DOSEN_TAK_TETAP_PENELITI;
      currentKK = null;
      continue;
    }
    if (/Dosen\s+Tidak\s+Tetap/i.test(line)) {
      currentJenisKepegawaian = JenisKepegawaian.DOSEN_TAK_TETAP_PENGAJAR;
      currentKK = null;
      continue;
    }
    if (/Pembimbing\s+Luar\s+STEI|Dosen\s+Luar\s+STEI/i.test(line)) {
      currentJenisKepegawaian = JenisKepegawaian.DOSEN_LUAR_STEI;
      currentKK = null;
      continue;
    }
    if (/Pembimbing\s+Luar\s+ITB|Dosen\s+Luar\s+ITB/i.test(line)) {
      currentJenisKepegawaian = JenisKepegawaian.DOSEN_LUAR_ITB;
      currentKK = null;
      continue;
    }

    // Format: No Nama NIM ... Instansi
    const externalWithInstansi = line.match(/^\d+\s+(.+?)\s+\d{5,}\s+.+?\s+Pemb\.\s+\S+\s+(.+)$/);
    if (externalWithInstansi) {
      const namaGelar = externalWithInstansi[1].trim();
      const namaTanpaGelar = removeGelar(namaGelar);
      const instansi = externalWithInstansi[2].trim();
      if (uniqueNames.has(namaTanpaGelar)) continue;

      dosens.push({
        nama_tanpa_gelar: namaTanpaGelar,
        nama_plus_gelar: namaGelar,
        NIP: null,
        KK: null,
        jenis_kepegawaian: currentJenisKepegawaian,
        status_kepegawaian: StatusKepegawaian.AKTIF,
        instansi_asal: instansi,
      });
      uniqueNames.add(namaTanpaGelar);
      continue;
    }

    // Tangkap nama baris pembimbing: "1 Elvayandri, S.Si., M.T." atau "3 Nur Ahmadi"
    const pembimbingLine = line.match(/^\d+\s+([^\d]+?)\s+(?:\d{5,}|$)/);
    if (pembimbingLine) {
      const namaGelar = pembimbingLine[1].trim();
      const namaTanpaGelar = removeGelar(namaGelar);
      if (uniqueNames.has(namaTanpaGelar)) continue;

      // Cari kemungkinan NIP di baris berikut
      const nipLine = lines[i + 1];
      const nipCandidate = nipLine?.match(/\d{18}/)?.[0] ?? null;

      dosens.push({
        nama_tanpa_gelar: namaTanpaGelar,
        nama_plus_gelar: namaGelar,
        NIP: nipCandidate,
        KK: mapToKelompokKeahlian(currentKK),
        jenis_kepegawaian: currentJenisKepegawaian,
        status_kepegawaian: StatusKepegawaian.AKTIF,
        instansi_asal: null,
      });

      uniqueNames.add(namaTanpaGelar);
    }
  }

  console.log(`Extracted ${dosens.length} faculty members`);
  return dosens;
};
