/*
  Warnings:

  - A unique constraint covering the columns `[marcaId]` on the table `Codigo_Red` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[marca]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Codigo_Red_marcaId_key" ON "Codigo_Red"("marcaId");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_marca_key" ON "Producto"("marca");
