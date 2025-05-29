// DOSEN PEMBIMBING MAHASISWA AKTIF
import * as XLSX from 'xlsx';
import { PrismaClient, JenisKepegawaian } from "@prisma/client";

const prisma = new PrismaClient();

type Student2 = {
  nim: string[]
  nama: string[]
  fakultas_prodi_kelas: string[]
  kelas: string[]
  jabatan: string[]
}

type KKGroup = {
  kk: string
  isi: DosenWithStudents[]
}

type DosenWithStudents = {
  no: number
  nama_dosen: string
  nip_dosen: string
  nim: string[]
  mhs: string[]
  kelas: string[]
  jabatan: string[]
  asal?: string[]
}

type JenisGroup = {
  jenis: string
  isi: DosenWithStudents[]
}

type ProgramData = {
  tetap: KKGroup[]
  tidak_tetap: JenisGroup[]
  luar: JenisGroup[]
}

export type ProcessedDataPembimbing = {
  teknik_elektro: ProgramData
  teknik_informatika: ProgramData
  teknik_tenaga_listrik: ProgramData
  teknik_telekomunikasi: ProgramData
  sistem_teknologi_informasi: ProgramData
  teknik_biomedis: ProgramData
  magister_teknik_elektro: ProgramData
  magister_teknik_informatika: ProgramData
  doktor_elektro_informatika: ProgramData
  ppi_elektro: ProgramData
  ppi_informatika: ProgramData
}

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

function extractClassInfo(fakultasProdiKelas: string): { kelas: string; jabatan: string } {
  const jabatan = fakultasProdiKelas

  const parts = fakultasProdiKelas.split("/")
  const kelas = parts.length > 0 ? parts[parts.length - 1].trim() : ""

  return { kelas, jabatan }
}

async function categorizeLecturer(name: string): Promise<{
  category: "tetap" | "tidak_tetap" | "luar"
  group: string
  instansi?: string | null
}> {
  if (name.includes(" - ")) {
    const [_, institution] = name.split(" - ")
    return {
      category: "luar",
      group: "Dosen Luar ITB",
      instansi: institution.trim(),
    }
  }

  const dosen = await prisma.dosen.findFirst({
    where: {
      nama_plus_gelar: name,
    },
  })

  if (dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_INDUSTRI || dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_LUAR_ITB) {
    return {
      category: "luar",
      group: "Dosen Luar ITB",
      instansi: dosen?.instansi_asal ?? null,
    }
  }

  if (dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_LUAR_STEI && dosen.instansi_asal != undefined) {
    console.log(dosen.nama_plus_gelar)
    console.log(dosen.instansi_asal)
    return {
      category: "luar",
      group: "Dosen Luar STEI",
      instansi: dosen.instansi_asal,
    }
  }

  if (
    dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_TAK_TETAP_PENELITI ||
    dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_TAK_TETAP_PENGAJAR
  ) {
    const jenis =
      dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_TAK_TETAP_PENELITI
        ? "Dosen Tidak Tetap Peneliti"
        : "Dosen Tidak Tetap Pengajar"

    return {
      category: "tidak_tetap",
      group: jenis,
    }
  }

  return {
    category: "tetap",
    group: dosen?.KK || "KK Lainnya",
  }
}

async function getLecturerNIP(name: string): Promise<string> {
  const dosen = await prisma.dosen.findFirst({
    where: {
      nama_plus_gelar: name,
    },
  })

  return dosen?.NIP || ""
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

export async function processDosenPembimbingExcel(filePath: string): Promise<ProcessedDataPembimbing> {
  const result: ProcessedDataPembimbing = {
    teknik_elektro: { tetap: [], tidak_tetap: [], luar: [] },
    teknik_informatika: { tetap: [], tidak_tetap: [], luar: [] },
    teknik_tenaga_listrik: { tetap: [], tidak_tetap: [], luar: [] },
    teknik_telekomunikasi: { tetap: [], tidak_tetap: [], luar: [] },
    sistem_teknologi_informasi: { tetap: [], tidak_tetap: [], luar: [] },
    teknik_biomedis: { tetap: [], tidak_tetap: [], luar: [] },
    magister_teknik_elektro: { tetap: [], tidak_tetap: [], luar: [] },
    magister_teknik_informatika: { tetap: [], tidak_tetap: [], luar: [] },
    doktor_elektro_informatika: { tetap: [], tidak_tetap: [], luar: [] },
    ppi_elektro: { tetap: [], tidak_tetap: [], luar: [] },
    ppi_informatika: { tetap: [], tidak_tetap: [], luar: [] },
  }

  const workbook = XLSX.readFile(filePath)

  for (const sheetName of workbook.SheetNames) {
    if (sheetName === "TPB STEI-K" || sheetName === "TPB STEI-R") {
      continue
    }

    const programKey = sheetToProgramMap[sheetName] as keyof ProcessedDataPembimbing
    if (!programKey) {
      console.warn(`Unknown sheet: ${sheetName}`)
      continue
    }

    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json<{
      NIM: string
      "Nama Mahasiswa": string
      "Fakultas / Prodi / Kelas": string
      Pembimbing: string
    }>(worksheet)

    const studentGroups: {
      nim: string
      nama: string
      fakultas_prodi_kelas: string
      kelas: string
      pembimbings: string[]
    }[] = []

    let currentStudent: {
      nim: string
      nama: string
      fakultas_prodi_kelas: string
      kelas: string
      pembimbings: string[]
    } | null = null

    let lastNIM = ""
    let lastNama = ""
    let lastFPK = ""

    for (const row of data) {
      if (row["NIM"] && row["Nama Mahasiswa"] && row["Fakultas / Prodi / Kelas"]) {
        if (currentStudent) {
          studentGroups.push(currentStudent)
        }

        const { kelas } = extractClassInfo(row["Fakultas / Prodi / Kelas"])

        currentStudent = {
          nim: String(row["NIM"]),
          nama: row["Nama Mahasiswa"],
          fakultas_prodi_kelas: row["Fakultas / Prodi / Kelas"],
          kelas,
          pembimbings: [row["Pembimbing"]],
        }

        lastNIM = String(row["NIM"])
        lastNama = row["Nama Mahasiswa"]
        lastFPK = row["Fakultas / Prodi / Kelas"]
      } else if (row["Pembimbing"] && (!row["NIM"] || !row["Nama Mahasiswa"] || !row["Fakultas / Prodi / Kelas"])) {
        if (currentStudent) {
          currentStudent.pembimbings.push(row["Pembimbing"])
        } else if (lastNIM && lastNama && lastFPK) {
          const { kelas } = extractClassInfo(lastFPK)
          currentStudent = {
            nim: lastNIM,
            nama: lastNama,
            fakultas_prodi_kelas: lastFPK,
            kelas,
            pembimbings: [row["Pembimbing"]],
          }
        }
      }
    }

    if (currentStudent) {
      studentGroups.push(currentStudent)
    }

    const lecturerToStudents = new Map<string, Student2>()

    for (const student of studentGroups) {
      const validPembimbings = student.pembimbings.filter((p) => p !== "Belum ada")

      if (validPembimbings.length === 0) {
        continue 
      }

      const advisorRoles =
        validPembimbings.length === 1
          ? ["Pemb. Tunggal"]
          : validPembimbings.map((_, index) => (index === 0 ? "Pemb. 1/Utama" : `Pemb. ${index + 1}/Pendamping`))

      for (let i = 0; i < validPembimbings.length; i++) {
        const lecturer = validPembimbings[i]
        if (lecturer === "Belum ada") continue
        if (!lecturerToStudents.has(lecturer)) {
          lecturerToStudents.set(lecturer, {
            nim: [],
            nama: [],
            fakultas_prodi_kelas: [],
            kelas: [],
            jabatan: [],
          })
        }

        const lecturerData = lecturerToStudents.get(lecturer)!
        lecturerData.nim.push(student.nim)
        lecturerData.nama.push(student.nama)
        lecturerData.fakultas_prodi_kelas.push(student.fakultas_prodi_kelas)
        lecturerData.kelas.push(student.kelas)
        lecturerData.jabatan.push(advisorRoles[i])
      }
    }

    for (const [lecturerName, students] of lecturerToStudents.entries()) {
      if (lecturerName === "Belum ada") {
        continue
      }

      const cleanLecturerName = lecturerName.includes(" - ") ? lecturerName.split(" - ")[0].trim() : lecturerName

      const { category, group, instansi } = await categorizeLecturer(lecturerName)

      const nip = await getLecturerNIP(cleanLecturerName)

      const sortedIndices = students.nim
        .map((_, index) => index)
        .sort((a, b) => students.nim[a].localeCompare(students.nim[b]))

      const sortedNim = sortedIndices.map((i) => students.nim[i])
      const sortedMhs = sortedIndices.map((i) => students.nama[i])
      const sortedKelas = sortedIndices.map((i) => students.kelas[i])
      const sortedJabatan = sortedIndices.map((i) => students.jabatan[i])

      const lecturerEntry: DosenWithStudents = {
        no: 0,
        nama_dosen: cleanLecturerName,
        nip_dosen: nip,
        nim: sortedNim,
        mhs: sortedMhs,
        kelas: sortedKelas,
        jabatan: sortedJabatan,
        asal: [],
      }

      if (category === "luar") {
        let instansiValue = instansi || ""
        // For debugging
        // console.log("Lecturer:", lecturerName)
        // console.log("Category:", category)
        // console.log("Extracted instansi:", instansiValue)

      const instansiArray = Array(sortedNim.length).fill(instansiValue);
      lecturerEntry.asal = Array.from(new Set(instansiArray));
      }
      if (category === "tetap") {
        let kkGroup = result[programKey].tetap.find((g) => g.kk === mapKK(group))
        if (!kkGroup) {
          kkGroup = { kk: mapKK(group), isi: [] }
          result[programKey].tetap.push(kkGroup)
        }

        lecturerEntry.no = kkGroup.isi.length + 1
        kkGroup.isi.push(lecturerEntry)
      } else if (category === "tidak_tetap") {
        let jenisGroup = result[programKey].tidak_tetap.find((g) => g.jenis === group)
        if (!jenisGroup) {
          jenisGroup = { jenis: group, isi: [] }
          result[programKey].tidak_tetap.push(jenisGroup)
        }

        lecturerEntry.no = jenisGroup.isi.length + 1
        jenisGroup.isi.push(lecturerEntry)
      } else if (category === "luar") {
        let luarGroup = result[programKey].luar.find((g) => g.jenis === group)
        if (!luarGroup) {
          luarGroup = { jenis: group, isi: [] }
          result[programKey].luar.push(luarGroup)
        }

        lecturerEntry.no = luarGroup.isi.length + 1
        luarGroup.isi.push(lecturerEntry)
      }
    }

    for (const kkGroup of result[programKey].tetap) {
      kkGroup.isi.sort((a, b) => a.nama_dosen.localeCompare(b.nama_dosen))
      kkGroup.isi.forEach((dosen, index) => {
        dosen.no = index + 1
      })
    }

    for (const jenisGroup of result[programKey].tidak_tetap) {
      jenisGroup.isi.sort((a, b) => a.nama_dosen.localeCompare(b.nama_dosen))
      jenisGroup.isi.forEach((dosen, index) => {
        dosen.no = index + 1
      })
    }

    for (const luarGroup of result[programKey].luar) {
      luarGroup.isi.sort((a, b) => a.nama_dosen.localeCompare(b.nama_dosen))
      luarGroup.isi.forEach((dosen, index) => {
        dosen.no = index + 1
      })
    }

    result[programKey].tetap.sort((a, b) => a.kk.localeCompare(b.kk))
    result[programKey].tidak_tetap.sort((a, b) => a.jenis.localeCompare(b.jenis))
    result[programKey].luar.sort((a, b) => a.jenis.localeCompare(b.jenis))
  }
  console.log("Processed Data:", JSON.stringify(result, null, 2));
  return result
}