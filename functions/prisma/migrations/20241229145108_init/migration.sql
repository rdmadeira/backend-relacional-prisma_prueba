/*
  Warnings:

  - You are about to drop the column `tipo_productoId` on the `Producto` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_tipo_productoId_fkey";

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "tipo_productoId",
ADD COLUMN     "tipo" TEXT;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_tipo_fkey" FOREIGN KEY ("tipo") REFERENCES "Tipo_producto"("tipo") ON DELETE SET NULL ON UPDATE CASCADE;
