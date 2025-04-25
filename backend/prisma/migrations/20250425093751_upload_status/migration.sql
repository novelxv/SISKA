/*
  Warnings:

  - The primary key for the `Pembimbing` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Penguji` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Mahasiswa" ADD COLUMN     "kelas" TEXT;

-- AlterTable
ALTER TABLE "Pembimbing" DROP CONSTRAINT "Pembimbing_pkey",
ADD CONSTRAINT "Pembimbing_pkey" PRIMARY KEY ("id_dosen", "NIM");

-- AlterTable
ALTER TABLE "Penguji" DROP CONSTRAINT "Penguji_pkey",
ADD CONSTRAINT "Penguji_pkey" PRIMARY KEY ("id_dosen", "NIM");

-- AlterTable
ALTER TABLE "SK" ALTER COLUMN "tahun_akademik" DROP NOT NULL;

-- CreateTable
CREATE TABLE "upload_status" (
    "templateType" TEXT NOT NULL,
    "uploaded" BOOLEAN NOT NULL DEFAULT false,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "filePath" TEXT,

    CONSTRAINT "upload_status_pkey" PRIMARY KEY ("templateType")
);
