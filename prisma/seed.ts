import {Concepto, PrismaClient, Tipo_producto, Empresa} from '@prisma/client';
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
    const arrayOfPromises = [];
    for (const prod of data.productsToDB) {
      console.log('prod', prod);

      const updateRequest = prisma.producto.update({
        where: {
          id: prod.id,
        },
        data: {
          precio_arg: prod.precio_arg,
          precio_usd: prod.precio_usd,
          costo_repo_usd: prod.costo_repo_usd,
          mkup: prod.mkup,
          descripcion: prod.descripcion,
          stock_disp: prod.stock_disp,
          stock_larp: prod.stock_larp,
          is_current: prod.is_current,
          rubro: prod.rubro,
        },
      });
      arrayOfPromises.push(updateRequest);
    }
    for (const codRed of data.codRedToDB) {
      console.log('codRed', codRed);

      const updateRequest = prisma.codigo_Red.update({
        where: {
          codigo: codRed.codigo,
        },
        data: codRed,
      });
      arrayOfPromises.push(updateRequest);
    }
    await Promise.all(arrayOfPromises); // tuve que sacar el await de los prisma.update y puse un Promise.all para agilizar
    console.log('terminó el upgrade');
  } catch (error) {
    console.log('error', error);
    throw error;
  }
}

import {
  obtainDataFromXlsx,
  prepareDataToSeed,
} from '../src/utils/getDataFromXls';
import fs from 'fs';
import path from 'path';

export const seedAll = async (data: {
  tipo_producto: Tipo_producto[];
  concepto: Concepto[];
  empresa: Empresa[];
}) => {
  try {
    await prisma.concepto.createMany({
      data: data.concepto,
    });
    await prisma.tipo_producto.createMany({
      data: data.tipo_producto,
    });
    await prisma.empresa.createMany({
      data: data.empresa,
    });

    console.log('created many concepto, tipo_producto, empresa on db');

    fs.readFile(
      path.resolve('src', 'xls', 'importado_Tevelam_general.xlsx'),
      async (err, data) => {
        if (err) throw err;

        const flatData = await obtainDataFromXlsx(data);

        const dataToDB = prepareDataToSeed(flatData);

        await prisma.marca.createMany({
          data: dataToDB.marcaToDB,
        });

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

/* const seedOne = async () => {
  await prisma.empresa.createMany({
    data: [
      {empresa: 'discopro'},
      {empresa: 'tevelam'},
      {empresa: 'inexistente'},
    ],
  });
};

seedOne()
  .then(() => console.log('ok'))
  .catch(error => error); */

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
  empresa: [
    {id: 1, empresa: 'discopro'},
    {id: 2, empresa: 'tevelam'},
    {id: 3, empresa: 'inexistente'},
  ],
})
  .then(() =>
    console.log(
      'created many empresa, marca, concepto, tipo_producto, productos, codigo_red on db',
    ),
  )
  .catch(err => {
    console.log('err', err);

    throw err;
  });
 */
