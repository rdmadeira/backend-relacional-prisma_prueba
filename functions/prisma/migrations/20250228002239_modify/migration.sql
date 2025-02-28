-- DropForeignKey
ALTER TABLE "Carrito" DROP CONSTRAINT "Carrito_headerFormId_fkey";

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_headerFormId_fkey" FOREIGN KEY ("headerFormId") REFERENCES "HeaderForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
