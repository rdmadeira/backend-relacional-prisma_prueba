/*
  Warnings:

  - Made the column `productoId` on table `Codigo_Red` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Codigo_Red" DROP CONSTRAINT "Codigo_Red_productoId_fkey";

-- AlterTable
ALTER TABLE "Codigo_Red" ALTER COLUMN "productoId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Codigo_Red" ADD CONSTRAINT "Codigo_Red_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
