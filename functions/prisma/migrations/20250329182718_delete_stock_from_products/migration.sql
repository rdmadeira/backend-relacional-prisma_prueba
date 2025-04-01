/*
  Warnings:

  - You are about to drop the column `stock_disp` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `stock_larp` on the `Producto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "stock_disp",
DROP COLUMN "stock_larp";
