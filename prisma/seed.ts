import {Concepto, PrismaClient, Tipo_producto} from '@prisma/client';
import {Product, CodigoReducido} from '../src/entities/products';

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

import {obtainDataFromXlsx, prepareDataToDB} from '../src/utils/getDataFromXls';
import fs from 'fs';
import path from 'path';

const seedAll = async (data: {
  tipo_producto: Tipo_producto[];
  concepto: Concepto[];
}) => {
  try {
    await prisma.concepto.createMany({
      data: data.concepto,
    });
    await prisma.tipo_producto.createMany({
      data: data.tipo_producto,
    });

    console.log('created many concepto and tipo_producto on db');

    fs.readFile(
      path.resolve('src', 'xls', 'importado_Tevelam_general.xlsx'),
      async (err, data) => {
        if (err) throw err;

        const flatData = await obtainDataFromXlsx(data);

        const dataToDB = prepareDataToDB(flatData);

        await prisma.producto.createMany({
          data: dataToDB.productsToDB,
        });
        await prisma.codigo_Red.createMany({
          data: dataToDB.codRedToDB,
        });
      },
    );
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

/* seedAll({
  tipo_producto: [
    {id: 'MR-AUD', tipo: 'MR-AUD'},
    {id: 'MR-ILU', tipo: 'MR-ILU'},
    {id: 'MR-INS', tipo: 'MR-INS'},
    {id: 'MR-VID', tipo: 'MR-VID'},
  ],
  concepto: [
    {id: 'GR105', concepto: 'GR105'},
    {id: 'GR21', concepto: 'GR21'},
    {id: 'GR21I', concepto: 'GR21I'},
  ],
})
  .then(() => console.log('created many productos and codigo_red on db'))
  .catch(err => {
    console.log('err', err);

    throw err;
  }); */
