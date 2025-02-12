import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const readAllProducts = async (empresa: string, iscurrent: boolean) => {
  const empresaDB = await prisma.empresa.findUnique({
    where: {
      empresa: empresa,
    },
  });
  console.log("empresaDB", empresaDB);

  const filteredProducts = await prisma.producto.findMany({
    where: {
      id: {
        not: undefined,
      },
      OR: iscurrent
        ? [{ is_current: true }]
        : [{ is_current: true }, { is_current: false }],
      Marca: {
        empresaId: empresaDB?.id,
      },
    },
    include: {
      codigo_red: true,
      Marca: true,
    },
    orderBy: [{ marca: "asc" }, { rubro: "asc" }],
  });

  return filteredProducts;
};
