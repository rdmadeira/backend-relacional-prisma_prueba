/*
  Warnings:

  - You are about to drop the column `orderId` on the `Producto` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[headerFormId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_orderId_fkey";

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "orderId";

-- CreateTable
CREATE TABLE "Carrito" (
    "id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,

    CONSTRAINT "Carrito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Carrito_productoId_key" ON "Carrito"("productoId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_headerFormId_key" ON "Order"("headerFormId");

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
