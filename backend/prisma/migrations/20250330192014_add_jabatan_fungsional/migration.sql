/*
  Warnings:

  - Made the column `status_kepegawaian` on table `Dosen` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Dosen" ALTER COLUMN "status_kepegawaian" SET NOT NULL;
