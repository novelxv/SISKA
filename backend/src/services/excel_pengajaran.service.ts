"use client"

import * as XLSX from "xlsx"
import { JenisKepegawaian, PrismaClient, KelompokKeahlian } from "@prisma/client"

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

interface ExcelRow {
  NO: number
  KODE: string
  "MATA KULIAH": string
  SKS: string
  "NO KELAS": string
  KUOTA: string
  "JML PESERTA": string
  DOSEN: string
  "SKS SIX": string
  "SKS DOSEN": string
  KETERANGAN: string
  PEMBATASAN: string
}

interface DosenData {
  no: number
  nama_dosen: string
  nip_dosen: string
  sks_six: string[]
  sks_riil: string[]
  kode: string[]
  matkul: string[]
  sks: string[]
  kelas: string[]
  peserta: string[]
  jabatan: string[]
  keterangan: string[]
}

interface KKGroup {
  kk: string
  isi: DosenData[]
}

interface JenisGroup {
  jenis: string
  isi: DosenData[]
}

interface ProdiResult {
  tetap: KKGroup[]
  tidak_tetap: JenisGroup[]
  luar: JenisGroup[]
}

async function getNIPDosen(namaWithGelar: string): Promise<string> {
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

async function getInstansiAsal(namaWithGelar: string): Promise<string> {
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

// Fungsi untuk menentukan kategori dosen
async function getDosenCategory(
  namaWithGelar: string,
): Promise<"tetap" | "tidak_tetap_peneliti" | "tidak_tetap_pengajar" | "luar_stei" | "luar_itb"> {
    const dosen = await prisma.dosen.findFirst({
      where: {
        nama_plus_gelar: namaWithGelar,
      },
      select: {
        jenis_kepegawaian: true,
      },
    })
  if (dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_TAK_TETAP_PENELITI) {
    return "tidak_tetap_peneliti"
  } else if (dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_TAK_TETAP_PENGAJAR) {
    return "tidak_tetap_pengajar"
  } else if (dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_LUAR_STEI) {
    return "luar_stei"
  } else if (dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_INDUSTRI || dosen?.jenis_kepegawaian === JenisKepegawaian.DOSEN_LUAR_ITB) {
    return "luar_itb"
  } else {
    return "tetap"
  }
}

// Fungsi untuk menentukan KK berdasarkan kode mata kuliah
async function getKK(nama: string): Promise<string> {
    const dosen = await prisma.dosen.findFirst({
      where: {
        nama_plus_gelar: nama,
      },
      select: {
        KK: true,
      },
    })
    
    if (dosen?.KK === KelompokKeahlian.ELEKTRONIKA) {
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
    return "KK Lainnya"
}

// Fungsi untuk menghilangkan gelar dari nama
function removeGelar(namaWithGelar: string): string {
  const gelarPattern = /(Ir\.|Dr\.|Prof\.|S\.T\.?|M\.T\.?|M\.Eng\.?|M\.Sc\.?|Ph\.D\.?|M\.Si\.?|S\.Si\.?)/gi
  return namaWithGelar.replace(gelarPattern, "").replace(/,/g, "").trim()
}

// Fungsi untuk mengurutkan dosen berdasarkan nama tanpa gelar
function sortDosenByName(dosenList: DosenData[]): DosenData[] {
  return dosenList.sort((a, b) => {
    const nameA = removeGelar(a.nama_dosen)
    const nameB = removeGelar(b.nama_dosen)
    return nameA.localeCompare(nameB)
  })
}

// Fungsi untuk mengelompokkan data berdasarkan mata kuliah dan kelas
function groupByMatkulKelas(rows: ExcelRow[]): Map<string, ExcelRow[]> {
  const grouped = new Map<string, ExcelRow[]>()

  rows.forEach((row) => {
    const key = `${row.KODE}-${row["NO KELAS"]}`
    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(row)
  })

  return grouped
}

// Fungsi untuk menentukan jabatan dosen
function assignJabatan(dosenRows: ExcelRow[]): string[] {
  if (dosenRows.length === 1) {
    return [""]
  }

  return dosenRows.map((_, index) => `Dosen ${index + 1}`)
}

// Fungsi utama untuk memproses file Excel
export async function processExcelPengajaran(filePath: string): Promise<Record<string, ProdiResult>> {
  const result: Record<string, ProdiResult> = {}

  // Inisialisasi struktur untuk semua prodi
  Object.values(PRODI_MAPPING).forEach((prodi) => {
    result[prodi] = {
      tetap: [],
      tidak_tetap: [],
      luar: [],
    }
  })

  try {
    // Membaca file Excel
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet)

    // Ekstrak kode prodi dari nama file
    const fileName = filePath.split("/").pop() || ""
    const kodeProdi = fileName.substring(0, 3)
    const namaProdi = PRODI_MAPPING[kodeProdi]

    if (!namaProdi) {
      throw new Error(`Kode prodi ${kodeProdi} tidak ditemukan`)
    }

    // Kelompokkan data berdasarkan mata kuliah dan kelas
    const groupedData = groupByMatkulKelas(data)

    // Map untuk menyimpan data dosen yang sudah diproses
    const dosenMap = new Map<string, DosenData>()

    // Proses setiap grup mata kuliah-kelas
    for (const [matkulKelas, rows] of groupedData) {
      const jabatanList = assignJabatan(rows)

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const namaDosenKey = row.DOSEN

        // Dapatkan NIP dari database
        const nip = await getNIPDosen(row.DOSEN)

        if (!dosenMap.has(namaDosenKey)) {
          dosenMap.set(namaDosenKey, {
            no: 0,
            nama_dosen: row.DOSEN,
            nip_dosen: nip,
            sks_six: [],
            sks_riil: [],
            kode: [],
            matkul: [],
            sks: [],
            kelas: [],
            peserta: [],
            jabatan: [],
            keterangan: [],
          })
        }

        const dosenData = dosenMap.get(namaDosenKey)!
        dosenData.sks_six.push(row["SKS SIX"] || "");
        dosenData.sks_riil.push(row["SKS DOSEN"] || "");
        dosenData.kode.push(row.KODE || "");
        dosenData.matkul.push(row["MATA KULIAH"] || "");
        dosenData.sks.push(row.SKS || "");
        dosenData.kelas.push(row["NO KELAS"] || "");
        dosenData.peserta.push(row["JML PESERTA"] || "");
        dosenData.jabatan.push(jabatanList[i] || "");
        dosenData.keterangan.push(row.KETERANGAN || "");
      }
    }

    // Konversi map ke array dan urutkan
    const dosenArray = Array.from(dosenMap.values())
    const sortedDosen = sortDosenByName(dosenArray)

    // Set nomor urut setelah sorting
    sortedDosen.forEach((dosen, index) => {
      dosen.no = index + 1
    })

    // Kelompokkan dosen berdasarkan kategori
    const tetapMap = new Map<string, DosenData[]>()
    const tidakTetapMap = new Map<string, DosenData[]>()
    const luarMap = new Map<string, DosenData[]>()

    for (const dosen of sortedDosen) {
      const category = await getDosenCategory(dosen.nama_dosen)

      if (category === "tetap") {
        const kk = await getKK(dosen.nama_dosen)
        if (!tetapMap.has(kk)) {
          tetapMap.set(kk, [])
        }
        tetapMap.get(kk)!.push(dosen)
      } else if (category.startsWith("tidak_tetap")) {
        const jenis = category === "tidak_tetap_peneliti" ? "Dosen Tidak Tetap Peneliti" : "Dosen Tidak Tetap Pengajar"
        if (!tidakTetapMap.has(jenis)) {
          tidakTetapMap.set(jenis, [])
        }
        tidakTetapMap.get(jenis)!.push(dosen)
      } else if (category.startsWith("luar")) {
        const jenis = category === "luar_stei" ? "Dosen Luar STEI" : "Dosen Luar ITB"
        if (!luarMap.has(jenis)) {
          luarMap.set(jenis, [])
        }
        luarMap.get(jenis)!.push(dosen)

        // Untuk dosen luar, tambahkan instansi asal ke keterangan
        const instansi = await getInstansiAsal(dosen.nama_dosen)
        if (instansi) {
          dosen.keterangan = dosen.keterangan.map((k) => k || instansi)
        }
      }
    }

    // Konversi ke format output
    result[namaProdi].tetap = Array.from(tetapMap.entries()).map(([kk, isi]) => {
      const sortedIsi = sortDosenByName(isi)
      sortedIsi.forEach((dosen, index) => {
        dosen.no = index + 1
      })
      return {
        kk,
        isi: sortedIsi,
      }
    })

    result[namaProdi].tidak_tetap = Array.from(tidakTetapMap.entries()).map(([jenis, isi]) => {
      const sortedIsi = sortDosenByName(isi)
      sortedIsi.forEach((dosen, index) => {
        dosen.no = index + 1
      })
      return {
        jenis,
        isi: sortedIsi,
      }
    })

    result[namaProdi].luar = Array.from(luarMap.entries()).map(([jenis, isi]) => {
      const sortedIsi = sortDosenByName(isi)
      sortedIsi.forEach((dosen, index) => {
        dosen.no = index + 1
      })
      return {
        jenis,
        isi: sortedIsi,
      }
    })
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error)
    throw error
  }

  return result
}

// Fungsi untuk memproses semua file Excel
export async function processAllExcelFiles(basePath: string): Promise<Record<string, ProdiResult>> {
  const kodeProdiList = ["132", "135", "180", "181", "182", "183", "232", "235", "332", "932", "935"]
  const allResults: Record<string, ProdiResult> = {}

  // Inisialisasi struktur untuk semua prodi
  Object.values(PRODI_MAPPING).forEach((prodi) => {
    allResults[prodi] = {
      tetap: [],
      tidak_tetap: [],
      luar: [],
    }
  })

  for (const kodeProdi of kodeProdiList) {
    const filePath = `${basePath}/${kodeProdi}-excel-pengajaran.xlsx`

    try {
      const result = await processExcelPengajaran(filePath)
      const namaProdi = PRODI_MAPPING[kodeProdi]

      if (namaProdi && result[namaProdi]) {
        allResults[namaProdi] = result[namaProdi]
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error)
    }
  }

  return allResults
}
