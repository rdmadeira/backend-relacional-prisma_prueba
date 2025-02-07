import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const readAllProducts = async (empresa: string) => {
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
      Marca: {
        empresaId: empresaDB?.id,
      },
    },
    include: {
      codigo_red: true,
      Marca: true,
    },
  });

  return filteredProducts;
};
