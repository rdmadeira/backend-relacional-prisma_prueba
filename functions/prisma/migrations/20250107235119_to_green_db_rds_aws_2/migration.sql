/*
  Warnings:

  - You are about to drop the column `marcaId` on the `Producto` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[marca]` on the table `Marca` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_marcaId_fkey";

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "marcaId",
ADD COLUMN     "marca" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Marca_marca_key" ON "Marca"("marca");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_marca_fkey" FOREIGN KEY ("marca") REFERENCES "Marca"("marca") ON DELETE SET NULL ON UPDATE CASCADE;
