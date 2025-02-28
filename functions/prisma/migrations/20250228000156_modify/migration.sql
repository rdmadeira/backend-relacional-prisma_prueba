/*
  Warnings:

  - You are about to drop the column `orderId` on the `Carrito` table. All the data in the column will be lost.
  - Added the required column `headerFormId` to the `Carrito` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Carrito" DROP CONSTRAINT "Carrito_orderId_fkey";

-- AlterTable
ALTER TABLE "Carrito" DROP COLUMN "orderId",
ADD COLUMN     "headerFormId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_headerFormId_fkey" FOREIGN KEY ("headerFormId") REFERENCES "Order"("headerFormId") ON DELETE RESTRICT ON UPDATE CASCADE;
