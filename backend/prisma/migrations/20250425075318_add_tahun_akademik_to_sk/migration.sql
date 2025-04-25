/*
  Warnings:

  - Added the required column `tahun_akademik` to the `SK` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SK" ADD COLUMN     "tahun_akademik" INTEGER NOT NULL;
