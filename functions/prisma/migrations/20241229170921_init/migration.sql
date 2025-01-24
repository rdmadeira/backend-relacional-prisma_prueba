/*
  Warnings:

  - You are about to drop the column `tipo` on the `Producto` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_id_fkey";

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "tipo",
ADD COLUMN     "tipoId" TEXT;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "Tipo_producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
