import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDB() {
  await prisma.codigo_Red.createMany({
    data: [{codigo: 'D1050305001'}, {codigo: 'D1050305002'}],
  });
}

seedDB()
  .then(() => console.log('db migrada con suceso'))
  .catch(err => console.log('Hubo un problema en alimentar la db', err));
