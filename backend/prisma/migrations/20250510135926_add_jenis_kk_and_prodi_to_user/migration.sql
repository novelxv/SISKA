-- CreateEnum
CREATE TYPE "Prodi" AS ENUM ('IF', 'II', 'EL', 'ET', 'EP', 'EB');

-- AlterEnum
ALTER TYPE "KelompokKeahlian" ADD VALUE 'TEKNIK_BIOMEDIS';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "jenisKK" "KelompokKeahlian",
ADD COLUMN     "jenisProdi" "Prodi";
