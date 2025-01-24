-- AlterTable
ALTER TABLE "Codigo_Red" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Codigo_Red_id_seq";

-- AlterTable
ALTER TABLE "Codigo_del_producto" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Codigo_del_producto_id_seq";
