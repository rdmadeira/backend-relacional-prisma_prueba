import {PrismaClient} from '@prisma/client';
import {Product} from '../src/entities/products';

const prisma = new PrismaClient();

export async function seedproductstoDB(data: Product[]) {
  await prisma.producto.createMany({
    data: data,
  });
}
