import { PrismaClient } from "@prisma/client";
import type { Mahasiswa, Pembimbing, Penguji, MataKuliah, Asisten, Dosen } from "@prisma/client";
import * as XLSX from "xlsx";
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Interface untuk hasil parsing
interface PengajaranResult {
  success: boolean;
  count: number;
  data: MataKuliah[];
}

interface PembimbingPengujiResult {
  success: boolean;
  counts: {
    mahasiswa: number;
    pembimbing: number;
    penguji: number;
  };
  data: {
    mahasiswa: Mahasiswa[];
    pembimbing: Pembimbing[];
    penguji: Penguji[];
  };
}

interface DosenWaliResult {
  success: boolean;
  counts: {
    dosen: number;
    mahasiswa: number;
  };
  data: {
    dosen: Dosen[];
    mahasiswa: Mahasiswa[];
  };
}

interface AsistenResult {
  success: boolean;
  counts: {
    asisten: number;
    mataKuliah: number;
  };
  data: {
    asisten: Asisten[];
    mataKuliah: MataKuliah[];
  };
}

// Fungsi untuk menyimpan file ke disk
export async function saveFileToDisk(file: Express.Multer.File, templateType: string): Promise<string> {
  const fileName = `${templateType}_${Date.now()}.xlsx`;
  const filePath = path.join(__dirname, '../uploads', fileName);
  
  // Pastikan direktori uploads ada
  await fs.promises.mkdir(path.join(__dirname, '../uploads'), { recursive: true });
  
  // Tulis file ke disk
  await fs.promises.writeFile(filePath, file.buffer);
    
  return filePath;
}

// Fungsi untuk update status upload
export async function updateUploadStatus(templateType: string, filePath: string): Promise<void> {
  await prisma.uploadStatus.upsert({
    where: { templateType },
    update: { 
      uploaded: true, 
      uploadedAt: new Date(),
      filePath
    },
    create: { 
      templateType, 
      uploaded: true, 
      processed: false,
      uploadedAt: new Date(),
      filePath
    }
  });
}

// Fungsi untuk menentukan apakah file harus diproses sekarang
export async function shouldProcessFile(templateType: string): Promise<boolean> {
  if (templateType === "pengajaran" || templateType === "dosen-wali") {
    // Cek apakah kedua file sudah diupload
    const pengajaranStatus = await prisma.uploadStatus.findUnique({
      where: { templateType: "pengajaran" }
    });
    
    const dosenWaliStatus = await prisma.uploadStatus.findUnique({
      where: { templateType: "dosen-wali" }
    });
    
    // Jika keduanya sudah diupload dan belum diproses, proses sekarang
    return !!(
      pengajaranStatus?.uploaded && 
      dosenWaliStatus?.uploaded && 
      (!pengajaranStatus?.processed || !dosenWaliStatus?.processed)
    );
  } else if (templateType === "pembimbing-penguji" || templateType === "asisten-perkuliahan") {
    // Cek apakah file pengajaran dan dosen-wali sudah diproses
    const pengajaranStatus = await prisma.uploadStatus.findUnique({
      where: { templateType: "pengajaran" }
    });
    
    const dosenWaliStatus = await prisma.uploadStatus.findUnique({
      where: { templateType: "dosen-wali" }
    });
    
    // Jika pengajaran dan dosen-wali sudah diproses, proses file ini sekarang
    return !!(
      pengajaranStatus?.processed && 
      dosenWaliStatus?.processed
    );
  }
  
  return false;
}

// Fungsi untuk memproses file
export async function processFiles(templateType: string): Promise<void> {
  if (templateType === "pengajaran" || templateType === "dosen-wali") {
    // Proses kedua file bersama-sama
    const pengajaranStatus = await prisma.uploadStatus.findUnique({
      where: { templateType: "pengajaran" }
    });
    
    const dosenWaliStatus = await prisma.uploadStatus.findUnique({
      where: { templateType: "dosen-wali" }
    });
    
    if (pengajaranStatus?.uploaded && dosenWaliStatus?.uploaded && pengajaranStatus?.filePath && dosenWaliStatus?.filePath) {
      // Baca file dari disk
      const pengajaranWorkbook = XLSX.readFile(pengajaranStatus.filePath);
      const dosenWaliWorkbook = XLSX.readFile(dosenWaliStatus.filePath);
      
      // Proses file pengajaran terlebih dahulu
      if (!pengajaranStatus.processed) {
        await parsePengajaranTemplate(pengajaranWorkbook);
        
        // Update status
        await prisma.uploadStatus.update({
          where: { templateType: "pengajaran" },
          data: { processed: true, processedAt: new Date() }
        });
      }
      
      // Kemudian proses file dosen-wali
      if (!dosenWaliStatus.processed) {
        await parseDosenWaliTemplate(dosenWaliWorkbook);
        
        // Update status
        await prisma.uploadStatus.update({
          where: { templateType: "dosen-wali" },
          data: { processed: true, processedAt: new Date() }
        });
      }
    }
  } else if (templateType === "pembimbing-penguji") {
    // Proses file pembimbing-penguji
    const status = await prisma.uploadStatus.findUnique({
      where: { templateType }
    });
    
    if (status?.uploaded && !status.processed && status.filePath) {
      // Baca file dari disk
      const workbook = XLSX.readFile(status.filePath);
      
      // Proses file
      await parsePembimbingPengujiTemplate(workbook);
      
      // Update status
      await prisma.uploadStatus.update({
        where: { templateType },
        data: { processed: true, processedAt: new Date() }
      });
    }
  } else if (templateType === "asisten-perkuliahan") {
    // Proses file asisten-perkuliahan
    const status = await prisma.uploadStatus.findUnique({
      where: { templateType }
    });
    
    if (status?.uploaded && !status.processed && status.filePath) {
      // Baca file dari disk
      const workbook = XLSX.readFile(status.filePath);
      
      // Proses file
      await parseAsistenPerkuliahanTemplate(workbook);
      
      // Update status
      await prisma.uploadStatus.update({
        where: { templateType },
        data: { processed: true, processedAt: new Date() }
      });
    }
  }
}

// Fungsi untuk mendapatkan semua status upload
export async function getAllUploadStatuses() {
  return await prisma.uploadStatus.findMany();
}

// Fungsi untuk reset status upload
export async function resetUploadStatus(templateType?: string) {
  if (templateType) {
    // Reset status untuk template tertentu
    return await prisma.uploadStatus.update({
      where: { templateType },
      data: { uploaded: false, processed: false, uploadedAt: null, processedAt: null }
    });
  } else {
    // Reset semua status
    return await prisma.uploadStatus.updateMany({
      data: { uploaded: false, processed: false, uploadedAt: null, processedAt: null }
    });
  }
}

// Parse Pengajaran template
export async function parsePengajaranTemplate(workbook: XLSX.WorkBook): Promise<PengajaranResult> {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Skip header row
  const rows = data.slice(1) as any[];
  const results: MataKuliah[] = [];

  // Mapping prefix ke kode prodi
  const prodiMapping: { [key: string]: string } = {
    "IF": "135",
    "EL": "132",
    "II": "182",
    "ET": "181",
    "EP": "180",
    "EB": "183"
  };

  for (const row of rows) {
    if (!row[1] || !row[2]) continue;
    const kodeMatkulPrefix = row[1].substring(0, 2);
    const kodeProdi = prodiMapping[kodeMatkulPrefix] || "DEFAULT";

    try {
      // Create or update matkul
      const mataKuliah = await prisma.mataKuliah.upsert({
        where: { kode_matkul: row[1] },
        update: {
          mata_kuliah: row[2],
          sks: Number.parseInt(row[3]) || 0,
          no_kelas: row[4]?.toString() || "",
          kuota: Number.parseInt(row[5]) || 0,
          jumlah_peserta: Number.parseInt(row[6]) || 0,
          dosen_pengampu: row[7] || "",
          pembatasan: row[11] || "",
          kode_prodi: kodeProdi,
        },
        create: {
          kode_matkul: row[1],
          mata_kuliah: row[2],
          sks: Number.parseInt(row[3]) || 0,
          no_kelas: row[4]?.toString() || "",
          kuota: Number.parseInt(row[5]) || 0,
          jumlah_peserta: Number.parseInt(row[6]) || 0,
          dosen_pengampu: row[7] || "",
          pembatasan: row[11] || "",
          kode_prodi: kodeProdi,
        },
      });

      let dosen = await prisma.dosen.findFirst({
        where: { nama_plus_gelar: row[7] },
      });

      if (!dosen && row[7]) {
        dosen = await prisma.dosen.create({
          data: {
            nama_plus_gelar: row[7],
            nama_tanpa_gelar: row[7].split(",")[0] || row[7],
            status_kepegawaian: "AKTIF",
          },
        });
      }

      if (dosen && mataKuliah) {
        await prisma.dosenMatkul.upsert({
          where: {
            id_dosen_kode_matkul: {
              id_dosen: dosen.id_dosen,
              kode_matkul: mataKuliah.kode_matkul,
            },
          },
          update: {
            beban_riil: Number.parseFloat(row[9]) || 0,
            jabatan: row[9] || "Dosen 1",
            sks_six: Number.parseInt(row[8]) || 0,
          },
          create: {
            id_dosen: dosen.id_dosen,
            kode_matkul: mataKuliah.kode_matkul,
            beban_riil: Number.parseFloat(row[9]) || 0,
            jabatan: row[9] || "Dosen 1",
            sks_six: Number.parseInt(row[8]) || 0,
          },
        });
      }

      results.push(mataKuliah);
    } catch (error) {
      console.error(`Error processing row ${row[0]}:`, error);
    }
  }

  return { success: true, count: results.length, data: results };
}

// Parse Pembimbing & Penguji template
export async function parsePembimbingPengujiTemplate(workbook: XLSX.WorkBook): Promise<PembimbingPengujiResult> {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Skip header row
  const rows = data.slice(1) as any[];
  
  // Definisikan tipe yang benar untuk array hasil
  const results: {
    mahasiswa: Mahasiswa[],
    pembimbing: Pembimbing[],
    penguji: Penguji[]
  } = {
    mahasiswa: [],
    pembimbing: [],
    penguji: []
  };

  const header = data[0] as string[];
  const pembimbingCols = header.filter((col) => col && col.includes('Pembimbing'));
  const pengujiCols = header.filter((col) => col && col.includes('Penguji'));

  for (const row of rows) {
    if (!row[1] || !row[2]) continue;

    try {
      // Create or update Mahasiswa
      const mahasiswa = await prisma.mahasiswa.upsert({
        where: { NIM: row[1] },
        update: {
          nama: row[2],
          jurusan: "DEFAULT",
          NIP_doswal: "DEFAULT",
        },
        create: {
          NIM: row[1],
          nama: row[2],
          jurusan: "DEFAULT",
          NIP_doswal: "DEFAULT",
        },
      });

      // Sekarang kita bisa push ke array dengan tipe yang benar
      results.mahasiswa.push(mahasiswa);

      // Parse tanggal sidang
      let tanggalSidang;
      try {
        tanggalSidang = row[3] ? new Date(row[3]) : new Date();
      } catch (e) {
        tanggalSidang = new Date();
      }

      // Proses pembimbing
      for (let index = 0; index < pembimbingCols.length; index++) {
        const col = pembimbingCols[index];
        const colIndex = header.indexOf(col);
        if (row[colIndex]) {
          // Find or create Dosen for Pembimbing
          let dosen = await prisma.dosen.findFirst({
            where: { nama_plus_gelar: row[colIndex] },
          });

          if (!dosen) {
            dosen = await prisma.dosen.create({
              data: {
                nama_plus_gelar: row[colIndex],
                nama_tanpa_gelar: row[colIndex].split(",")[0] || row[colIndex],
                status_kepegawaian: "AKTIF",
              },
            });
          }

          const pembimbing = await prisma.pembimbing.upsert({
            where: {
              id_dosen_NIM: {
                id_dosen: dosen.id_dosen,
                NIM: mahasiswa.NIM
              }
            },
            update: {
              jabatan: `Pembimbing ${index + 1}`,
              tanggal_sidang: tanggalSidang,
            },
            create: {
              id_dosen: dosen.id_dosen,
              NIM: mahasiswa.NIM,
              jabatan: `Pembimbing ${index + 1}`,
              tanggal_sidang: tanggalSidang,
            },
          });

          results.pembimbing.push(pembimbing);
        }
      }

      // Proses penguji
      for (let index = 0; index < pengujiCols.length; index++) {
        const col = pengujiCols[index];
        const colIndex = header.indexOf(col);
        if (row[colIndex]) {
          // Find or create Dosen for Penguji
          let dosen = await prisma.dosen.findFirst({
            where: { nama_plus_gelar: row[colIndex] },
          });

          if (!dosen) {
            dosen = await prisma.dosen.create({
              data: {
                nama_plus_gelar: row[colIndex],
                nama_tanpa_gelar: row[colIndex].split(",")[0] || row[colIndex],
                status_kepegawaian: "AKTIF",
              },
            });
          }

          const penguji = await prisma.penguji.upsert({
            where: {
              id_dosen_NIM: {
                id_dosen: dosen.id_dosen,
                NIM: mahasiswa.NIM
              }
            },
            update: {
              jabatan: `Penguji ${index + 1}`,
              tanggal_sidang: tanggalSidang,
            },
            create: {
              id_dosen: dosen.id_dosen,
              NIM: mahasiswa.NIM,
              jabatan: `Penguji ${index + 1}`,
              tanggal_sidang: tanggalSidang,
            },
          });

          results.penguji.push(penguji);
        }
      }
    } catch (error) {
      console.error(`Error processing row ${row[0]}:`, error);
    }
  }

  return {
    success: true,
    counts: {
      mahasiswa: results.mahasiswa.length,
      pembimbing: results.pembimbing.length,
      penguji: results.penguji.length,
    },
    data: results,
  };
}

// Parse Dosen Wali template
export async function parseDosenWaliTemplate(workbook: XLSX.WorkBook): Promise<DosenWaliResult> {

  const results: {
    dosen: Dosen[],
    mahasiswa: Mahasiswa[]
  } = {
    dosen: [],
    mahasiswa: []
  };

  // iterasi per sheet yang ada
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Skip header row
    const rows = data.slice(1) as any[];

    let currentDosen: Dosen | null = null;

    for (const row of rows) {
      try {
        if (row[3]) {
          currentDosen = await prisma.dosen.findFirst({
            where: {
              nama_tanpa_gelar: row[3], 
            },
          });

          // If no dosen is found, skip this row
          if (!currentDosen) {
            console.warn(`Dosen with name ${row[3]} not found in the database.`);
            continue;
          }
        }

        // If there's a student NIM and name, and we have a valid currentDosen
        if (row[0] && row[1] && currentDosen) {
          const mahasiswa = await prisma.mahasiswa.upsert({
            where: { NIM: row[0] },
            update: {
              nama: row[1],
              jurusan: sheetName,
              NIP_doswal: currentDosen.NIP || "DEFAULT",
            },
            create: {
              NIM: row[0],
              nama: row[1],
              jurusan: sheetName, // Use sheet name as jurusan
              NIP_doswal: currentDosen.NIP || "DEFAULT",
            },
          });

          results.mahasiswa.push(mahasiswa);
        }
      } catch (error) {
        console.error(`Error processing row in sheet ${sheetName}:`, error);
      }
    }
  }

  return {
    success: true,
    counts: {
      dosen: results.dosen.length,
      mahasiswa: results.mahasiswa.length,
    },
    data: results,
  };
}

// Parse Asisten Perkuliahan template
export async function parseAsistenPerkuliahanTemplate(workbook: XLSX.WorkBook): Promise<AsistenResult> {

  const results: {
    asisten: Asisten[],
    mataKuliah: MataKuliah[]
  } = {
    asisten: [],
    mataKuliah: []
  };

  // Ngeproses Asisten Kuliah sheet
  if (workbook.SheetNames.includes("Asisten Kuliah")) {
    const sheet = workbook.Sheets["Asisten Kuliah"];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const rows = data.slice(1) as any[];

    for (const row of rows) {
      if (!row[1] || !row[2] || !row[3]) continue;

      try {
        // Find or create Mahasiswa
        const mahasiswa = await prisma.mahasiswa.upsert({
          where: { NIM: row[2] },
          update: {
            nama: row[1],
            jurusan: "DEFAULT",
            NIP_doswal: "DEFAULT",
          },
          create: {
            NIM: row[2],
            nama: row[1],
            jurusan: "DEFAULT",
            NIP_doswal: "DEFAULT",
          },
        });

        const mataKuliah = await prisma.mataKuliah.upsert({
          where: { kode_matkul: row[3] },
          update: {
            mata_kuliah: row[4] || "",
            sks: Number.parseInt(row[6]) || 0,
            no_kelas: row[5] || "",
            kuota: 0,
            jumlah_peserta: Number.parseInt(row[8]) || 0,
            dosen_pengampu: row[7] || "",
            pembatasan: "",
            kode_prodi: "DEFAULT",
          },
          create: {
            kode_matkul: row[3],
            mata_kuliah: row[4] || "",
            sks: Number.parseInt(row[6]) || 0,
            no_kelas: row[5] || "",
            kuota: 0,
            jumlah_peserta: Number.parseInt(row[8]) || 0,
            dosen_pengampu: row[7] || "",
            pembatasan: "",
            kode_prodi: "DEFAULT",
          },
        });

        results.mataKuliah.push(mataKuliah);

        const asisten = await prisma.asisten.upsert({
          where: {
            NIM_kode_matkul: {
              NIM: mahasiswa.NIM,
              kode_matkul: mataKuliah.kode_matkul,
            },
          },
          update: {
            jabatan: "ASISTEN_KULIAH",
            status: "AKTIF",
            nomorHP: "",
            email: "",
            kelas: "",
            DPK: "",
            jamKerja: "",
            namaTabungan: "",
            namaBank: "",
            nomorRekening: "",
            nomorNikKtp: "",
            alamatKtp: "",
            nomorNpwp: "",
            uploadKtm: "",
            uploadKtp: "",
            uploadHalamanBukuTabungan: "",
            uploadSuratPernyataan: "",
            uploadLogbook: ""
          },
          create: {
            NIM: mahasiswa.NIM,
            kode_matkul: mataKuliah.kode_matkul,
            jabatan: "ASISTEN_KULIAH",
            status: "AKTIF",
            nomorHP: "",
            email: "",
            kelas: "",
            DPK: "",
            jamKerja: "",
            namaTabungan: "",
            namaBank: "",
            nomorRekening: "",
            nomorNikKtp: "",
            alamatKtp: "",
            nomorNpwp: "",
            uploadKtm: "",
            uploadKtp: "",
            uploadHalamanBukuTabungan: "",
            uploadSuratPernyataan: "",
            uploadLogbook: ""
          },
        });

        results.asisten.push(asisten);
      } catch (error) {
        console.error(`Error processing row:`, error);
      }
    }
  }

  if (workbook.SheetNames.includes("Asisten Praktikum")) {
    const sheet = workbook.Sheets["Asisten Praktikum"];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const rows = data.slice(1) as any[];

    for (const row of rows) {
      if (!row[1] || !row[2] || !row[3]) continue;

      try {
        // Find or create Mahasiswa
        const mahasiswa = await prisma.mahasiswa.upsert({
          where: { NIM: row[2] },
          update: {
            nama: row[1],
            jurusan: "DEFAULT",
            NIP_doswal: "DEFAULT",
          },
          create: {
            NIM: row[2],
            nama: row[1],
            jurusan: "DEFAULT",
            NIP_doswal: "DEFAULT",
          },
        });

        const mataKuliah = await prisma.mataKuliah.upsert({
          where: { kode_matkul: row[3] },
          update: {
            mata_kuliah: row[4] || "",
            sks: Number.parseInt(row[6]) || 0,
            no_kelas: row[5] || "",
            kuota: 0,
            jumlah_peserta: Number.parseInt(row[8]) || 0,
            dosen_pengampu: row[7] || "",
            pembatasan: "",
            kode_prodi: "DEFAULT",
          },
          create: {
            kode_matkul: row[3],
            mata_kuliah: row[4] || "",
            sks: Number.parseInt(row[6]) || 0,
            no_kelas: row[5] || "",
            kuota: 0,
            jumlah_peserta: Number.parseInt(row[8]) || 0,
            dosen_pengampu: row[7] || "",
            pembatasan: "",
            kode_prodi: "DEFAULT",
          },
        });

        results.mataKuliah.push(mataKuliah);

        const asisten = await prisma.asisten.upsert({
          where: {
            NIM_kode_matkul: {
              NIM: mahasiswa.NIM,
              kode_matkul: mataKuliah.kode_matkul,
            },
          },
          update: {
            jabatan: "ASISTEN_PRAKTIKUM",
            status: "AKTIF",
            nomorHP: "",
            email: "",
            kelas: "",
            DPK: "",
            jamKerja: "",
            namaTabungan: "",
            namaBank: "",
            nomorRekening: "",
            nomorNikKtp: "",
            alamatKtp: "",
            nomorNpwp: "",
            uploadKtm: "",
            uploadKtp: "",
            uploadHalamanBukuTabungan: "",
            uploadSuratPernyataan: "",
            uploadLogbook: ""
          },
          create: {
            NIM: mahasiswa.NIM,
            kode_matkul: mataKuliah.kode_matkul,
            jabatan: "ASISTEN_PRAKTIKUM",
            status: "AKTIF",
            nomorHP: "",
            email: "",
            kelas: "",
            DPK: "",
            jamKerja: "",
            namaTabungan: "",
            namaBank: "",
            nomorRekening: "",
            nomorNikKtp: "",
            alamatKtp: "",
            nomorNpwp: "",
            uploadKtm: "",
            uploadKtp: "",
            uploadHalamanBukuTabungan: "",
            uploadSuratPernyataan: "",
            uploadLogbook: ""
          },
        });

        results.asisten.push(asisten);
      } catch (error) {
        console.error(`Error processing row:`, error);
      }
    }
  }

  return {
    success: true,
    counts: {
      asisten: results.asisten.length,
      mataKuliah: results.mataKuliah.length,
    },
    data: results,
  };
}