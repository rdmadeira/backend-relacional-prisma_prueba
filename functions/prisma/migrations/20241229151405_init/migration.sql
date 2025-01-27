-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "concepto" TEXT;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_concepto_fkey" FOREIGN KEY ("concepto") REFERENCES "Concepto"("concepto") ON DELETE SET NULL ON UPDATE CASCADE;
