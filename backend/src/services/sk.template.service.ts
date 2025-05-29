import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { PrismaClient } from "@prisma/client";
import { processMultipleExcelFiles } from "./excel_pembimbing_penguji.service";
import { ProcessedData, processAsistenExcel } from "./excel_asisten.service";
import { processDosenWaliTPBExcel } from "./excel_dosen_wali.service";
import { processDosenWaliMahasiswaAktifExcel } from "./excel_dosen_wali.service";
import { processDosenPembimbingExcel, ProcessedDataPembimbing } from "./excel_pembimbing_aktif.service";
import { processAllExcelFiles } from "./excel_pengajaran.service";

const prisma = new PrismaClient();

async function getPengajaranData() {
    const filePath = path.join(__dirname, "../../public/uploads/excel/excel_pengajaran");

    try {
      const result = await processAllExcelFiles(filePath)
      return result
  } catch (error) {
      return {
        teknik_elektro: {
            tetap: [
                {
                    kk: "KK Elektronika",
                    isi: [
                        {no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]},
                        {no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]},
                    ]
                },
                {
                    kk: "KK Sistem Kendali & Komputer",
                    isi: [
                        {
                            no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                        },
                        {
                            no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                        },
                    ]
                },
                {
                    kk: "KK Teknik Ketenagalistrikan",
                    isi: [
                        {
                            no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", sks_six: ["3", "3", "3", "1,5"], sks_riil: ["3", "3", "3", "1,5"], kode: ["EL2006", "EL4021", "EL4060", "EL4090"], matkul: ["Material Teknik Elektro", "Devais Semikonduktor", "Pengembangan Keprofesian dan Komunitas", "Proposal Proyek Akhir"], sks: ["3", "3", "3", "3"], kelas: ["3", "1", "1", "2"], peserta: ["37", "42", "7", "39"], jabatan: ["", "", "", "Dosen 1"], keterangan: ["", "", "", ""]
                        },
                        {
                            no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", sks_six: ["1", "4", "1", "1"], sks_riil: ["1", "4", "1", "1"], kode: ["EL1200", "EL2002", "EL2102", "EL2102"], matkul: ["Pengantar Analisis Rangkaian", "Sistem Digital", "Praktikum Sistem Digital", "Praktikum Sistem Digital"], sks: ["2", "4", "1", "1"], kelas: ["1", "1", "1", "2"], peserta: ["27", "40", "62", "62"], jabatan: ["Dosen 1", "", "", ""], keterangan: ["", "", "", ""]
                        },
                    ]
                }
            ],
            tidak_tetap: [
                {
                    jenis: "Dosen Tidak Tetap Peneliti",
                    isi: [
                        {
                            no: 1, nama_dosen: "Indra Sihar, S.T., M.Sc., Ph.D.", nip_dosen: "223121011", sks_six: ["2,9"], sks_riil: ["2,9"], kode: ["EL3010"], matkul: ["Pengolahan Sinyal Digital"], sks: ["3"], kelas: ["3"], peserta: ["43"], jabatan: ["Dosen 2"], keterangan: ["STEI ITB"]
                        },
                    ]
                },
                {
                    jenis: "Dosen Tidak Tetap Pengajar",
                    isi: [
                        {
                            no: 1, nama_dosen: "Indra Sihar, S.T., M.Sc., Ph.D.", nip_dosen: "223121011", sks_six: ["2,9"], sks_riil: ["2,9"], kode: ["EL3010"], matkul: ["Pengolahan Sinyal Digital"], sks: ["3"], kelas: ["3"], peserta: ["43"], jabatan: ["Dosen 2"], keterangan: ["STEI ITB"]
                        },
                    ]
                }
            ],
            luar: []
        },
        teknik_informatika: {},
        teknik_tenaga_listrik: {},
        teknik_telekomunikasi: {},
        sistem_teknologi_informasi: {},
        teknik_biomedis: {},
        magister_teknik_elektro: {},
        magister_teknik_informatika: {},
        doktor_elektro_informatika: {},
        ppi_elektro: {},
        ppi_informatika: {}
      }
  }
}

type WaliTPBData = {
    steik: Array<{
        nama_dosen: string;
        nip_dosen: string;
        no: number[];
        nim: string[];
        mhs: string[];
    }>;
    steir: Array<{
        nama_dosen: string;
        nip_dosen: string;
        no: number[];
        nim: string[];
        mhs: string[];
    }>;
    inter: Array<{
        nama_dosen: string;
        nip_dosen: string;
        no: number[];
        nim: string[];
        mhs: string[];
    }>;
};

async function getWaliTPBData(): Promise<WaliTPBData> {
  const filePath = path.join(__dirname, "../../public/uploads/excel/excel_dosen_wali/excel-dosen-wali.xlsx");
  try {
    const result = await processDosenWaliTPBExcel(filePath);
    return result;
  } catch (error) {
    console.error("Error getting TPB data:", error);
    
    return {
      steik: [
        {nama_dosen: 'Arrival Dwi Sentosa, S.Kom., M.T.', nip_dosen: '223122016', no: [1, 2, 3], nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.']},
        {nama_dosen: 'Atina Putri, S.Kom., M.T.', nip_dosen: '223122017', no: [1, 2], nim: ['19624058', '19624059'], mhs: ['Forza Derian', 'Mikhael Andrian Yonatan']},
      ],
      steir: [
        {nama_dosen: 'Arrival Dwi Sentosa, S.Kom., M.T.', nip_dosen: '223122016', no: [1, 2, 3], nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.']},
        {nama_dosen: 'Atina Putri, S.Kom., M.T.', nip_dosen: '223122017', no: [1, 2], nim: ['19624058', '19624059'], mhs: ['Forza Derian', 'Mikhael Andrian Yonatan']},
      ],
      inter: [
        {nama_dosen: 'Arrival Dwi Sentosa, S.Kom., M.T.', nip_dosen: '223122016', no: [1, 2, 3], nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.']},
        {nama_dosen: 'Atina Putri, S.Kom., M.T.', nip_dosen: '223122017', no: [1, 2], nim: ['19624058', '19624059'], mhs: ['Forza Derian', 'Mikhael Andrian Yonatan']},
      ]
    };
  }
}

type WaliAktifData = {
  teknik_elektro: { dosen: Array<{ kk: string; isi: Array<any> }> };
  teknik_informatika: { dosen: Array<{ kk: string; isi: Array<any> }> };
  teknik_tenaga_listrik: { dosen: Array<{ kk: string; isi: Array<any> }> };
  teknik_telekomunikasi: { dosen: Array<{ kk: string; isi: Array<any> }> };
  sistem_teknologi_informasi: { dosen: Array<{ kk: string; isi: Array<any> }> };
  teknik_biomedis: { dosen: Array<{ kk: string; isi: Array<any> }> };
  magister_teknik_elektro: { dosen: Array<{ kk: string; isi: Array<any> }> };
  magister_teknik_informatika: { dosen: Array<{ kk: string; isi: Array<any> }> };
  doktor_elektro_informatika: { dosen: Array<{ kk: string; isi: Array<any> }> };
  ppi_elektro: { dosen: Array<{ kk: string; isi: Array<any> }> };
  ppi_informatika: { dosen: Array<{ kk: string; isi: Array<any> }> };
};

export async function getWaliAktifData(): Promise<WaliAktifData> {
  const filePath = path.join(__dirname, "../../public/uploads/excel/excel_dosen_wali/excel-dosen-wali.xlsx");
  try {
    const result = await processDosenWaliMahasiswaAktifExcel(filePath);
    return result;
  } catch (error) {
    return {
      teknik_elektro: {
        dosen: [
          {
            kk: "KK Elektronika",
            isi: [
              {no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.']},
              {no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.']},
            ]
          },
          {
            kk: "KK Sistem Kendali & Komputer",
            isi: [
              {no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.']},
              {no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.']},
            ]
          },
        ],
      },
      teknik_informatika: { dosen: [] },
      teknik_tenaga_listrik: { dosen: [] },
      teknik_telekomunikasi: { dosen: [] },
      sistem_teknologi_informasi: { dosen: [] },
      teknik_biomedis: { dosen: [] },
      magister_teknik_elektro: { dosen: [] },
      magister_teknik_informatika: { dosen: [] },
      doktor_elektro_informatika: { dosen: [] },
      ppi_elektro: { dosen: [] },
      ppi_informatika: { dosen: [] }
    };
  }
}



export async function getPembimbingAktifData(): Promise<ProcessedDataPembimbing> {
  const filePath = path.join(__dirname, "../../public/uploads/excel/excel_pembimbing_aktif/excel-pembimbing-aktif.xlsx");
  try {
    const result = await processDosenPembimbingExcel(filePath);
    return result;
  } catch (error) {
    console.error("Error getting active pembimbing data:", error);
    
    return {
      teknik_elektro: {
        tetap: [
          {
            kk: "KK Elektronika",
            isi: [
              {
                no: 1, nama_dosen: "AAA", nip_dosen: "123", nim: ["12345678", "12345678"], mhs: ["ABC", "ABC"], kelas: ["", ""], jabatan: ["jabatan", "jabatan"]
              },
              {
                no: 2, nama_dosen: "AAA", nip_dosen: "123", nim: ["12345678", "12345678"], mhs: ["ABC", "ABC"], kelas: ["", ""], jabatan: ["jabatan", "jabatan"]
              }
            ]
          },
          {
            kk: "KK Informatika",
            isi: [
              {
                no: 1, nama_dosen: "AAA", nip_dosen: "123", nim: ["12345678", "12345678"], mhs: ["ABC", "ABC"], kelas: ["", ""], jabatan: ["jabatan", "jabatan"]
              },
              {
                no: 2, nama_dosen: "AAA", nip_dosen: "123", nim: ["12345678", "12345678"], mhs: ["ABC", "ABC"], kelas: ["", ""], jabatan: ["jabatan", "jabatan"]
              }
            ]
          }
        ],
        tidak_tetap: [
          {
            jenis: "Dosen Tidak Tetap Pengajar",
            isi: [
              {
                no: 1, nama_dosen: "AAA", nip_dosen: "123", nim: ["12345678", "12345678"], mhs: ["ABC", "ABC"], kelas: ["", ""], jabatan: ["jabatan", "jabatan"]
              },
              {
                no: 2, nama_dosen: "AAA", nip_dosen: "123", nim: ["12345678", "12345678"], mhs: ["ABC", "ABC"], kelas: ["", ""], jabatan: ["jabatan", "jabatan"]
              }
            ]
          },
          {
            jenis: "Dosen Tidak Tetap Peneliti",
            isi: [
              {
                no: 1, nama_dosen: "AAA", nip_dosen: "123", nim: ["12345678", "12345678"], mhs: ["ABC", "ABC"], kelas: ["", ""], jabatan: ["jabatan", "jabatan"]
              },
              {
                no: 2, nama_dosen: "AAA", nip_dosen: "123", nim: ["12345678", "12345678"], mhs: ["ABC", "ABC"], kelas: ["", ""], jabatan: ["jabatan", "jabatan"]
              }
            ]
          },
        ],
        luar: [
          {
            jenis: "Dosen Luar STEI",
            isi: [
              {
                no: 1, nama_dosen: "AAA", nip_dosen: "123", nim: ["12345678", "12345678"], mhs: ["ABC", "ABC"], kelas: ["", ""], jabatan: ["jabatan", "jabatan"], asal: ["", ""]
              },
              {
                no: 2, nama_dosen: "AAA", nip_dosen: "123", nim: ["12345678", "12345678"], mhs: ["ABC", "ABC"], kelas: ["", ""], jabatan: ["jabatan", "jabatan"], asal: ["", ""]
              }
            ]
          },
          {
            jenis: "Dosen Luar ITB",
            isi: [
              {
                no: 1, nama_dosen: "AAA", nip_dosen: "123", nim: ["12345678", "12345678"], mhs: ["ABC", "ABC"], kelas: ["", ""], jabatan: ["jabatan", "jabatan"], asal: ["", ""]
              },
              {
                no: 2, nama_dosen: "AAA", nip_dosen: "123", nim: ["12345678", "12345678"], mhs: ["ABC", "ABC"], kelas: ["", ""], jabatan: ["jabatan", "jabatan"], asal: ["", ""]
              }
            ]
          },
        ]
      },
      teknik_informatika: { tetap: [], tidak_tetap: [], luar: [] },
      teknik_tenaga_listrik: { tetap: [], tidak_tetap: [], luar: [] },
      teknik_telekomunikasi: { tetap: [], tidak_tetap: [], luar: [] },
      sistem_teknologi_informasi: { tetap: [], tidak_tetap: [], luar: [] },
      teknik_biomedis: { tetap: [], tidak_tetap: [], luar: [] },
      magister_teknik_elektro: { tetap: [], tidak_tetap: [], luar: [] },
      magister_teknik_informatika: { tetap: [], tidak_tetap: [], luar: [] },
      doktor_elektro_informatika: { tetap: [], tidak_tetap: [], luar: [] },
      ppi_elektro: { tetap: [], tidak_tetap: [], luar: [] },
      ppi_informatika: { tetap: [], tidak_tetap: [], luar: [] }
    };
  }
}

export async function getPembimbingPengujiData() {
  const filePath = path.join(__dirname, "../../public/uploads/excel/excel_pembimbing_penguji");

  try {
      const files = fs.readdirSync(filePath);
      const excelFiles = files.filter(file => file.endsWith('.xlsx') || file.endsWith('.xls'));
      const filePaths = excelFiles.map(file => path.join(filePath, file));
    const result = await processMultipleExcelFiles(filePaths)
    return result
  } catch (error) {
      return {
          pembimbing: {
              teknik_elektro: {
                  tetap: [
                      {
                          kk: "KK Elektronika",
                          isi: [
                              {no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 1/Utama', 'Pemb. 1/Utama', 'Pemb. 1/Utama']},
                              {no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 2/Pendamping', 'Pemb. 1/Utama', 'Pemb. 1/Utama']},
                          ]
                      },
                      {
                          kk: "KK Sistem Kendali & Komputer",
                          isi: [
                              {no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 1/Utama', 'Pemb. 1/Utama', 'Pemb. 1/Utama']},
                              {no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 1/Utama', 'Pemb. 1/Utama', 'Pemb. 1/Utama']},
                          ]
                      }
                  ],
                  tidak_tetap: [
                      {
                          jenis: "Dosen Tidak Tetap Peneliti",
                          isi: [
                              {no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 1/Utama', 'Pemb. 1/Utama', 'Pemb. 1/Utama']},
                              {no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 1/Utama', 'Pemb. 1/Utama', 'Pemb. 1/Utama']},
                          ]
                      },
                  ],
                  luar: [
                      {
                          jenis: "Dosen Industri",
                          isi: [
                              {no: 1, nama_dosen: "Ir. Akhmadi Surawijaya, S.T, M. Eng.", nip_dosen: "118110068", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 1/Utama', 'Pemb. 1/Utama', 'Pemb. 1/Utama'], asal: 'Instansi'},
                              {no: 2, nama_dosen: "Ir. Arif Sasongko, S.T, M.T, Ph.D.", nip_dosen: "19761025 200604 1 001", nim: ['19624039', '19624040', '19624041'], mhs: ['Nisrina Zakiyah', 'Yumna Fathonah Kautsar', 'Dzakwan Muhammad K. P. P.'], tanggal: ['1 Januari 2025', '1 Januari 2025', '1 Januari 2025'], jabatan: ['Pemb. 1/Utama', 'Pemb. 1/Utama', 'Pemb. 1/Utama'], asal: 'Instansi'},
                          ]
                      },
                  ]
              },
              teknik_informatika: {},
              teknik_tenaga_listrik: {},
              teknik_telekomunikasi: {},
              sistem_teknologi_informasi: {},
              teknik_biomedis: {},
              magister_teknik_elektro: {},
              magister_teknik_informatika: {},
              doktor_elektro_informatika: {},
              ppi_elektro: {},
              ppi_informatika: {}
          },
          penguji: {}
      }
  }
}

async function getAsistenData(): Promise<ProcessedData> {
  const filePath = path.join(__dirname, "../../public/uploads/excel/excel_asisten/excel-asisten.xlsx");
  try {
    const result = await processAsistenExcel(filePath); 
    return result
  } catch (error) {
    console.error('Error in getAsistenData:', error);
    return {
      kuliah: {
        teknik_elektro: [],
        teknik_informatika: [],
        teknik_tenaga_listrik: [],
        teknik_telekomunikasi: [],
        sistem_teknologi_informasi: [],
        teknik_biomedis: [],
        magister_teknik_elektro: [],
        magister_teknik_informatika: [],
        doktor_elektro_informatika: [],
        ppi_elektro: [],
        ppi_informatika: []
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
        doktor_elektro_informatika: [],
        ppi_elektro: [],
        ppi_informatika: []
      },
    };
  }
}

export const generateSKPreviewService = async (data: {
    no_sk: string;
    judul: string;
    jenis_sk: string;
    semester: number;
    tahun_akademik: number | null;
    tanggal: string;
    NIP_dekan: string;
    nama_dekan: string;
}) => {
    const templatePath = path.resolve(
        __dirname,
        `../templates/sk_${data.jenis_sk.toLowerCase().replace(/\s+/g, "_")}.docx`
    );
    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const expressionParser = require("docxtemplater/expressions.js");

    const ImageModule = require("docxtemplater-image-module-free");

    const imageModule = new ImageModule({
      centered: false,
      getImage: function (tagValue: string) {
        return fs.readFileSync(tagValue);
      },
      getSize: function () {
        return [120, 80];
      }
    });

    function convertDate(dateStr: string) {
        if (dateStr.length == 0) {
            return ""
        }
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
    
        return `${day} ${month} ${year}`;
    }

    const tahun_str1 = data.tahun_akademik? data.tahun_akademik.toString() : ""
    const tahun_str2 = (data.tahun_akademik? data.tahun_akademik + 1 : "")?.toString()
    var semester = ""
    if (data.jenis_sk == "PEMBIMBING_PENGUJI") {
        if (data.semester == 1) {
            semester = "Wisuda Pertama (Bulan Oktober)"
        } else if (data.semester == 2) {
            semester = "Wisuda Kedua (Bulan April)"
        } else {
            semester = ""
        }
    } else {
        semester = "I".repeat(data.semester)
    }

    const ttdPath = fs.existsSync(`./public/uploads/ttd/${data.NIP_dekan}.png`) ? `./public/uploads/ttd/${data.NIP_dekan}.png` : `./public/uploads/ttd/placeholder_ttd.png`;

    var tabel = {}
    if (data.jenis_sk == "PENGAJARAN") {
        tabel = await getPengajaranData()
    } else if (data.jenis_sk == "WALI_TPB") {
        tabel = await getWaliTPBData()
    } else if (data.jenis_sk == "PEMBIMBING_AKTIF") {
        tabel = await getPembimbingAktifData()
    } else if (data.jenis_sk == "PEMBIMBING_PENGUJI") {
        tabel = await getPembimbingPengujiData()
    } else if (data.jenis_sk == "WALI_MHS_AKTIF") {
        tabel = await getWaliAktifData()
    } else if (data.jenis_sk == "ASISTEN_PRAKTIKUM") {
        tabel = await getAsistenData()
    } 

    const doc = new Docxtemplater(zip, { parser: expressionParser, modules: [imageModule], paragraphLoop: true, linebreaks: true });
    try {
        doc.render(
            {
                no_sk: data.no_sk,
                judul: data.judul,
                semester_upper: semester.toUpperCase(),
                semester: semester,
                tahun_akademik: tahun_str1 + "/" + tahun_str2,
                tahun1: tahun_str1,
                tahun2: tahun_str2,
                tanggal: convertDate(data.tanggal),
                nama_dekan: data.nama_dekan,
                nip_dekan: data.NIP_dekan,
                ttd: ttdPath,
                tabel: tabel
            }
        );
    } catch (error) {
        throw new Error("Gagal render template");
    }

    return doc.getZip().generate({ type: "nodebuffer" });
};