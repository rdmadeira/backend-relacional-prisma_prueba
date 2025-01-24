/*
  Warnings:

  - The primary key for the `Codigo_Red` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Codigo_del_producto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Producto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Tipo_producto` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Codigo_Red" DROP CONSTRAINT "Codigo_Red_productoId_fkey";

-- DropForeignKey
ALTER TABLE "Codigo_del_producto" DROP CONSTRAINT "Codigo_del_producto_productoId_fkey";

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_tipo_productoId_fkey";

-- AlterTable
ALTER TABLE "Codigo_Red" DROP CONSTRAINT "Codigo_Red_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "productoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Codigo_Red_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "codigo_red_id_seq";

-- AlterTable
ALTER TABLE "Codigo_del_producto" DROP CONSTRAINT "Codigo_del_producto_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "productoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Codigo_del_producto_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "codigo_del_producto_id_seq";

-- AlterTable
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tipo_productoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Producto_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Producto_id_seq";

-- AlterTable
ALTER TABLE "Tipo_producto" DROP CONSTRAINT "Tipo_producto_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Tipo_producto_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Tipo_producto_id_seq";

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_tipo_productoId_fkey" FOREIGN KEY ("tipo_productoId") REFERENCES "Tipo_producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Codigo_del_producto" ADD CONSTRAINT "Codigo_del_producto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Codigo_Red" ADD CONSTRAINT "Codigo_Red_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
