-- DropForeignKey
ALTER TABLE "Codigo_Red" DROP CONSTRAINT "Codigo_Red_marcaId_fkey";

-- AddForeignKey
ALTER TABLE "Codigo_Red" ADD CONSTRAINT "Codigo_Red_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca"("marca") ON DELETE SET NULL ON UPDATE CASCADE;
