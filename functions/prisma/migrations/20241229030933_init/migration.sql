/*
  Warnings:

  - You are about to drop the column `stock_dis` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `stock_lar` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the `Codigo_del_producto` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[codigo_largo]` on the table `Codigo_Red` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo_largo` to the `Codigo_Red` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_dis` to the `Codigo_Red` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_lar` to the `Codigo_Red` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_total` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Codigo_del_producto" DROP CONSTRAINT "Codigo_del_producto_productoId_fkey";

-- AlterTable
ALTER TABLE "Codigo_Red" ADD COLUMN     "codigo_largo" TEXT NOT NULL,
ADD COLUMN     "stock_dis" INTEGER NOT NULL,
ADD COLUMN     "stock_lar" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "stock_dis",
DROP COLUMN "stock_lar",
ADD COLUMN     "stock_total" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Codigo_del_producto";

-- CreateIndex
CREATE UNIQUE INDEX "Codigo_Red_codigo_largo_key" ON "Codigo_Red"("codigo_largo");
