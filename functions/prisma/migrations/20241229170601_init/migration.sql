/*
  Warnings:

  - The primary key for the `Concepto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `concepto` on the `Producto` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_concepto_fkey";

-- AlterTable
ALTER TABLE "Concepto" DROP CONSTRAINT "Concepto_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Concepto_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Concepto_id_seq";

-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "concepto",
ADD COLUMN     "ConceptoId" TEXT;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_ConceptoId_fkey" FOREIGN KEY ("ConceptoId") REFERENCES "Concepto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
