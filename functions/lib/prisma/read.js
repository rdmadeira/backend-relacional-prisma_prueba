import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const readAllProducts = async () => {
    const filteredProducts = await prisma.producto.findMany({
        where: {
            id: {
                not: undefined,
            },
        },
        include: {
            codigo_red: true,
        },
    });
    return filteredProducts;
};
