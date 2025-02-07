import {
  Concepto,
  PrismaClient,
  Tipo_producto,
  Empresa,
  Prisma,
} from "@prisma/client";
import { ProductExcelTotal } from "../src/entities/products.js";

//prismaClient tiene que ser de unica instancia para servers comunes:
export const prisma = new PrismaClient();

export async function createproductstoDB(flatData: {
  productsToFlatArray: ProductExcelTotal[];
}) {
  try {
    for (const prod of flatData.productsToFlatArray) {
      const prodId = prod.codigo_de_producto.replace(
        prod?.codigo_de_producto?.slice(12, 16),
        "",
      );
      await prisma.producto.upsert({
        where: {
          id: prodId,
        },
        update: {
          descripcion: prod.descripcion,
          marca: prod.marca,
          tipoId: prod.tipo_de_producto,
          mkup: prod.mkup,
          ConceptoId: prod.concepto,
          precio_usd: prod.precio_usd,
          precio_arg: prod.precio_arg,
          costo_repo_usd: prod.costo_repo_usd,
          sku: prod.sku,
          stock_disp: prod.stock_disp,
          stock_larp: prod.stock_larp,
          tasa_iva: prod.tasa_iva,
          is_current: false,
          rubro: prod.rubro || "",
        },
        create: {
          id: prodId,
          descripcion: prod.descripcion,
          marca: prod.marca,
          tipoId: prod.tipo_de_producto,
          mkup: prod.mkup,
          ConceptoId: prod.concepto,
          precio_usd: prod.precio_usd,
          precio_arg: prod.precio_arg,
          costo_repo_usd: prod.costo_repo_usd,
          sku: prod.sku,
          stock_disp: prod.stock_disp,
          stock_larp: prod.stock_larp,
          tasa_iva: prod.tasa_iva,
          is_current: false,
          rubro: prod.rubro || "",
        },
      });
      await prisma.codigo_Red.upsert({
        where: {
          codigo: prod.codigo_reducido,
        },
        update: {
          codigo: prod.codigo_reducido,
          codigo_largo: prod.codigo_de_producto,
          stock_dis: prod.stock_disp,
          stock_lar: prod.stock_larp,
          productoId: prodId,
        },
        create: {
          codigo: prod.codigo_reducido,
          codigo_largo: prod.codigo_de_producto,
          stock_dis: prod.stock_disp,
          stock_lar: prod.stock_larp,
          productoId: prodId,
        },
      });
    }
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

import marcas from "../src/data/marcas.json" with { type: "json" };

export async function updateProductstoDB(data: {
  productsToFlatArray: ProductExcelTotal[];
}) {
  try {
    // const arrayOfPromises = [];

    const marcasTevelam: string[] = marcas.tevelam;
    const marcasDiscopro: string[] = marcas.discopro;

    const marcasTodas = marcasTevelam.concat(marcasDiscopro);

    const marcasOR = marcasTodas.map((item: string) => {
      return {
        marca: item,
      };
    });

    const marcasORCodRed = marcasTodas.map((item: string) => {
      return {
        marcaId: item,
      };
    });

    const arrayOfPromises: Prisma.PrismaPromise<Prisma.BatchPayload>[] = [];

    data.productsToFlatArray.forEach(product => {
      if (marcasOR.find(marcaOR => marcaOR.marca === product.marca)) {
        const prodId = product.codigo_de_producto.replace(
          product?.codigo_de_producto?.slice(12, 16),
          "",
        );
        const promise1 = prisma.producto.updateMany({
          where: {
            id: prodId,
            OR: marcasOR,
          },
          data: {
            precio_arg: product.precio_arg,
            precio_usd: product.precio_usd,
            costo_repo_usd: product.costo_repo_usd,
            mkup: product.mkup,
            descripcion: product.descripcion,
            stock_disp: product.stock_disp,
            stock_larp: product.stock_larp,
            is_current: true,
            rubro: product.rubro,
          },
        });
        const promise2 = prisma.codigo_Red.updateMany({
          where: {
            AND: [{ codigo: product.codigo_reducido, OR: marcasORCodRed }],
          },
          data: {
            codigo: product.codigo_reducido,
            codigo_largo: product.codigo_de_producto,
            stock_dis: product.stock_disp,
            stock_lar: product.stock_larp,
            productoId: prodId,
            marcaId: product.marca,
          },
        });
        arrayOfPromises.push(promise1, promise2);
      }
    });
    await Promise.all(arrayOfPromises);

    console.log("terminó el upgrade a las " + new Date(Date.now()).toString());
    return "successful upgraded in updateProductsToDB";
  } catch (error) {
    console.log("error a las " + new Date(Date.now()).toString(), error);
    throw error;
  }
}

import {
  obtainDataFromXlsx,
  /* prepareDataToSeed, */
} from "../src/utils/getDataFromXls.js";
import * as fs from "fs";
import * as path from "path";

export const seedAll = async (data?: {
  tipo_producto: Tipo_producto[];
  concepto: Concepto[];
  empresa: Empresa[];
}) => {
  try {
    if (data) {
      await prisma.concepto.createMany({
        data: data.concepto,
      });
      await prisma.tipo_producto.createMany({
        data: data.tipo_producto,
      });
      await prisma.empresa.createMany({
        data: data.empresa,
      });
      console.log("created many concepto, tipo_producto, empresa on db");
    }

    fs.readFile(
      path.resolve("src", "xls", "importado_Tevelam_general.xlsx"),
      async (err: any | undefined, data: any) => {
        if (err) throw err;

        const flatData = await obtainDataFromXlsx(data);

        const marcasTevelam: string[] = marcas.tevelam;
        const marcasDiscopro: string[] = marcas.discopro;

        const marcasTodas = marcasTevelam.concat(marcasDiscopro);
        const marcasOR = marcasTodas.map((item: string) => {
          return {
            marca: item,
          };
        });
        const marcasORCodRed = marcasTodas.map((item: string) => {
          return {
            marcaId: item,
          };
        });

        const arrayOftransactions = flatData.productsToFlatArray.flatMap(
          product => {
            const prodId = product.codigo_de_producto.replace(
              product?.codigo_de_producto?.slice(12, 16),
              "",
            );

            return [
              prisma.producto.update({
                where: {
                  id: prodId,
                  OR: marcasOR,
                },
                data: {
                  precio_arg: product.precio_arg,
                  precio_usd: product.precio_usd,
                  costo_repo_usd: product.costo_repo_usd,
                  mkup: product.mkup,
                  descripcion: product.descripcion,
                  stock_disp: product.stock_disp,
                  stock_larp: product.stock_larp,
                  is_current: true,
                  rubro: product.rubro,
                },
              }),
              prisma.codigo_Red.update({
                where: {
                  codigo: product.codigo_reducido,
                  OR: marcasORCodRed,
                },
                data: {
                  codigo: product.codigo_reducido,
                  codigo_largo: product.codigo_de_producto,
                  stock_dis: product.stock_disp,
                  stock_lar: product.stock_larp,
                  productoId: prodId,
                  marcaId: product.marca,
                },
              }),
            ];
          },
        );

        await prisma.$transaction(arrayOftransactions);
        return "successfull seedAll";
      },
    );
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const seedOne = async (/* marcas: {
  tevelam: string[];
  discopro: string[];
} */) => {
  // SEED DE MARCA EN PRODUCTOS Y COD_RED:

  fs.readFile(
    path.resolve("src", "xls", "importado_Tevelam_general.xlsx"),
    async (err: any | undefined, data: any) => {
      if (err) throw err;

      const flatData = await obtainDataFromXlsx(data);

      const marcasTevelam: string[] = marcas.tevelam;
      const marcasDiscopro: string[] = marcas.discopro;

      const marcasTodas = marcasTevelam.concat(marcasDiscopro);
      const marcasOR = marcasTodas.map((item: string) => {
        return {
          marca: item,
        };
      });
      const marcasORCodRed = marcasTodas.map((item: string) => {
        return {
          marcaId: item,
        };
      });

      const arrayOftransactions = flatData.productsToFlatArray.flatMap(
        product => {
          const prodId = product.codigo_de_producto.replace(
            product?.codigo_de_producto?.slice(12, 16),
            "",
          );

          return [
            prisma.producto.update({
              where: {
                id: prodId,
                OR: marcasOR,
              },
              data: {
                marca: product.marca,
              },
            }),
            prisma.codigo_Red.update({
              where: {
                codigo: product.codigo_reducido,
                OR: marcasORCodRed,
              },
              data: {
                marcaId: product.marca,
              },
            }),
          ];
        },
      );

      await prisma.$transaction(arrayOftransactions);
      return "successfull seedmarca";
    },
  );

  // SEED DE EMPRESA:
  /* await prisma.empresa.createMany({
        data: [
          { id: 1, empresa: "discopro" },
          { id: 2, empresa: "tevelam" },
          { id: 3, empresa: "inexistente" },
          ],
          }); */

  /* ******************************************************************* */
  // SEED DE MARCAS:
  /* const arrayOfMarcas: { id: string; marca: string; empresaId: number }[] = [];

  for (const key in marcas) {
    // for...of no tiene in-built en typescript
    const empresa = await prisma.empresa.findUnique({
      where: {
        empresa: key,
      },
    });
    if (empresa) {
      const marcasPorEmpresas: string[] = marcas[key as keyof typeof marcas];
      marcasPorEmpresas.forEach(item =>
        arrayOfMarcas.push({
          id: item,
          marca: item,
          empresaId: empresa.id,
        }),
      );
    }
  }
  console.log("arrayOfMarcas", arrayOfMarcas);

  await prisma.marca.createMany({
    data: arrayOfMarcas,
  }); */
  /* ******************************************************************* */

  console.log("terminado seedOne");
};

seedOne(/* marcas */)
  .then(() => console.log("ok"))
  .catch(error => error);

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
/* seedAll()
  .then(msg => console.log('updated codigo_red on db' + msg))
  .catch(err => {
    console.log('err', err);

    throw err;
  }); */
