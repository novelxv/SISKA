/*
  Warnings:

  - The values [IF,II,EL,ET,EP,EB] on the enum `Prodi` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Prodi_new" AS ENUM ('132', '135', '180', '181', '182', '183', '232', '235', '332', '932', '935');
ALTER TABLE "User" ALTER COLUMN "jenisProdi" TYPE "Prodi_new" USING ("jenisProdi"::text::"Prodi_new");
ALTER TYPE "Prodi" RENAME TO "Prodi_old";
ALTER TYPE "Prodi_new" RENAME TO "Prodi";
DROP TYPE "Prodi_old";
COMMIT;
