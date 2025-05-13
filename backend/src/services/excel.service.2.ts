import * as XLSX from 'xlsx';
import path from 'path';
import * as fs from 'fs';
import { getDosenPengajaran } from "./dosen.service";

type ProgramStudi =
  | "teknik_elektro"
  | "teknik_informatika"
  | "teknik_tenaga_listrik"
  | "teknik_telekomunikasi"
  | "sistem_teknologi_informasi"
  | "teknik_biomedis"
  | "magister_teknik_elektro"
  | "magister_teknik_informatika"
  | "doktor_elektro_informatika"
  | "ppi_elektro"
  | "ppi_informatika";

type Category = "tetap" | "tidak_tetap" | "luar";

type ParsedDosen = {
  nama_dosen: string;
  sks_six: string;
};

type DosenData = {
  no: string;
  nama_dosen: string;
  nip_dosen: string | null;
  sks_six: string[];
  sks_riil: string[];
  kode: string[];
  matkul: string[];
  sks: string[];
  kelas: string[];
  peserta: string[];
  jabatan: string[];
  keterangan: string[];
};

type DosenMapEntry = {
  category: Category;
  kk: string;
  nama_dosen: string;
  nip_dosen: string | null;
  sks_six: string[];
  sks_riil: string[];
  kode: string[];
  matkul: string[];
  sks: string[];
  kelas: string[];
  peserta: string[];
  jabatan: string[];
  keterangan: string[];
  jenis_kepegawaian?: string;
};

type KKGroup = {
  kk: string;
  isi: DosenData[];
};

type JenisGroup = {
  jenis: string;
  isi: DosenData[];
};

// Mapping functions from your code
const programStudiMapping: { [key: string]: ProgramStudi } = {
  "132": "teknik_elektro",
  "135": "teknik_informatika",
  "180": "teknik_tenaga_listrik",
  "181": "teknik_telekomunikasi",
  "182": "sistem_teknologi_informasi",
  "183": "teknik_biomedis",
  "232": "magister_teknik_elektro",
  "235": "magister_teknik_informatika",
  "332": "doktor_elektro_informatika",
  "932_EL": "ppi_elektro",
  "932_IF": "ppi_informatika"
};

const jenisKepegawaianMapping: { [key: string]: Category } = {
  DOSEN_TETAP: "tetap",
  DOSEN_TAK_TETAP_PENGAJAR: "tidak_tetap",
  DOSEN_TAK_TETAP_PENELITI: "tidak_tetap",
  DOSEN_LUAR_STEI: "luar",
  DOSEN_LUAR_ITB: "luar",
  DOSEN_INDUSTRI: "luar",
  ASISTEN_AKADEMIK: "tidak_tetap",
  TUTOR: "tidak_tetap",
};

const parseDosen = (dosenText: string): ParsedDosen[] => {
  if (!dosenText) return [];
  
  const dosenList = dosenText.includes("\n") ? dosenText.split("\n") : [dosenText];
  return dosenList.map(dosen => {
    const regex = /(.*?)\s*\((\d+(?:\.\d+)?)\s*SKS\)/i;
    const match = regex.exec(dosen.trim());
    
    if (match) {
      return {
        nama_dosen: match[1].trim(),
        sks_six: match[2]
      };
    }
    return { nama_dosen: dosen.trim(), sks_six: "" };
  });
};

const extractProgramStudiCode = (filename: string): string => {
  const basename = path.basename(filename);
  const parts = basename.split('_');
  
  if (parts.length >= 3 && parts[1].length === 2) {
    return `${parts[0]}_${parts[1]}`;
  } else {
    return parts[0];
  }
};

const parseExcelData = async (filePath: string) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    const programStudiCode = extractProgramStudiCode(filePath);
    const programStudi = programStudiMapping[programStudiCode];
    
    if (!programStudi) {
      throw new Error(`Program studi dengan kode ${programStudiCode} tidak ditemukan`);
    }
    
    const dosenMap = new Map<string, DosenMapEntry>();
    
    for (const row of data) {
      const { NO, KODE, MATA_KULIAH, SKS, NO_KELAS, KUOTA, JML_PESERTA, DOSEN, KETERANGAN, PEMBATASAN } = row as any;
      
      console.log(KODE)
      console.log(MATA_KULIAH)
      console.log(SKS)

      const dosenList = parseDosen(DOSEN);
      
      for (const [index, dosen] of dosenList.entries()) {
        const dosenInfo = await getDosenPengajaran(dosen.nama_dosen);
        
        if (!dosenInfo) continue;
        
        if (dosenInfo.jenis_kepegawaian) {
          const category = jenisKepegawaianMapping[dosenInfo.jenis_kepegawaian] || "luar";
          const kk = dosenInfo.kk || "";
          
          const dosenKey = `${category}|${kk}|${dosen.nama_dosen}`;
          
          if (!dosenMap.has(dosenKey)) {
            dosenMap.set(dosenKey, {
              category,
              kk,
              nama_dosen: dosen.nama_dosen,
              nip_dosen: dosenInfo.nip_dosen,
              sks_six: [],
              sks_riil: [],
              kode: [],
              matkul: [],
              sks: [],
              kelas: [],
              peserta: [],
              jabatan: [],
              keterangan: [],
              jenis_kepegawaian: dosenInfo.jenis_kepegawaian
            });
          }
          
          const dosenData = dosenMap.get(dosenKey);
          if (dosenData && dosen.sks_six) dosenData.sks_six.push(dosen.sks_six);
          if (dosenData) {
            dosenData.kode.push(KODE);
            dosenData.matkul.push(MATA_KULIAH);
            dosenData.sks.push(SKS);
            dosenData.kelas.push(NO_KELAS);
            dosenData.peserta.push(JML_PESERTA);
            dosenData.keterangan.push(KETERANGAN || "");
            
            dosenData.jabatan.push(`Dosen ${index + 1}`);
          }
        }
      }
    }
    
    const kkMap = new Map<string, KKGroup>();
    const jenisMap = new Map<string, JenisGroup>();
    const luar: DosenData[] = [];
    
    let tetapCounter = 0;
    let tidakTetapCounter = 0;
    let luarCounter = 0;
    
    for (const [key, data] of dosenMap.entries()) {
      const { category, kk, jenis_kepegawaian, ...dosenData } = data;
      
      let no = "1";
      if (category === "tetap") {
        tetapCounter++;
        no = String(tetapCounter);
      } else if (category === "tidak_tetap") {
        tidakTetapCounter++;
        no = String(tidakTetapCounter);
      } else {
        luarCounter++;
        no = String(luarCounter);
      }
      
      const dosenEntry: DosenData = {
        no,
        ...dosenData
      };
      
      if (category === "tetap") {
        if (!kkMap.has(kk)) {
          kkMap.set(kk, {
            kk,
            isi: []
          });
        }
        const kkGroup = kkMap.get(kk);
        if (kkGroup) {
          kkGroup.isi.push(dosenEntry);
        }
      } else if (category === "tidak_tetap") {
        let jenis = "Dosen Tidak Tetap";
        
        if (data.nama_dosen.toLowerCase().includes("asisten")) {
          jenis = "Asisten Akademik";
        } else if (data.nama_dosen.toLowerCase().includes("tutor")) {
          jenis = "Tutor";
        } else if (jenis_kepegawaian === "DOSEN_TAK_TETAP_PENELITI") {
          jenis = "Dosen Tidak Tetap Peneliti";
        } else if (jenis_kepegawaian === "DOSEN_TAK_TETAP_PENGAJAR") {
          jenis = "Dosen Tidak Tetap Pengajar";
        }
        
        if (!jenisMap.has(jenis)) {
          jenisMap.set(jenis, {
            jenis,
            isi: []
          });
        }
        const jenisGroup = jenisMap.get(jenis);
        if (jenisGroup) {
          jenisGroup.isi.push(dosenEntry);
        }
      } else {
        luar.push(dosenEntry);
      }
    }
    
    const result: any = {};
    
    result[programStudi] = {
      tetap: Array.from(kkMap.values()),
      tidak_tetap: Array.from(jenisMap.values()),
      luar
    };
    
    return result;
  } catch (error) {
    console.error("Error parsing Excel data:", error);
    throw error;
  }
};

// const filePath = "132_pengajaran.xlsx";

// debugExcelParsing(filePath);
// viewResultSimple(filePath);
// const filePath = "132_pengajaran.xlsx";
// parseExcelData(filePath).then(tabel => {
//   console.log("Tabel berhasil dibuat dengan struktur variabel:");
//   console.log(tabel);
  
// }).catch(err => {
//   console.error("Error:", err);
// });