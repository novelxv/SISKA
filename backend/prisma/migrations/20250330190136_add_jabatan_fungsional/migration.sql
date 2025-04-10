/*
  Warnings:

  - The values [BHMN] on the enum `JenisKepegawaian` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `keterangan` on the `Dosen` table. All the data in the column will be lost.
  - The `jabatan_fungsional` column on the `Dosen` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "JabatanFungsional" AS ENUM ('ASISTEN_AHLI', 'LEKTOR', 'LEKTOR_KEPALA', 'GURU_BESAR');

-- AlterEnum
BEGIN;
CREATE TYPE "JenisKepegawaian_new" AS ENUM ('DOSEN_TETAP', 'DOSEN_TAK_TETAP_PENGAJAR', 'DOSEN_TAK_TETAP_PENELITI', 'DOSEN_LUAR_STEI', 'DOSEN_LUAR_ITB', 'DOSEN_INDUSTRI', 'ASISTEN_AKADEMIK', 'TUTOR');
ALTER TABLE "Dosen" ALTER COLUMN "jenis_kepegawaian" TYPE "JenisKepegawaian_new" USING ("jenis_kepegawaian"::text::"JenisKepegawaian_new");
ALTER TYPE "JenisKepegawaian" RENAME TO "JenisKepegawaian_old";
ALTER TYPE "JenisKepegawaian_new" RENAME TO "JenisKepegawaian";
DROP TYPE "JenisKepegawaian_old";
COMMIT;

-- AlterEnum
ALTER TYPE "StatusKepegawaian" ADD VALUE 'TIDAK_AKTIF';

-- AlterTable
ALTER TABLE "Dosen" DROP COLUMN "keterangan",
DROP COLUMN "jabatan_fungsional",
ADD COLUMN     "jabatan_fungsional" "JabatanFungsional";
