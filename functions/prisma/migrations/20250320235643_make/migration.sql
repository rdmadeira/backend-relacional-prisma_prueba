/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Producto_id_key" ON "Producto"("id");
