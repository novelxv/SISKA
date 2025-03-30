/*
  Warnings:

  - You are about to drop the column `keterangan` on the `Dosen` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "StatusKepegawaian" ADD VALUE 'TIDAK_AKTIF';

-- AlterTable
ALTER TABLE "Dosen" DROP COLUMN "keterangan";
