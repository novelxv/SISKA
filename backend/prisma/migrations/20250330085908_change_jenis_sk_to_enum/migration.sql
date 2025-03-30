/*
  Warnings:

  - Changed the type of `jenis_sk` on the `SK` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "JenisSK" AS ENUM ('PENGAJARAN', 'PEMBIMBING_PENGUJI', 'PEMBIMBING_AKTIF', 'WALI_TPB', 'WALI_MHS_AKTIF', 'ASISTEN_PRAKTIKUM');

-- AlterTable
ALTER TABLE "SK" DROP COLUMN "jenis_sk",
ADD COLUMN     "jenis_sk" "JenisSK" NOT NULL;
