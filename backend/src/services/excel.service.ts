// import { PrismaClient } from "@prisma/client"
// import * as XLSX from "xlsx"

// const prisma = new PrismaClient()

// // Main function to parse Excel files
// export async function parseExcelFile(file: File, templateType: string): Promise<any> {
//   try {
//     const arrayBuffer = await file.arrayBuffer()
//     const workbook = XLSX.read(arrayBuffer, { type: "buffer" })

//     switch (templateType) {
//       case "pengajaran":
//         return await parsePengajaranTemplate(workbook)
//       case "pembimbing-penguji":
//         return await parsePembimbingPengujiTemplate(workbook)
//       case "dosen-wali":
//         return await parseDosenWaliTemplate(workbook)
//       case "asisten-perkuliahan":
//         return await parseAsistenPerkuliahanTemplate(workbook)
//       default:
//         throw new Error("Template type not recognized")
//     }
//   } catch (error) {
//     console.error("Error parsing Excel file:", error)
//     throw error
//   }
// }

// // Parse Pengajaran template
// async function parsePengajaranTemplate(workbook: XLSX.WorkBook): Promise<any> {
//   const sheet = workbook.Sheets[workbook.SheetNames[0]]
//   const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })

//   // Skip header row
//   const rows = data.slice(1) as any[]
//   const results = []

//   // Mapping prefix ke kode prodi
//   const prodiMapping: { [key: string]: string } = {
//     "IF": "135",
//     "EL": "132",
//     "II": "182",
//     "ET": "181",
//     "EP": "180",
//     "EB": "183"
//   };

//   for (const row of rows) {
//     // if (!row[1] || !row[2]) continue
//     const kodeMatkulPrefix = row[1].substring(0, 2);
//     const kodeProdi = prodiMapping[kodeMatkulPrefix];

//     try {
//       // Create or update matkul
//       const mataKuliah = await prisma.mataKuliah.upsert({
//         where: { kode_matkul: row[1] },
//         update: {
//           mata_kuliah: row[2],
//           sks: Number.parseInt(row[3]) || 0,
//           no_kelas: row[4]?.toString() || "",
//           kuota: Number.parseInt(row[5]) || 0,
//           jumlah_peserta: Number.parseInt(row[6]) || 0,
//           dosen_pengampu: row[7] || "",
//           pembatasan: row[11] || "",
//           kode_prodi: kodeProdi,
//         },
//         create: {
//           kode_matkul: row[1],
//           mata_kuliah: row[2],
//           sks: Number.parseInt(row[3]) || 0,
//           no_kelas: row[4]?.toString() || "",
//           kuota: Number.parseInt(row[5]) || 0,
//           jumlah_peserta: Number.parseInt(row[6]) || 0,
//           dosen_pengampu: row[7] || "",
//           pembatasan: row[11] || "",
//           kode_prodi: kodeProdi,
//         },
//       })

//       // Find or create Dosen
//       let dosen = await prisma.dosen.findFirst({
//         where: { nama_plus_gelar: row[7] },
//       })

//       if (!dosen && row[7]) {
//         dosen = await prisma.dosen.create({
//           data: {
//             nama_plus_gelar: row[7],
//             nama_tanpa_gelar: row[7].split(",")[0] || row[7],
//             status_kepegawaian: "AKTIF",
//           },
//         })
//       }

//       // Create DosenMatkul relationship if both exist
//       if (dosen && mataKuliah) {
//         await prisma.dosenMatkul.upsert({
//           where: {
//             id_dosen_kode_matkul: {
//               id_dosen: dosen.id_dosen,
//               kode_matkul: mataKuliah.kode_matkul,
//             },
//           },
//           update: {
//             beban_riil: Number.parseFloat(row[9]) || 0,
//             jabatan: row[9] || "Dosen 1",
//             sks_six: Number.parseInt(row[8]) || 0,
//           },
//           create: {
//             id_dosen: dosen.id_dosen,
//             kode_matkul: mataKuliah.kode_matkul,
//             beban_riil: Number.parseFloat(row[9]) || 0,
//             jabatan: row[9] || "Dosen 1",
//             sks_six: Number.parseInt(row[8]) || 0,
//           },
//         })
//       }

//       results.push(mataKuliah)
//     } catch (error) {
//       console.error(`Error processing row ${row[0]}:`, error)
//     }
//   }

//   return { success: true, count: results.length, data: results }
// }

// // Parse Pembimbing & Penguji template
// async function parsePembimbingPengujiTemplate(workbook: XLSX.WorkBook): Promise<any> {
//   const sheet = workbook.Sheets[workbook.SheetNames[0]]
//   const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })

//   // Skip header row
//   const rows = data.slice(1) as any[]
//   const results = { mahasiswa: [], pembimbing: [], penguji: [] }

//   const header = data[0] as String[]
//   const pembimbing = header.filter((col) => col.includes('Pembimbing'))
//   const penguji = header.filter((col) => col.includes('Penguji'))

//   for (const row of rows) {
//     // if (!row[1] || !row[2]) continue

//     try {
//       // Create or update Mahasiswa
//       const mahasiswa = await prisma.mahasiswa.upsert({
//         where: { NIM: row[1] },
//         update: {
//           nama: row[2],
//           jurusan: "DEFAULT",
//           NIP_doswal: "DEFAULT",
//         },
//         create: {
//           NIM: row[1],
//           nama: row[2],
//           jurusan: "DEFAULT",
//           NIP_doswal: "DEFAULT",
//         },
//       })

//       results.mahasiswa.push(mahasiswa)

//       // Parse tanggal sidang
//       let tanggalSidang
//       try {
//         tanggalSidang = row[3] ? new Date(row[3]) : new Date()
//       } catch (e) {
//         tanggalSidang = new Date()
//       }

//       // ngeproses pembimbing secara dinamis
//       pembimbing.forEach(async (col, index) => {
//         const colIndex = header.indexOf(col)
//         if (row[colIndex]) {
//           // Find or create Dosen for Pembimbing
//           let dosen = await prisma.dosen.findFirst({
//             where: { nama_plus_gelar: row[colIndex] },
//           })

//           if (!dosen) {
//             dosen = await prisma.dosen.create({
//               data: {
//                 nama_plus_gelar: row[colIndex],
//                 nama_tanpa_gelar: row[colIndex].split(",")[0] || row[colIndex],
//                 status_kepegawaian: "AKTIF",
//               },
//             })
//           }

//           // ngeproses penguji secara dinamis
//           const pembimbing = await prisma.pembimbing.upsert({
//             where: {
//               id_dosen: dosen.id_dosen,
//             },
//             update: {
//               NIM: mahasiswa.NIM,
//               jabatan: `Pembimbing ${index + 1}`,
//               tanggal_sidang: tanggalSidang,
//             },
//             create: {
//               id_dosen: dosen.id_dosen,
//               NIM: mahasiswa.NIM,
//               jabatan: `Pembimbing ${index + 1}`,
//               tanggal_sidang: tanggalSidang,
//             },
//           })

//           results.pembimbing.push(pembimbing)
//         }
//       })

//       penguji.forEach(async (col, index) => {
//         const colIndex = header.indexOf(col)
//         if (row[colIndex]) {
//           // Find or create Dosen for Penguji
//           let dosen = await prisma.dosen.findFirst({
//             where: { nama_plus_gelar: row[colIndex] },
//           })

//           if (!dosen) {
//             dosen = await prisma.dosen.create({
//               data: {
//                 nama_plus_gelar: row[colIndex],
//                 nama_tanpa_gelar: row[colIndex].split(",")[0] || row[colIndex],
//                 status_kepegawaian: "AKTIF",
//               },
//             })
//           }

//           // Create Penguji relationship
//           const penguji = await prisma.penguji.upsert({
//             where: {
//               id_dosen: dosen.id_dosen,
//             },
//             update: {
//               NIM: mahasiswa.NIM,
//               jabatan: `Penguji ${index + 1}`,
//               tanggal_sidang: tanggalSidang,
//             },
//             create: {
//               id_dosen: dosen.id_dosen,
//               NIM: mahasiswa.NIM,
//               jabatan: `Penguji ${index + 1}`,
//               tanggal_sidang: tanggalSidang,
//             },
//           })

//           results.penguji.push(penguji)
//         }
//       })
//     } catch (error) {
//       console.error(`Error processing row ${row[0]}:`, error)
//     }
//   }

//   return {
//     success: true,
//     counts: {
//       mahasiswa: results.mahasiswa.length,
//       pembimbing: results.pembimbing.length,
//       penguji: results.penguji.length,
//     },
//     data: results,
//   }
// }

// // Parse Dosen Wali template
// async function parseDosenWaliTemplate(workbook: XLSX.WorkBook): Promise<any> {
//   const results = { dosen: [], mahasiswa: [] }

//   // Iterate through each sheet in the workbook
//   for (const sheetName of workbook.SheetNames) {
//     const sheet = workbook.Sheets[sheetName]
//     const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })

//     // Skip header row
//     const rows = data.slice(1) as any[]

//     let currentDosen: any = null

//     for (const row of rows) {
//       try {
//         // If there is a dosen's name in row[3], find or use the existing dosen
//         if (row[3]) {
//           currentDosen = await prisma.dosen.findFirst({
//             where: {
//               nama_tanpa_gelar: row[3], // Match dosen by their name without the title
//             },
//           })

//           // If no dosen is found, skip this row (you can handle it differently if needed)
//           if (!currentDosen) {
//             console.warn(`Dosen with name ${row[3]} not found in the database.`)
//             continue // Skip processing this row if dosen is not found
//           }
//         }

//         // If there's a student NIM and name, and we have a valid currentDosen
//         if (row[0] && row[1] && currentDosen) {
//           // Create or update Mahasiswa with the current dosen as wali
//           const mahasiswa = await prisma.mahasiswa.upsert({
//             where: { NIM: row[0] },
//             update: {
//               nama: row[1],
//               jurusan: sheetName, // Assuming sheet name represents the jurusan
//               NIP_doswal: currentDosen.NIP, // Link the dosen as NIP_doswal
//             },
//             create: {
//               NIM: row[2],
//               nama: row[3],
//               jurusan: sheetName, // Use sheet name as jurusan
//               NIP_doswal: currentDosen.NIP, // Link the dosen as NIP_doswal
//             },
//           })

//           results.mahasiswa.push(mahasiswa)
//         }
//       } catch (error) {
//         console.error(`Error processing row in sheet ${sheetName}:`, error)
//       }
//     }
//   }

//   return {
//     success: true,
//     counts: {
//       dosen: results.dosen.length,
//       mahasiswa: results.mahasiswa.length,
//     },
//     data: results,
//   }
// }

// // Parse Asisten Perkuliahan template
// async function parseAsistenPerkuliahanTemplate(workbook: XLSX.WorkBook): Promise<any> {
//   const results = { asisten: [], mataKuliah: [] }

//   // Process Asisten Kuliah sheet
//   if (workbook.SheetNames.includes("Asisten Kuliah")) {
//     const sheet = workbook.Sheets["Asisten Kuliah"]
//     const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })

//     // Skip header row
//     const rows = data.slice(1) as any[]

//     for (const row of rows) {
//       if (!row[1] || !row[2] || !row[3]) continue // Skip empty rows

//       try {
//         // Find or create Mahasiswa
//         const mahasiswa = await prisma.mahasiswa.upsert({
//           where: { NIM: row[2] },
//           update: {
//             nama: row[1],
//             jurusan: "DEFAULT", // You might need to set this based on the NIM
//             NIP_doswal: "DEFAULT",
//           },
//           create: {
//             NIM: row[2],
//             nama: row[1],
//             jurusan: "DEFAULT", // You might need to set this based on the NIM
//             NIP_doswal: "DEFAULT",
//           },
//         })

//         // Find or create MataKuliah
//         const mataKuliah = await prisma.mataKuliah.upsert({
//           where: { kode_matkul: row[3] },
//           update: {
//             mata_kuliah: row[4] || "",
//             sks: Number.parseInt(row[6]) || 0,
//             no_kelas: row[5] || "",
//             kuota: 0,
//             jumlah_peserta: Number.parseInt(row[8]) || 0,
//             dosen_pengampu: row[7] || "",
//             pembatasan: "",
//             kode_prodi: "DEFAULT",
//           },
//           create: {
//             kode_matkul: row[3],
//             mata_kuliah: row[4] || "",
//             sks: Number.parseInt(row[6]) || 0,
//             no_kelas: row[5] || "",
//             kuota: 0,
//             jumlah_peserta: Number.parseInt(row[8]) || 0,
//             dosen_pengampu: row[7] || "",
//             pembatasan: "",
//             kode_prodi: "DEFAULT",
//           },
//         })

//         results.mataKuliah.push(mataKuliah)

//         // Create Asisten relationship
//         const asisten = await prisma.asisten.upsert({
//           where: {
//             NIM_kode_matkul: {
//               NIM: mahasiswa.NIM,
//               kode_matkul: mataKuliah.kode_matkul,
//             },
//           },
//           update: {
//             jabatan: "ASISTEN_KULIAH",
//           },
//           create: {
//             NIM: mahasiswa.NIM,
//             kode_matkul: mataKuliah.kode_matkul,
//             jabatan: "ASISTEN_KULIAH",
//           },
//         })

//         results.asisten.push(asisten)
//       } catch (error) {
//         console.error(`Error processing row:`, error)
//       }
//     }
//   }

//   // Process Asisten Praktikum sheet
//   if (workbook.SheetNames.includes("Asisten Praktikum")) {
//     const sheet = workbook.Sheets["Asisten Praktikum"]
//     const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })

//     // Skip header row
//     const rows = data.slice(1) as any[]

//     for (const row of rows) {
//       if (!row[1] || !row[2] || !row[3]) continue // Skip empty rows

//       try {
//         // Find or create Mahasiswa
//         const mahasiswa = await prisma.mahasiswa.upsert({
//           where: { NIM: row[2] },
//           update: {
//             nama: row[1],
//             jurusan: "DEFAULT", // You might need to set this based on the NIM
//             NIP_doswal: "DEFAULT",
//           },
//           create: {
//             NIM: row[2],
//             nama: row[1],
//             jurusan: "DEFAULT", // You might need to set this based on the NIM
//             NIP_doswal: "DEFAULT",
//           },
//         })

//         // Find or create MataKuliah
//         const mataKuliah = await prisma.mataKuliah.upsert({
//           where: { kode_matkul: row[3] },
//           update: {
//             mata_kuliah: row[4] || "",
//             sks: Number.parseInt(row[6]) || 0,
//             no_kelas: row[5] || "",
//             kuota: 0,
//             jumlah_peserta: Number.parseInt(row[8]) || 0,
//             dosen_pengampu: row[7] || "",
//             pembatasan: "",
//             kode_prodi: "DEFAULT",
//           },
//           create: {
//             kode_matkul: row[3],
//             mata_kuliah: row[4] || "",
//             sks: Number.parseInt(row[6]) || 0,
//             no_kelas: row[5] || "",
//             kuota: 0,
//             jumlah_peserta: Number.parseInt(row[8]) || 0,
//             dosen_pengampu: row[7] || "",
//             pembatasan: "",
//             kode_prodi: "DEFAULT",
//           },
//         })

//         results.mataKuliah.push(mataKuliah)

//         // Create Asisten relationship
//         const asisten = await prisma.asisten.upsert({
//           where: {
//             NIM_kode_matkul: {
//               NIM: mahasiswa.NIM,
//               kode_matkul: mataKuliah.kode_matkul,
//             },
//           },
//           update: {
//             jabatan: "ASISTEN_PRAKTIKUM",
//           },
//           create: {
//             NIM: mahasiswa.NIM,
//             kode_matkul: mataKuliah.kode_matkul,
//             jabatan: "ASISTEN_PRAKTIKUM",
//           },
//         })

//         results.asisten.push(asisten)
//       } catch (error) {
//         console.error(`Error processing row:`, error)
//       }
//     }
//   }

//   return {
//     success: true,
//     counts: {
//       asisten: results.asisten.length,
//       mataKuliah: results.mataKuliah.length,
//     },
//     data: results,
//   }
// }
