/*
  Warnings:

  - Added the required column `DPK` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alamatKtp` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jamKerja` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kelas` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaBank` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaTabungan` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomorHP` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomorNikKtp` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomorNpwp` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomorRekening` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadHalamanBukuTabungan` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadKtm` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadKtp` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadLogbook` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadSuratPernyataan` to the `Asisten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sks_six` to the `DosenMatkul` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asisten" ADD COLUMN     "DPK" TEXT NOT NULL,
ADD COLUMN     "alamatKtp" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "jamKerja" TEXT NOT NULL,
ADD COLUMN     "kelas" TEXT NOT NULL,
ADD COLUMN     "namaBank" TEXT NOT NULL,
ADD COLUMN     "namaTabungan" TEXT NOT NULL,
ADD COLUMN     "nomorHP" TEXT NOT NULL,
ADD COLUMN     "nomorNikKtp" TEXT NOT NULL,
ADD COLUMN     "nomorNpwp" TEXT NOT NULL,
ADD COLUMN     "nomorRekening" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "uploadHalamanBukuTabungan" TEXT NOT NULL,
ADD COLUMN     "uploadKtm" TEXT NOT NULL,
ADD COLUMN     "uploadKtp" TEXT NOT NULL,
ADD COLUMN     "uploadLogbook" TEXT NOT NULL,
ADD COLUMN     "uploadSuratPernyataan" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DosenMatkul" ADD COLUMN     "sks_six" DOUBLE PRECISION NOT NULL;
