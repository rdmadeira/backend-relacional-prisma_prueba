-- CreateTable
CREATE TABLE "Tipo_producto" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "Tipo_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "tipo_productoId" INTEGER,
    "marca" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio_usd" DOUBLE PRECISION NOT NULL,
    "precio_arg" DOUBLE PRECISION NOT NULL,
    "tasa_iva" DOUBLE PRECISION NOT NULL,
    "costo_repo_usd" DOUBLE PRECISION NOT NULL,
    "mkup" DOUBLE PRECISION NOT NULL,
    "stock_dis" INTEGER NOT NULL,
    "stock_lar" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "is_current" BOOLEAN NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concepto" (
    "id" SERIAL NOT NULL,
    "concepto" TEXT NOT NULL,

    CONSTRAINT "Concepto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Codigo_del_producto" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "productoId" INTEGER,

    CONSTRAINT "Codigo_del_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Codigo_Red" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "productoId" INTEGER,

    CONSTRAINT "Codigo_Red_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_producto_tipo_key" ON "Tipo_producto"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_marca_key" ON "Producto"("marca");

-- CreateIndex
CREATE UNIQUE INDEX "Concepto_concepto_key" ON "Concepto"("concepto");

-- CreateIndex
CREATE UNIQUE INDEX "Codigo_del_producto_codigo_key" ON "Codigo_del_producto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Codigo_Red_codigo_key" ON "Codigo_Red"("codigo");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_tipo_productoId_fkey" FOREIGN KEY ("tipo_productoId") REFERENCES "Tipo_producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Codigo_del_producto" ADD CONSTRAINT "Codigo_del_producto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Codigo_Red" ADD CONSTRAINT "Codigo_Red_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
