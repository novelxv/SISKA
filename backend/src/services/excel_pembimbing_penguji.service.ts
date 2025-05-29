import * as XLSX from "xlsx"
import path from 'path';
import { PrismaClient, JenisKepegawaian, KelompokKeahlian, StatusKepegawaian } from "@prisma/client"

const prisma = new PrismaClient()

const PRODI_MAPPING: Record<string, string> = {
  "132": "teknik_elektro",
  "135": "teknik_informatika",
  "180": "teknik_tenaga_listrik",
  "181": "teknik_telekomunikasi",
  "182": "sistem_teknologi_informasi",
  "183": "teknik_biomedis",
  "232": "magister_teknik_elektro",
  "235": "magister_teknik_informatika",
  "332": "doktor_elektro_informatika",
  "932": "ppi_elektro",
  "935": "ppi_informatika",
}

interface DosenData {
  no: number
  nama_dosen: string
  nip_dosen: string
  nim: string[]
  mhs: string[]
  tanggal: string[]
  jabatan: string[]
  asal?: string[]
}

interface KKCategory {
  kk: string
  isi: DosenData[]
}

interface JenisCategory {
  jenis: string
  isi: DosenData[]
}

interface ProdiData {
  tetap: KKCategory[]
  tidak_tetap: JenisCategory[]
  luar: JenisCategory[]
}

interface ProcessedData {
  pembimbing: Record<string, ProdiData>
  penguji: Record<string, ProdiData>
}

function removeTitle(nama: string): string {
  return nama
    .replace(/^(Dr\.|Prof\.|Ir\.|Drs\.|Dra\.|S\.T\.|S\.Kom\.|M\.T\.|M\.Kom\.|Ph\.D\.)\s*/gi, "")
    .replace(/\s*(S\.T\.|S\.Kom\.|M\.T\.|M\.Kom\.|Ph\.D\.|Dr\.)$/gi, "")
    .trim()
}

async function getDosenNIP(namaWithGelar: string): Promise<string> {
  try {
    const dosen = await prisma.dosen.findFirst({
      where: {
        nama_plus_gelar: namaWithGelar,
      },
      select: {
        NIP: true,
      },
    })
    return dosen?.NIP || ""
  } catch (error) {
    console.error(`Error getting NIP for ${namaWithGelar}:`, error)
    return ""
  }
}

async function getDosenInstansi(namaWithGelar: string): Promise<string> {
  try {
    const dosen = await prisma.dosen.findFirst({
      where: {
        nama_plus_gelar: namaWithGelar,
      },
      select: {
        instansi_asal: true,
      },
    })
    return dosen?.instansi_asal || ""
  } catch (error) {
    console.error(`Error getting instansi for ${namaWithGelar}:`, error)
    return ""
  }
}

async function categorizeDosenType(namaWithGelar: string): Promise<"tetap" | "tidak_tetap" | "luar" |  "unknown"> {
  try {
    const dosen = await prisma.dosen.findFirst({
      where: {
        nama_plus_gelar: namaWithGelar,
      },
      select: {
        jenis_kepegawaian: true,
      },
    })

    if (dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_TETAP) {
        return "tetap"
    } else if (dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_TAK_TETAP_PENELITI ||
        dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_TAK_TETAP_PENGAJAR
    ) {
        return "tidak_tetap"
    } else if (dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_LUAR_STEI ||
        dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_LUAR_ITB || dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_INDUSTRI
    ) {
        return "luar"
    }
    return "unknown"
  } catch (error) {
    console.error(`Error getting instansi for ${namaWithGelar}:`, error)
    return "unknown"
  }

//   if (namaWithGelar.includes("Tidak Tetap")) {
//     return "tidak_tetap"
//   } else if (namaWithGelar.includes("Luar")) {
//     return "luar"
//   } else {
//     return "tetap"
//   }
}

// Fungsi untuk menentukan KK dosen tetap
async function getDosenKK(namaWithGelar: string): Promise<string> {
    const dosen = await prisma.dosen.findFirst({
      where: {
        nama_plus_gelar: namaWithGelar,
      },
      select: {
        KK: true,
      },
    })

    if (dosen?.KK == KelompokKeahlian.ELEKTRONIKA) {
        return "KK Elektronika"
    } else if (dosen?.KK === KelompokKeahlian.INFORMATIKA) {
        return "KK Informatika"
    } else if (dosen?.KK === KelompokKeahlian.REKAYASA_PERANGKAT_LUNAK_DAN_PENGETAHUAN) {
        return "KK Rekayasa Perangkat Lunak dan Pengetahuan"
    } else if (dosen?.KK === KelompokKeahlian.SISTEM_KENDALI_DAN_KOMPUTER) {
        return "KK Sistem Kendali dan Komputer"
    } else if (dosen?.KK === KelompokKeahlian.TEKNIK_BIOMEDIS) {
        return "KK Teknik Biomedika"
    } else if (dosen?.KK === KelompokKeahlian.TEKNIK_KETENAGALISTRIKAN) {
        return "KK Teknik Ketenagalistrikan"
    } else if (dosen?.KK === KelompokKeahlian.TEKNIK_KOMPUTER) {
        return "KK Teknik Komputer"
    } else if (dosen?.KK === KelompokKeahlian.TEKNIK_TELEKOMUNIKASI) {
        return "KK Teknik Telekomunikasi"
    } else if (dosen?.KK === KelompokKeahlian.TEKNOLOGI_INFORMASI) {
        return "KK Teknologi Informasi"
    }

    return "KK lainnya"
}

// Fungsi untuk menentukan jenis dosen tidak tetap
async function getDosenJenis(namaWithGelar: string): Promise<string> {
    const dosen = await prisma.dosen.findFirst({
      where: {
        nama_plus_gelar: namaWithGelar,
      },
      select: {
        jenis_kepegawaian: true,
      },
    })

  if (dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_TAK_TETAP_PENELITI) {
    return "Dosen Tidak Tetap Peneliti"
  } else {
    return "Dosen Tidak Tetap Pengajar"
  }
}

// Fungsi untuk menentukan jenis dosen luar
async function getDosenLuarJenis(namaWithGelar: string): Promise<string> {
    const dosen = await prisma.dosen.findFirst({
      where: {
        nama_plus_gelar: namaWithGelar,
      },
      select: {
        jenis_kepegawaian: true,
        status_kepegawaian: true,
      },
    })

  if (dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_LUAR_STEI) {
    return "Dosen Luar STEI"
  } else if (dosen?.status_kepegawaian === StatusKepegawaian.TIDAK_AKTIF || dosen?.status_kepegawaian === StatusKepegawaian.PENSIUN || dosen?.status_kepegawaian === StatusKepegawaian.PENSIUN_JANDA_DUDA) {
    return "Dosen Luar ITB"
  } else {
    return "Dosen Luar ITB"
  }
}

// Fungsi untuk membuat jabatan pembimbing
function createPembimbingJabatan(index: number, total: number, isDoktor = false): string {
  if (isDoktor) {
    if (index === 0) return "Promotor"
    return "Co-Promotor"
  }

  if (total === 1) return "Pemb. Tunggal"
  if (index === 0) return "Pemb. 1/Utama"
  return `Pemb. ${index + 1}/Pendamping`
}

function createPengujiJabatan(index: number): string {
  return `Penguji ${index + 1}`
}

// Fungsi utama untuk memproses file Excel
export async function processExcelFile(filePath: string): Promise<ProcessedData> {
  try {
    // Konversi filePath relatif menjadi absolut
    const absoluteFilePath = path.resolve(filePath);

    // Ekstrak kode prodi dari nama file
    const fileName = absoluteFilePath.split(path.sep).pop() || "";
    const kodeProdi = fileName.substring(0, 3);
    const namaProdi = PRODI_MAPPING[kodeProdi];

    if (!namaProdi) {
      throw new Error(`Kode prodi ${kodeProdi} tidak ditemukan`);
    }

    const isDoktor = kodeProdi === "332";

    // Baca file Excel
    const workbook = XLSX.readFile(absoluteFilePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    // Inisialisasi struktur data
    const result: ProcessedData = {
      pembimbing: {
        [namaProdi]: {
          tetap: [],
          tidak_tetap: [],
          luar: [],
        },
      },
      penguji: {
        [namaProdi]: {
          tetap: [],
          tidak_tetap: [],
          luar: [],
        },
      },
    }

    // Map untuk menyimpan data dosen sementara
    const pembimbingMap = new Map<
      string,
      {
        nama: string
        kategori: "tetap" | "tidak_tetap" | "luar" | "unknown"
        subkategori: string
        data: Omit<DosenData, "no" | "nama_dosen" | "nip_dosen">[]
      }
    >()

    const pengujiMap = new Map<
      string,
      {
        nama: string
        kategori: "tetap" | "tidak_tetap" | "luar" | "unknown"
        subkategori: string
        data: Omit<DosenData, "no" | "nama_dosen" | "nip_dosen">[]
      }
    >()

    // Proses setiap baris data
    for (const row of data as any[]) {
      const nim = row["NIM"] || ""
      const namaMhs = row["Nama Mahasiswa"] || ""
      const tanggalSidang = row["Tanggal Sidang"] || ""

      // Proses pembimbing
      const pembimbingCols = Object.keys(row).filter((key) => key.startsWith("Pembimbing"))
      const pembimbingList = pembimbingCols.map((col) => row[col]).filter((value) => value && value !== "-")

      for (let i = 0; i < pembimbingList.length; i++) {
        const namaDosen = pembimbingList[i]
        const kategori = await categorizeDosenType(namaDosen)
        let subkategori = ""

        if (kategori === "tetap") {
          subkategori = await getDosenKK(namaDosen)
        } else if (kategori === "tidak_tetap") {
          subkategori = await getDosenJenis(namaDosen)
        } else if (kategori === "luar") {
          subkategori = await getDosenLuarJenis(namaDosen)
        }

        const key = `${namaDosen}_${kategori}_${subkategori}`

        if (!pembimbingMap.has(key)) {
          pembimbingMap.set(key, {
            nama: namaDosen,
            kategori,
            subkategori,
            data: [],
          })
        }

        const jabatan = createPembimbingJabatan(i, pembimbingList.length, isDoktor)

        pembimbingMap.get(key)!.data.push({
          nim: [nim],
          mhs: [namaMhs],
          tanggal: [tanggalSidang],
          jabatan: [jabatan],
        })
      }

      const pengujiCols = Object.keys(row).filter((key) => key.startsWith("Penguji"))
      const pengujiList = pengujiCols.map((col) => row[col]).filter((value) => value && value !== "-")
      for (let i = 0; i < pengujiList.length; i++) {
        const namaDosen = pengujiList[i]
        const kategori =  await categorizeDosenType(namaDosen)
        let subkategori = ""

        if (kategori === "tetap") {
          subkategori = await getDosenKK(namaDosen)
        } else if (kategori === "tidak_tetap") {
          subkategori = await getDosenJenis(namaDosen)
        } else if (kategori === "luar") {
          subkategori = await getDosenLuarJenis(namaDosen)
        }

        const key = `${namaDosen}_${kategori}_${subkategori}`

        if (!pengujiMap.has(key)) {
          pengujiMap.set(key, {
            nama: namaDosen,
            kategori,
            subkategori,
            data: [],
          })
        }

        const jabatan = createPengujiJabatan(i)

        pengujiMap.get(key)!.data.push({
          nim: [nim],
          mhs: [namaMhs],
          tanggal: [tanggalSidang],
          jabatan: [jabatan],
        })
      }
    }

    // Konversi map ke struktur final dan urutkan
    await processDosenMap(pembimbingMap, result.pembimbing[namaProdi])
    await processDosenMap(pengujiMap, result.penguji[namaProdi])

    return result
  } catch (error) {
    console.error("Error processing Excel file:", error)
    throw error
  }
}

// Fungsi helper untuk memproses map dosen ke struktur final
async function processDosenMap(dosenMap: Map<string, any>, prodiData: ProdiData): Promise<void> {
  const tetapMap = new Map<string, DosenData[]>()
  const tidakTetapMap = new Map<string, DosenData[]>()
  const luarMap = new Map<string, DosenData[]>()

  // Kelompokkan data berdasarkan kategori dan subkategori
  for (const [key, value] of dosenMap) {
    const { nama, kategori, subkategori, data } = value

    // Gabungkan data untuk dosen yang sama
    const consolidatedData = consolidateDosenData(data)

    // Dapatkan NIP dan instansi asal
    const nip = await getDosenNIP(nama)
    const instansiAsal = kategori === "luar" ? await getDosenInstansi(nama) : undefined

    const dosenData: DosenData = {
      no: 0,
      nama_dosen: nama,
      nip_dosen: nip,
      nim: consolidatedData.nim,
      mhs: consolidatedData.mhs,
      tanggal: consolidatedData.tanggal,
      jabatan: consolidatedData.jabatan,
      ...(instansiAsal && { asal: [instansiAsal] }),
    }

    if (kategori === "tetap") {
      if (!tetapMap.has(subkategori)) {
        tetapMap.set(subkategori, [])
      }
      tetapMap.get(subkategori)!.push(dosenData)
    } else if (kategori === "tidak_tetap") {
      if (!tidakTetapMap.has(subkategori)) {
        tidakTetapMap.set(subkategori, [])
      }
      tidakTetapMap.get(subkategori)!.push(dosenData)
    } else if (kategori === "luar") {
      if (!luarMap.has(subkategori)) {
        luarMap.set(subkategori, [])
      }
      luarMap.get(subkategori)!.push(dosenData)
    }
  }

  // Konversi ke struktur final dengan sorting
  prodiData.tetap = Array.from(tetapMap.entries()).map(([kk, dosenList]) => ({
    kk,
    isi: sortAndNumberDosen(dosenList),
  }))

  prodiData.tidak_tetap = Array.from(tidakTetapMap.entries()).map(([jenis, dosenList]) => ({
    jenis,
    isi: sortAndNumberDosen(dosenList),
  }))

  prodiData.luar = Array.from(luarMap.entries()).map(([jenis, dosenList]) => ({
    jenis,
    isi: sortAndNumberDosen(dosenList),
  }))
}

// Fungsi untuk menggabungkan data dosen yang sama
function consolidateDosenData(dataList: any[]): {
  nim: string[]
  mhs: string[]
  tanggal: string[]
  jabatan: string[]
} {
  const nim: string[] = []
  const mhs: string[] = []
  const tanggal: string[] = []
  const jabatan: string[] = []

  for (const data of dataList) {
    nim.push(...data.nim)
    mhs.push(...data.mhs)
    tanggal.push(...data.tanggal)
    jabatan.push(...data.jabatan)
  }

  return { nim, mhs, tanggal, jabatan }
}

// Fungsi untuk mengurutkan dan memberi nomor dosen
function sortAndNumberDosen(dosenList: DosenData[]): DosenData[] {
  // Urutkan berdasarkan nama tanpa gelar
  dosenList.sort((a, b) => {
    const namaA = removeTitle(a.nama_dosen)
    const namaB = removeTitle(b.nama_dosen)
    return namaA.localeCompare(namaB)
  })

  // Beri nomor urut
  return dosenList.map((dosen, index) => ({
    ...dosen,
    no: index + 1,
  }))
}

// Fungsi untuk memproses multiple file
export async function processMultipleExcelFiles(filePaths: string[]): Promise<ProcessedData> {
  const allResults: ProcessedData[] = []

  for (const filePath of filePaths) {
    try {
      const result = await processExcelFile(filePath)
      allResults.push(result)
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error)
    }
  }

  // Gabungkan semua hasil
  return mergeResults(allResults)
}

// Fungsi untuk menggabungkan hasil dari multiple file
function mergeResults(results: ProcessedData[]): ProcessedData {
  const merged: ProcessedData = {
    pembimbing: {},
    penguji: {},
  }

  for (const result of results) {
    // Merge pembimbing
    for (const [prodi, data] of Object.entries(result.pembimbing)) {
      if (!merged.pembimbing[prodi]) {
        merged.pembimbing[prodi] = { tetap: [], tidak_tetap: [], luar: [] }
      }

      merged.pembimbing[prodi].tetap.push(...data.tetap)
      merged.pembimbing[prodi].tidak_tetap.push(...data.tidak_tetap)
      merged.pembimbing[prodi].luar.push(...data.luar)
    }

    // Merge penguji
    for (const [prodi, data] of Object.entries(result.penguji)) {
      if (!merged.penguji[prodi]) {
        merged.penguji[prodi] = { tetap: [], tidak_tetap: [], luar: [] }
      }

      merged.penguji[prodi].tetap.push(...data.tetap)
      merged.penguji[prodi].tidak_tetap.push(...data.tidak_tetap)
      merged.penguji[prodi].luar.push(...data.luar)
    }
  }

  return merged
}
