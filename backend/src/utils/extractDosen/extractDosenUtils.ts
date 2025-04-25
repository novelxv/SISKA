import type { KelompokKeahlian } from "@prisma/client";

export function removeGelar(namaGelar: string): string {
    let nama = namaGelar;
  
    const prefixes = [
      "Prof\\.", "Prof",
      "Dr\\.", "Dr",
      "Ir\\.", "Ir",
      "Drs\\.", "Drs",
      "Hj\\.", "Hj",
      "H\\.", "H",
      "Eng\\.", "Eng",
      "Ing\\.", "Ing"
    ];
  
    for (const prefix of prefixes) {
      const prefixRegex = new RegExp(`(^|\\s)${prefix}(?=\\s)`, "gi");
      nama = nama.replace(prefixRegex, "$1");
    }
    nama = nama.split(",")[0];
      nama = nama.replace(/^[.,\s]+|[.,\s]+$/g, "");
    nama = nama.replace(/\s{2,}/g, " ");
  
    return nama.trim();
  }
  
  

export function mapToKelompokKeahlian(kkName: string | null): KelompokKeahlian | null {
  if (!kkName) return null;

  const kkNameLower = kkName.toLowerCase();

  if (kkNameLower.includes("informatika")) return "INFORMATIKA";
  if (kkNameLower.includes("elektronika")) return "ELEKTRONIKA";
  if (kkNameLower.includes("rekayasa perangkat lunak") || kkNameLower.includes("pengetahuan"))
    return "REKAYASA_PERANGKAT_LUNAK_DAN_PENGETAHUAN";
  if (kkNameLower.includes("sistem kendali") || kkNameLower.includes("komputer")) return "SISTEM_KENDALI_DAN_KOMPUTER";
  if (kkNameLower.includes("telekomunikasi")) return "TEKNIK_TELEKOMUNIKASI";
  if (kkNameLower.includes("ketenagalistrikan")) return "TEKNIK_KETENAGALISTRIKAN";
  if (kkNameLower.includes("teknik komputer")) return "TEKNIK_KOMPUTER";
  if (kkNameLower.includes("teknologi informasi")) return "TEKNOLOGI_INFORMASI";

  return null;
}
