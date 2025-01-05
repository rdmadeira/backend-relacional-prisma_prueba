import {PrismaClient} from '@prisma/client';
import {CodigoReducido, Product} from '../src/entities/products';

const prisma = new PrismaClient();

export async function seedproductstoDB(data: {
  productsToDB: Product[];
  codRedToDB: CodigoReducido[];
}) {
  try {
    await prisma.producto.createMany({
      data: data.productsToDB,
    });
    await prisma.codigo_Red.createMany({
      data: data.codRedToDB,
    });
  } catch (error) {
    console.log('error', error);
    throw error;
  }
}

export async function updateProductstoDB(data: {
  productsToDB: Product[];
  codRedToDB: CodigoReducido[];
}) {
  try {
    for (const prod of data.productsToDB) {
      await prisma.producto.update({
        where: {
          id: prod.id,
        },
        data: prod,
      });
    }
    for (const codRed of data.codRedToDB) {
      await prisma.codigo_Red.update({
        where: {
          codigo: codRed.codigo,
        },
        data: codRed,
      });
    }
  } catch (error) {
    console.log('error', error);
    throw error;
  }
}
