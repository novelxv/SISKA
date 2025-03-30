-- CreateEnum
CREATE TYPE "KelompokKeahlian" AS ENUM ('INFORMATIKA', 'ELEKTRONIKA', 'REKAYASA_PERANGKAT_LUNAK_DAN_PENGETAHUAN', 'SISTEM_KENDALI_DAN_KOMPUTER', 'TEKNIK_TELEKOMUNIKASI', 'TEKNIK_KETENAGALISTRIKAN', 'TEKNIK_KOMPUTER', 'TEKNOLOGI_INFORMASI');

-- CreateEnum
CREATE TYPE "JenisKepegawaian" AS ENUM ('DOSEN_TETAP', 'BHMN', 'DOSEN_TAK_TETAP_PENGAJAR', 'DOSEN_TAK_TETAP_PENELITI', 'DOSEN_LUAR_STEI', 'DOSEN_LUAR_ITB', 'DOSEN_INDUSTRI', 'TUTOR');

-- CreateEnum
CREATE TYPE "StatusKepegawaian" AS ENUM ('AKTIF', 'PENSIUN', 'PENSIUN_JANDA_DUDA', 'TUGAS_BELAJAR', 'MENGUNDURKAN_DIRI', 'DIBERHENTIKAN_HORMAT');

-- CreateEnum
CREATE TYPE "JabatanAsisten" AS ENUM ('ASISTEN_KULIAH', 'KOORDINATOR_ASISTEN_KULIAH', 'ASISTEN_PRAKTIKUM', 'KOORDINATOR_ASISTEN_PRAKTIKUM');

-- CreateEnum
CREATE TYPE "SKStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "Dosen" (
    "id_dosen" SERIAL NOT NULL,
    "nama_tanpa_gelar" TEXT NOT NULL,
    "nama_plus_gelar" TEXT NOT NULL,
    "NIDN" TEXT,
    "NIP" TEXT,
    "KK" "KelompokKeahlian",
    "jenis_kepegawaian" "JenisKepegawaian",
    "pangkat" TEXT,
    "jabatan_fungsional" TEXT,
    "status_kepegawaian" "StatusKepegawaian",
    "aktif_mulai" TIMESTAMP(3),
    "aktif_sampai" TIMESTAMP(3),
    "keterangan" TEXT,
    "instansi_asal" TEXT,

    CONSTRAINT "Dosen_pkey" PRIMARY KEY ("id_dosen")
);

-- CreateTable
CREATE TABLE "Pembimbing" (
    "id_dosen" INTEGER NOT NULL,
    "NIM" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "tanggal_sidang" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pembimbing_pkey" PRIMARY KEY ("id_dosen")
);

-- CreateTable
CREATE TABLE "Penguji" (
    "id_dosen" INTEGER NOT NULL,
    "NIM" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "tanggal_sidang" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Penguji_pkey" PRIMARY KEY ("id_dosen")
);

-- CreateTable
CREATE TABLE "Mahasiswa" (
    "NIM" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "NIP_doswal" TEXT NOT NULL,

    CONSTRAINT "Mahasiswa_pkey" PRIMARY KEY ("NIM")
);

-- CreateTable
CREATE TABLE "Asisten" (
    "NIM" TEXT NOT NULL,
    "kode_matkul" TEXT NOT NULL,
    "jabatan" "JabatanAsisten" NOT NULL,

    CONSTRAINT "Asisten_pkey" PRIMARY KEY ("NIM","kode_matkul")
);

-- CreateTable
CREATE TABLE "MataKuliah" (
    "kode_matkul" TEXT NOT NULL,
    "mata_kuliah" TEXT NOT NULL,
    "kode_prodi" TEXT NOT NULL,
    "sks" INTEGER NOT NULL,
    "no_kelas" TEXT NOT NULL,
    "kuota" INTEGER NOT NULL,
    "jumlah_peserta" INTEGER NOT NULL,
    "dosen_pengampu" TEXT NOT NULL,
    "pembatasan" TEXT NOT NULL,

    CONSTRAINT "MataKuliah_pkey" PRIMARY KEY ("kode_matkul")
);

-- CreateTable
CREATE TABLE "DosenMatkul" (
    "id_dosen" INTEGER NOT NULL,
    "kode_matkul" TEXT NOT NULL,
    "beban_riil" DOUBLE PRECISION NOT NULL,
    "jabatan" TEXT NOT NULL,

    CONSTRAINT "DosenMatkul_pkey" PRIMARY KEY ("id_dosen","kode_matkul")
);

-- CreateTable
CREATE TABLE "SK" (
    "no_sk" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "jenis_sk" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "status" "SKStatus" NOT NULL,
    "NIP_dekan" TEXT NOT NULL,
    "file_sk" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SK_pkey" PRIMARY KEY ("no_sk")
);

-- CreateTable
CREATE TABLE "Dekan" (
    "NIP" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "ttd_url" TEXT,

    CONSTRAINT "Dekan_pkey" PRIMARY KEY ("NIP")
);

-- AddForeignKey
ALTER TABLE "Pembimbing" ADD CONSTRAINT "Pembimbing_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id_dosen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pembimbing" ADD CONSTRAINT "Pembimbing_NIM_fkey" FOREIGN KEY ("NIM") REFERENCES "Mahasiswa"("NIM") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penguji" ADD CONSTRAINT "Penguji_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id_dosen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penguji" ADD CONSTRAINT "Penguji_NIM_fkey" FOREIGN KEY ("NIM") REFERENCES "Mahasiswa"("NIM") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asisten" ADD CONSTRAINT "Asisten_NIM_fkey" FOREIGN KEY ("NIM") REFERENCES "Mahasiswa"("NIM") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asisten" ADD CONSTRAINT "Asisten_kode_matkul_fkey" FOREIGN KEY ("kode_matkul") REFERENCES "MataKuliah"("kode_matkul") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DosenMatkul" ADD CONSTRAINT "DosenMatkul_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "Dosen"("id_dosen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DosenMatkul" ADD CONSTRAINT "DosenMatkul_kode_matkul_fkey" FOREIGN KEY ("kode_matkul") REFERENCES "MataKuliah"("kode_matkul") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SK" ADD CONSTRAINT "SK_NIP_dekan_fkey" FOREIGN KEY ("NIP_dekan") REFERENCES "Dekan"("NIP") ON DELETE RESTRICT ON UPDATE CASCADE;
