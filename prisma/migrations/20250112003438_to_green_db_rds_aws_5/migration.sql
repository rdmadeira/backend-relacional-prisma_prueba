-- AlterTable
ALTER TABLE "Codigo_Red" ADD COLUMN     "marcaId" TEXT;

-- AddForeignKey
ALTER TABLE "Codigo_Red" ADD CONSTRAINT "Codigo_Red_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca"("id") ON DELETE SET NULL ON UPDATE CASCADE;
