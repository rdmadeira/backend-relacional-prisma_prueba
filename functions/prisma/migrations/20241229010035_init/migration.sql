-- AlterTable
CREATE SEQUENCE codigo_red_id_seq;
ALTER TABLE "Codigo_Red" ALTER COLUMN "id" SET DEFAULT nextval('codigo_red_id_seq');
ALTER SEQUENCE codigo_red_id_seq OWNED BY "Codigo_Red"."id";

-- AlterTable
CREATE SEQUENCE codigo_del_producto_id_seq;
ALTER TABLE "Codigo_del_producto" ALTER COLUMN "id" SET DEFAULT nextval('codigo_del_producto_id_seq');
ALTER SEQUENCE codigo_del_producto_id_seq OWNED BY "Codigo_del_producto"."id";
