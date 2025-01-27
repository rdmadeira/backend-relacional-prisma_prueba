-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_tipo_fkey";

-- DropIndex
DROP INDEX "Tipo_producto_tipo_key";

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_id_fkey" FOREIGN KEY ("id") REFERENCES "Tipo_producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
