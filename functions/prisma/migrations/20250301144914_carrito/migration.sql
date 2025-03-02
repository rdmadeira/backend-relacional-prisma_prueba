/*
  Warnings:

  - You are about to drop the column `headerFormId` on the `Carrito` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `Carrito` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Carrito" DROP CONSTRAINT "Carrito_headerFormId_fkey";

-- AlterTable
ALTER TABLE "Carrito" DROP COLUMN "headerFormId",
ADD COLUMN     "orderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
