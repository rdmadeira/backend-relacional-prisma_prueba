-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "orderId" TEXT;

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "iat" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "headerFormId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeaderForm" (
    "id" TEXT NOT NULL,
    "numerocliente" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "condicion" TEXT NOT NULL,
    "obs" TEXT NOT NULL,

    CONSTRAINT "HeaderForm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_headerFormId_fkey" FOREIGN KEY ("headerFormId") REFERENCES "HeaderForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
