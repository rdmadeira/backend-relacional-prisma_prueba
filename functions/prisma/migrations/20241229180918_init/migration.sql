/*
  Warnings:

  - You are about to drop the column `stock_total` on the `Producto` table. All the data in the column will be lost.
  - Added the required column `stock_disp` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_larp` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "stock_total",
ADD COLUMN     "stock_disp" INTEGER NOT NULL,
ADD COLUMN     "stock_larp" INTEGER NOT NULL;
