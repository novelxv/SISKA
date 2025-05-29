import * as XLSX from "xlsx"

type Assistant = {
  no: number
  kode: string
  matkul: string
  sks: string
  kelas: string[]
  asisten: string[]
  nim: string[]
  jabatan: string[]
}

type DepartmentData = {
  [key: string]: Assistant[]
}

export type ProcessedData = {
  kuliah: DepartmentData
  praktikum: DepartmentData
}

export async function processAsistenExcel(filePath: string): Promise<ProcessedData> {
  const result: ProcessedData = {
    kuliah: {
      teknik_elektro: [],
      teknik_informatika: [],
      teknik_tenaga_listrik: [],
      teknik_telekomunikasi: [],
      sistem_teknologi_informasi: [],
      teknik_biomedis: [],
      magister_teknik_elektro: [],
      magister_teknik_informatika: [],
    },
    praktikum: {
      teknik_elektro: [],
      teknik_informatika: [],
      teknik_tenaga_listrik: [],
      teknik_telekomunikasi: [],
      sistem_teknologi_informasi: [],
      teknik_biomedis: [],
      magister_teknik_elektro: [],
      magister_teknik_informatika: [],
    },
  }

  const sheetToDepartment: { [key: string]: string } = {
    "Kuliah-EL": "teknik_elektro",
    "Kuliah-IF": "teknik_informatika",
    "Kuliah-EP": "teknik_tenaga_listrik",
    "Kuliah-ET": "teknik_telekomunikasi",
    "Kuliah-STI": "sistem_teknologi_informasi",
    "Kuliah-EB": "teknik_biomedis",
    "Kuliah-S2-EL": "magister_teknik_elektro",
    "Kuliah-S2-IF": "magister_teknik_informatika",
    "Praktikum-EL": "teknik_elektro",
    "Praktikum-IF": "teknik_informatika",
    "Praktikum-EP": "teknik_tenaga_listrik",
    "Praktikum-ET": "teknik_telekomunikasi",
    "Praktikum-STI": "sistem_teknologi_informasi",
    "Praktikum-EB": "teknik_biomedis",
    "Praktikum-S2-EL": "magister_teknik_elektro",
    "Praktikum-S2-IF": "magister_teknik_informatika",
  }

  const workbook = XLSX.readFile(filePath)

  workbook.SheetNames.forEach((sheetName) => {
    const category = sheetName.startsWith("Kuliah") ? "kuliah" : "praktikum"

    const departmentKey = sheetToDepartment[sheetName]

    if (!departmentKey) {
      console.warn(`Unknown sheet name: ${sheetName}`)
      return
    }

    const worksheet = workbook.Sheets[sheetName]

    const data = XLSX.utils.sheet_to_json(worksheet)

    const courseMap = new Map<
      string,
      {
        kode: string
        matkul: string
        sks: string
        assistants: Array<{
          kelas: string
          nama: string
          nim: string
          jabatan: string
        }>
      }
    >()

    data.forEach((row: any) => {
      let jab = ""

      if (row["Jabatan"] === "Koordinator Asisten Kuliah") {
        jab = "Koordinator"
      } else {
        jab = "Asisten Kuliah"
      }

      const kode = row["Kode Mata Kuliah (sesuai di SIX)"] || ""
      const matkul = row["Nama Mata Kuliah (sesuai di SIX)"] || ""
      const sks = row["SKS Mata Kuliah"] || ""
      const kelas = row["Kelas"] || ""
      const asisten = row["Nama Lengkap (sesuai DIM/SIX)"] || ""
      const nim = row["NIM"] || ""
      const jabatan = jab || ""

      const courseKey = `${kode}-${matkul}`

      if (!courseMap.has(courseKey)) {
        courseMap.set(courseKey, {
          kode,
          matkul,
          sks,
          assistants: [],
        })
      }

      const course = courseMap.get(courseKey)!

      if (asisten && nim) {
        course.assistants.push({
          kelas,
          nama: asisten,
          nim,
          jabatan,
        })
      }
    })

    const sortedCourses = Array.from(courseMap.entries()).sort(([keyA], [keyB]) => {
      const kodeA = courseMap.get(keyA)!.kode
      const kodeB = courseMap.get(keyB)!.kode
      return kodeA.localeCompare(kodeB)
    })

    let courseNumber = 1
    sortedCourses.forEach(([, course]) => {
      course.assistants.sort((a, b) => String(a.nim).localeCompare(String(b.nim)))

      result[category][departmentKey].push({
        no: courseNumber++,
        kode: course.kode,
        matkul: course.matkul,
        sks: course.sks,
        kelas: course.assistants.map((a) => a.kelas),
        asisten: course.assistants.map((a) => a.nama),
        nim: course.assistants.map((a) => String(a.nim)),
        jabatan: course.assistants.map((a) => a.jabatan),
      })
    })
  })

  // console.log("Processed Data:", JSON.stringify(result, null, 2))
  return result
}
