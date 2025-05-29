import * as XLSX from 'xlsx';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DOSEN WALI TPB

type Student = {
  nim: string
  nama: string
}

type AdvisorGroup = {
  nama_dosen: string
  nip_dosen: string
  no: number[]
  nim: string[]
  mhs: string[]
}

type ProcessedData = {
  steik: AdvisorGroup[]
  steir: AdvisorGroup[]
  inter: AdvisorGroup[]
}

export async function processDosenWaliTPBExcel(filePath: string): Promise<ProcessedData> {
  const result: ProcessedData = {
    steik: [],
    steir: [],
    inter: [],
  }

  try {
    const workbook = XLSX.readFile(filePath);

    if (workbook.SheetNames.includes("TPB STEI-K")) {
      const worksheet = workbook.Sheets["TPB STEI-K"]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      const advisorGroups = groupStudentsByAdvisor(jsonData, "steik")
      result.steik = await enrichWithNIP(advisorGroups)
    }

    if (workbook.SheetNames.includes("TPB STEI-R")) {
      const worksheet = workbook.Sheets["TPB STEI-R"]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      const regularData = jsonData.filter((row: any) => row["Kelas"] === "Ganesha")
      const interData = jsonData.filter((row: any) => row["Kelas"] === "International Track")

      const regularAdvisorGroups = groupStudentsByAdvisor(regularData, "steir")
      result.steir = await enrichWithNIP(regularAdvisorGroups)

      const interAdvisorGroups = groupStudentsByAdvisor(interData, "inter")
      result.inter = await enrichWithNIP(interAdvisorGroups)
    }

    return result
  } catch (error) {
    console.error("Error processing Excel file:", error)
    throw new Error("Failed to process Excel file")
  }
}

function groupStudentsByAdvisor(data: any[], category: string): AdvisorGroup[] {
  const advisorMap = new Map<
    string,
    {
      students: Student[]
    }
  >()

  data.forEach((row, index) => {
    const advisorName = row["Dosen Wali"]
    const student = {
      nim: String(row["NIM"]),
      nama: row["Nama"],
    }

    if (!advisorMap.has(advisorName)) {
      advisorMap.set(advisorName, {
        students: [],
      })
    }

    const group = advisorMap.get(advisorName)!
    group.students.push(student)
  })

  const result = Array.from(advisorMap.entries()).map(([advisorName, group]) => {
    group.students.sort((a, b) => a.nim.localeCompare(b.nim))
    const sequentialNumbers = Array.from({ length: group.students.length }, (_, i) => i + 1)
    return {
      nama_dosen: advisorName,
      nip_dosen: "", 
      no: sequentialNumbers,
      nim: group.students.map((s) => s.nim),
      mhs: group.students.map((s) => s.nama),
    }
  })

  return result.sort((a, b) => a.nama_dosen.localeCompare(b.nama_dosen))
}

async function enrichWithNIP(advisorGroups: AdvisorGroup[]): Promise<AdvisorGroup[]> {
  const enrichedGroups = await Promise.all(
    advisorGroups.map(async (group) => {
      try {
        const dosen = await prisma.dosen.findFirst({
          where: {
            nama_plus_gelar: group.nama_dosen,
          },
          select: {
            NIP: true,
          },
        })

        return {
          ...group,
          nip_dosen: dosen?.NIP || "",
        }
      } catch (error) {
        console.error(`Error fetching NIP for ${group.nama_dosen}:`, error)
        return group
      }
    }),
  )

  return enrichedGroups
}

// DOSEN WALI MAHASISWA AKTIF

const sheetToProgramMap: Record<string, string> = {
  EL: "teknik_elektro",
  IF: "teknik_informatika",
  EP: "teknik_tenaga_listrik",
  ET: "teknik_telekomunikasi",
  STI: "sistem_teknologi_informasi",
  EB: "teknik_biomedis",
  "S2 EL": "magister_teknik_elektro",
  "S2 IF": "magister_teknik_informatika",
  S3: "doktor_elektro_informatika",
  "PPI EL": "ppi_elektro",
  "PPI IF": "ppi_informatika",
}

async function getDosenNIPKK(namaTanpaGelar: string) {
  try {
    const dosen = await prisma.dosen.findFirst({
      where: {
        nama_plus_gelar: namaTanpaGelar,
      },
      select: {
        nama_plus_gelar: true,
        NIP: true,
        KK: true,
      },
    })

    return {
      nama_plus_gelar: dosen?.nama_plus_gelar || "",
      NIP: dosen?.NIP || "", 
      KK: dosen?.KK || ""
    }
  } catch (error) {
    console.error(`Error fetching NIP for ${namaTanpaGelar}:`, error)
    return {
      nama_plus_gelar: "",
      NIP: ""
    }
  }
}

function mapKK(kkCode: string | undefined): string {
  if (!kkCode) {
    return ""
  }
  const mapping: { [key: string]: string } = {
    INFORMATIKA: "KK Informatika",
    TEKNIK_TELEKOMUNIKASI: "KK Teknik Telekomunikasi",
    TEKNIK_BIOMEDIS: "KK Teknik Biomedika",
    TEKNIK_KOMPUTER: "KK Teknik Komputer",
    SISTEM_KENDALI_DAN_KOMPUTER: "KK Sistem Kendali dan Komputer",
    TEKNIK_KETENAGALISTRIKAN: "KK Teknik Ketenagalistrikan",
    ELEKTRONIKA: "KK Elektronika",
    TEKNOLOGI_INFORMASI: "KK Teknologi Informasi",
    REKAYASA_PERANGKAT_LUNAK_DAN_PENGETAHUAN: "KK Rekayasa Perangkat Lunak dan Pengetahuan",
  }

  return mapping[kkCode] || kkCode
}

export async function processDosenWaliMahasiswaAktifExcel(filePath: string) {
  try {
    const workbook = XLSX.readFile(filePath)

    const result: any = {}

    for (const sheetName of workbook.SheetNames) {
      if (sheetName === "TPB STEI-K" || sheetName === "TPB STEI-R") {
        continue
      }

      const programKey = sheetToProgramMap[sheetName]
      if (!programKey) {
        console.warn(`Unknown sheet name: ${sheetName}`)
        continue
      }

      result[programKey] = {
        dosen: [],
      }

      const worksheet = workbook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json(worksheet)

      const dosenGroups: Record<string, any[]> = {}
      for (const row of data as Array<Record<string, any>>) {
        const nim = row["NIM"]?.toString() || ""
        const nama = row["Nama"]?.toString() || ""
        const dosenWali = row["Dosen Wali"]?.toString() || ""

        if (!dosenWali) continue

        if (!dosenGroups[dosenWali]) {
          dosenGroups[dosenWali] = []
        }

        dosenGroups[dosenWali].push({
          nim,
          nama,
        })
      }

      const kkGroups: Record<string, any[]> = {};

      let dosenCounter = 1
      for (const [dosenName, students] of Object.entries(dosenGroups)) {
        students.sort((a, b) => a.nim.localeCompare(b.nim))

        const res = await getDosenNIPKK(dosenName)
        
        const kk = mapKK(res.KK) || ''; 

        if (!kkGroups[kk]) {
          kkGroups[kk] = [];
        }

        kkGroups[kk].push({
          no: dosenCounter++,
          nama_dosen: res.nama_plus_gelar,
          nip_dosen: res.NIP,
          nim: students.map((s) => s.nim),
          mhs: students.map((s) => s.nama),
        })
      }

      for (const kk in kkGroups) {
        kkGroups[kk].sort((a, b) => a.nama_dosen.localeCompare(b.nama_dosen))

        kkGroups[kk].forEach((dosen, index) => {
          dosen.no = index + 1
        })
      }

      for (const [kk, dosen] of Object.entries(kkGroups)) {
        result[programKey].dosen.push({
          kk,
          isi: dosen,
        })
      }
    }
    console.log("Processed Data:", JSON.stringify(result, null, 2));
    return result
  } catch (error) {
    console.error("Error processing Excel file:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}