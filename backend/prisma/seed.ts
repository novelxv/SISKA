import { PrismaClient, KelompokKeahlian, JenisKepegawaian, JabatanFungsional, StatusKepegawaian } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as XLSX from 'xlsx';
import * as fs from "fs";

const prisma = new PrismaClient();

interface Dosen {
    No: string;
    namaTanpaGelar: string;    
    namaDenganGelar: string;    
    nidn: string | undefined;             
    nopeg: string | undefined;             
    kk: string | undefined;                
    jenisKepegawaian: string | undefined;     
    pangkat: string | undefined;             
    golongan: string | undefined;             
    jabatanFungsional: string | undefined;    
    statusKepegawaian: string;    
    aktifMulai: string | undefined;         
    aktifSampai: string | undefined;        
    asalInstansi: string | undefined;  
  }

    const fakultas = ['FMIPA', 'SITH', 'SF', 'FITB', 'FTTM', 'FTSL', 'FTI', 'FSRD', 'FTMD', 'SBM', 'SAPPK'];


    const mapIA = (ia: string): string | undefined => {
        if (fakultas.includes(ia)) {
            return ia;
        } else {
            return undefined;
        }
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
      asalInstansi: mapIA(row['KK']),
    })) as Dosen[];
};

const mapKKToEnum = (kk: string | undefined): KelompokKeahlian | undefined => {
    if (!kk) {
        return undefined;
    } else if (kk.includes('Informatika')) {
        return KelompokKeahlian.INFORMATIKA; 
    } else if (kk.includes('Elektronika')) {
        return KelompokKeahlian.ELEKTRONIKA;
    } else if (kk.includes('Rekayasa Perangkat Lunak & Pengetahuan')) {
        return KelompokKeahlian.REKAYASA_PERANGKAT_LUNAK_DAN_PENGETAHUAN;
    } else if (kk.includes('Sistem Kendali & Komputer')) {
        return KelompokKeahlian.SISTEM_KENDALI_DAN_KOMPUTER;
    } else if (kk.includes('Teknik Telekomunikasi')) {
        return KelompokKeahlian.TEKNIK_TELEKOMUNIKASI;
    } else if (kk.includes('Teknik Ketenagalistrikan')) {
        return KelompokKeahlian.TEKNIK_KETENAGALISTRIKAN;
    } else if (kk.includes('Teknik Komputer')) {
        return KelompokKeahlian.TEKNIK_KOMPUTER;
    } else if (kk.includes('Teknologi Informasi')) {
        return KelompokKeahlian.TEKNOLOGI_INFORMASI;
    } else if (kk.includes('Teknik Biomedika')) {
        return KelompokKeahlian.TEKNIK_BIOMEDIS;
    }
  };

  const mapJKToEnum = (kk: string | undefined, jk: string | undefined): JenisKepegawaian | undefined => {
    if (jk?.includes('PNS') || jk?.includes('BHMN')) {
        return JenisKepegawaian.DOSEN_TETAP;
    } else if (jk?.includes('ASISTEN AKADEMIK')) {
        return JenisKepegawaian.ASISTEN_AKADEMIK;
    } else if (jk?.includes('DOSEN KONTRAK PENGAJAR')) {
        return JenisKepegawaian.DOSEN_TAK_TETAP_PENGAJAR;
    } else if (kk?.includes('DOSEN KONTRAK PENELITI (P)')) {
        return JenisKepegawaian.DOSEN_TAK_TETAP_PENELITI;
    } else if (kk?.includes('Dosen Industri') || jk?.includes('DI')) {
        return JenisKepegawaian.DOSEN_INDUSTRI;
    } else if (jk?.includes('LI')) {
        return JenisKepegawaian.DOSEN_LUAR_ITB;
    } else if (jk?.includes('LS')) {
        return JenisKepegawaian.DOSEN_LUAR_STEI;
    } else if (kk?.includes('Tutor')) {
        return JenisKepegawaian.TUTOR;
    } else {
        return JenisKepegawaian.DOSEN_INDUSTRI;
    }
  };

  const mapJFToEnum = (jf: string | undefined): JabatanFungsional | undefined => {
    if (jf?.includes("LEKTOR")) {
        return JabatanFungsional.LEKTOR;
    } else if (jf?.includes("ASISTEN AHLI")) {
        return JabatanFungsional.ASISTEN_AHLI;
    } else if (jf?.includes("LEKTOR KEPALA")) {
        return JabatanFungsional.LEKTOR_KEPALA;
    } else if (jf?.includes("GURU BESAR")) {
        return JabatanFungsional.GURU_BESAR;
    } else {
        return undefined;
    }
  }

  // Mapping status kepegawaian ke Enum
  const mapSKToEnum = (sk: string): StatusKepegawaian => {
    if (sk.includes("AKTIF")) {
        return StatusKepegawaian.AKTIF;
    } else if (sk.includes("TIDAK AKTIF")) {
        return StatusKepegawaian.TIDAK_AKTIF;
    } else if (sk.includes("PENSIUN")) {
        return StatusKepegawaian.PENSIUN;
    } else if (sk.includes("PENSIUN JANDA/DUDA")) {
        return StatusKepegawaian.PENSIUN_JANDA_DUDA;
    } else if (sk.includes("TUGAS BELAJAR")) {
        return StatusKepegawaian.TUGAS_BELAJAR;
    } else if (sk.includes("MENGUNDURKAN DIRI")) {
        return StatusKepegawaian.MENGUNDURKAN_DIRI;
    } else if (sk.includes("DIBERHENTIKAN HORMAT")) {
        return StatusKepegawaian.DIBERHENTIKAN_HORMAT;
    } else {
        throw new Error(`Status kepegawaian "${sk}" tidak valid`);
    }
  }

async function main() {
    // Cek apakah database sudah memiliki data
    const existingUserCount = await prisma.user.count();
    const existingDosenCount = await prisma.dosen.count();

    if (existingUserCount > 0 || existingDosenCount > 0) {
        console.log('Database sudah memiliki data, skipping seed...');
        return;
    }

    console.log('Database kosong, menjalankan seeding...');

    const hashedPassword = await bcrypt.hash('akademik123', 10);
    const dosen = readExcelDosen("./sheets/sheets_pengajaran.xlsx");
    for (const row of dosen) {
        console.log(row);
        const kkEnum = mapKKToEnum(row.kk);
        const jkEnum = mapJKToEnum(row.kk, row.jenisKepegawaian);
        const jfEnum = mapJFToEnum(row.jabatanFungsional);
        const skEnum = mapSKToEnum(row.statusKepegawaian);
        await prisma.dosen.create({
          data: {
            nama_tanpa_gelar: row.namaTanpaGelar,
            nama_plus_gelar: row.namaDenganGelar,
            NIDN: String(row.nidn),
            NIP: String(row.nopeg),
            KK: kkEnum,
            jenis_kepegawaian: jkEnum,
            pangkat: row.pangkat,
            jabatan_fungsional: jfEnum,
            status_kepegawaian: skEnum,
            instansi_asal: row.asalInstansi,
            // soon
          },
        });
      }

    await prisma.user.create({
        data: {
            username: 'akademik',
            password: hashedPassword,
            role: 'AKADEMIK',
        },
    });

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