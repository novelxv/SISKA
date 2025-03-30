import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as XLSX from 'xlsx';
import * as fs from "fs";

const prisma = new PrismaClient();

interface Dosen {
    No: string;
    namaTanpaGelar: string;    
    namaDenganGelar: string;    
    nidn: string;             
    nopeg: string;             
    kk: string;                
    jenisKepegawaian: string;     
    pangkat: string;             
    golongan: string;             
    jabatanFungsional: string;    
    statusKepegawaian: string;    
    aktifMulai: string;         
    aktifSampai: string;          
  }

  const readExcelDosen = (fPath: string): Dosen[] => {
    const file = fs.readFileSync(fPath);
    const workbook = XLSX.read(file, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
  
    return data.map((row: any) => ({
      namaTanpaGelar: row['Nama tanpa Gelar'],
      namaDenganGelar: row['Nama + Gelar'],
      nidn: row['NIDN'],
      nopeg: row['Nopeg'],
      kk: row['KK'],
      jenisKepegawaian: row['Jenis Kepegawaian'],
      pangkat: row['Pangkat'],
      golongan: row['Golongan'],
      jabatanFungsional: row['Jabatan Fungsional'],
      statusKepegawaian: row['Status Kepegawaian'],
      aktifMulai: row['Aktif Mulai'],
      aktifSampai: row['Aktif Sampai'],
    })) as Dosen[];
};

async function main() {
    const hashedPassword = await bcrypt.hash('akademik123', 10);
    const dosen = readExcelDosen("./sheets/sheets_pengajaran.xlsx");
    
    for (const row of dosen) {
        await prisma.dosen.create({
          data: {
            nama_tanpa_gelar: row.namaTanpaGelar,
            nama_plus_gelar: row.namaDenganGelar,
            NIDN: String(row.nidn),
            NIP: String(row.nopeg),
            // soon

          },
        });
      }

    // await prisma.user.create({
    //     data: {
    //         username: 'akademik',
    //         password: hashedPassword,
    //         role: 'AKADEMIK',
    //     },
    // });
    console.log('User created');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });