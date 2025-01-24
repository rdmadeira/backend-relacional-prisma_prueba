/*
  Warnings:

  - A unique constraint covering the columns `[empresa]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Empresa_empresa_key" ON "Empresa"("empresa");
