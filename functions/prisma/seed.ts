import { prisma } from "./prismaClient.js";

import { ProductExcelTotal } from "../src/entities/products.js";
//prismaClient tiene que ser de unica instancia para servers comunes:

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

// import marcas from "../src/data/marcas.json" with { type: "json" };

// Hacer una forma de bulk multiples rows with sql notation, timeout very large for firebase:
export async function updateProductstoDB(data: {
  productsToFlatArray: ProductExcelTotal[];
}) {
  try {
    const arrayOftransactions: any[] = [];

    for (const prodData of data.productsToFlatArray) {
      const prodId = prodData.codigo_de_producto.replace(
        prodData?.codigo_de_producto?.slice(12, 16),
        "",
      );

      const existCod_Red = await prisma.codigo_Red.findUnique({
        where: {
          codigo: prodData.codigo_reducido,
        },
      });

      const updatedProduct = prisma.producto.update({
        where: {
          id: prodId,
        },
        data: {
          precio_arg: prodData.precio_arg,
          precio_usd: prodData.precio_usd,
          costo_repo_usd: prodData.costo_repo_usd,
          mkup: prodData.mkup,
        },
      });
      if (existCod_Red) {
        const updatedCodRed = prisma.codigo_Red.update({
          where: {
            codigo: prodData.codigo_reducido,
          },
          data: {
            stock_dis: prodData.stock_disp,
            stock_lar: prodData.stock_larp,
          },
        });

        arrayOftransactions.push(updatedCodRed);
      }
      arrayOftransactions.push(updatedProduct);
    }

    /* data.productsToFlatArray.forEach(async prodData => {
      const prodId = prodData.codigo_de_producto.replace(
        prodData?.codigo_de_producto?.slice(12, 16),
        "",
      );

      const stocks = await prisma.codigo_Red.findMany({
        where: {
          productoId: prodId,
        },
      });
      const stocks_disp = stocks
        .map(item => item.stock_dis)
        .reduce((a, b) => a + b, 0);
      const stocks_larp = stocks
        .map(item => item.stock_lar)
        .reduce((a, b) => a + b, 0);

      const updatedProduct = prisma.producto.update({
        where: {
          id: prodId,
        },
        data: {
          precio_arg: prodData.precio_arg,
          precio_usd: prodData.precio_usd,
          costo_repo_usd: prodData.costo_repo_usd,
          stock_disp: stocks_disp,
          stock_larp: stocks_larp,
          mkup: prodData.mkup,
        },
      });
      const updatedCodRed = prisma.codigo_Red.update({
        where: {
          codigo: prodData.codigo_reducido,
        },
        data: {
          stock_dis: prodData.stock_disp,
          stock_lar: prodData.stock_larp,
        },
      });
      arrayOftransactions.push(updatedProduct, updatedCodRed);
      return;
    }); */

    const transaction = await prisma.$transaction(arrayOftransactions);
    console.log(
      "transaction",
      transaction.find(item => item.codigo === "F1052302001"),
    );

    /* const transaction = await prisma.$transaction(
      data.productsToFlatArray.flatMap(prodData => {
        const prodId = prodData.codigo_de_producto.replace(
          prodData?.codigo_de_producto?.slice(12, 16),
          "",
        );
        if (prodId === "ADA-PAR-ACT-001") console.log("prodId", prodId);

        return [
          prisma.codigo_Red.update({
            where: {
              codigo: prodData.codigo_reducido,
            },
            data: {
              stock_dis: prodData.stock_disp,
              stock_lar: prodData.stock_larp,
            },
          }),
          prisma.producto.update({
            where: {
              id: prodId,
            },
            data: {
              precio_arg: prodData.precio_arg,
              precio_usd: prodData.precio_usd,
              costo_repo_usd: prodData.costo_repo_usd,
              stock_disp: prodData.stock_disp,
              stock_larp: prodData.stock_larp,
              mkup: prodData.mkup,
            },
          }),
        ];
      }),
    );
    console.log("transaction", transaction); */

    console.log("terminó el upgrade a las " + new Date(Date.now()).toString());
    return "successful upgraded in updateProductsToDB";
  } catch (error) {
    console.log("error a las " + new Date(Date.now()).toString());
    throw error;
  }
}

/* import {
  obtainDataFromXlsx,
  
} from "../src/utils/getDataFromXls.js";
import * as fs from "fs";
import * as path from "path"; */

/* export const seedAll = async (data?: {
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
}; */

export const seedOne = async (/* marcas: {
   tevelam: string[];
   discopro: string[];
 } */) => {
  // SEED NOMBRE:
  // fs.readFile(
  //   path.resolve("src", "xls", "importado_Tevelam_general_Discopro.xlsx"),
  //   async (err: any | undefined, data: any) => {
  //     if (err) throw err;
  //
  //     const flatData = await obtainDataFromXlsx(data);
  //     const arrayOftransactions = flatData.productsToFlatArray.flatMap(
  //       product => {
  //         const prodId = product.codigo_de_producto.replace(
  //           product?.codigo_de_producto?.slice(12, 16),
  //           "",
  //         );
  //         // console.log("product.nombre", product.nombre);
  //
  //         return [
  //           prisma.producto.updateMany({
  //             where: { AND: [{ id: prodId }, { nombre: "" }] },
  //             data: {
  //               nombre: product.nombre || "",
  //             },
  //           }),
  //         ];
  //       },
  //     );
  //     await prisma.$transaction(arrayOftransactions);
  //     return "successfull seedAll";
  //   },
  // );
  // SEED RUBRO BY EXCEL:
  /* fs.readFile(
    path.resolve("src", "xls", "importado_Tevelam_general_Discopro.xlsx"),
    async (err: any | undefined, data: any) => {
      if (err) throw err;

      const flatData = await obtainDataFromXlsx(data);
      const arrayOftransactions = flatData.productsToFlatArray.flatMap(
        product => {
          const prodId = product.codigo_de_producto.replace(
            product?.codigo_de_producto?.slice(12, 16),
            "",
          );

          
          return [
            prisma.producto.updateMany({
              where: { AND: [{ id: prodId }, { rubro: "" }] },
              data: {
                rubro: product.rubro || "",
              },
            }),
          ];
        },
      );
      await prisma.$transaction(arrayOftransactions);
      return "successfull seedAll";
    },
  ); */
  // SEED IS_CURRENT BY EXCEL:
  /* fs.readFile(
    path.resolve("src", "xls", "importado_Tevelam_general_Discopro.xlsx"),
    async (err: any | undefined, data: any) => {
      if (err) throw err;

      const flatData = await obtainDataFromXlsx(data);
 */
  /* const marcasTevelam: string[] = marcas.tevelam;
      const marcasDiscopro: string[] = marcas.discopro;

      const marcasTodas = marcasTevelam.concat(marcasDiscopro);
 */
  /* const arrayOftransactions = flatData.productsToFlatArray.flatMap(
        product => {
          const prodId = product.codigo_de_producto.replace(
            product?.codigo_de_producto?.slice(12, 16),
            "",
          );
          console.log("product.is_current", product.is_current);

          return [
            prisma.producto.updateMany({
              where: {
                AND: [
                  {
                    id: prodId,
                  },
                  { is_current: false },
                ],
              },
              data: {
                is_current: product.is_current ? true : false,
              },
            }),
          ];
        },
      );

      await prisma.$transaction(arrayOftransactions);
      return "successfull seedAll";
    },
  ); */
  // SEED DE CONNECT DE MARCA EN PRODUCTOS Y COD_RED:
  /* fs.readFile(
    path.resolve("src", "xls", "importado_Tevelam_general.xlsx"),
    async (err: any | undefined, data: any) => {
      if (err) throw err;

      console.log("data", data);

      const flatData = await obtainDataFromXlsx(data);

      const arrayOftransactions = flatData.productsToFlatArray.flatMap(
        product => {
          const prodId = product.codigo_de_producto.replace(
            product?.codigo_de_producto?.slice(12, 16),
            "",
          );

          // El connect or create para cuando no existe data, estaba dando errores por no haber records
          return [
            prisma.producto.update({
              where: {
                id: prodId,
              },
              data: {
                Marca: {
                  connectOrCreate: {
                    where: {
                      marca: product.marca,
                    },
                    create: {
                      marca: product.marca,
                    },
                  },
                },
              },
            }),
            prisma.codigo_Red.updateMany({
              where: {
                productoId: prodId,
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
  ); */
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
  /* fs.readFile(
    path.resolve("src", "xls", "importado_Tevelam_general_Discopro.xlsx"),
    async (err: any | undefined, data: any) => {
      if (err) throw err;

      const flatData = await obtainDataFromXlsx(data);

      const arrayOfMarcas: string[] = [];
      flatData.productsToFlatArray.forEach(item => {
        if (!arrayOfMarcas.find(marca => marca === item.marca)) {
          arrayOfMarcas.push(item.marca);
        }
      });
      console.log("arrayOfMarcas", arrayOfMarcas);

      const arrayOftransactions = arrayOfMarcas.flatMap(marca => {
        return [
          prisma.marca.upsert({
            where: {
              marca: marca,
            },
            create: {
              marca: marca,
              empresaId: null,
            },
            update: {
              marca: marca,
            },
          }),
        ];
      });

      await prisma.$transaction(arrayOftransactions);
      console.log("terminado seedOne");

      return "successfull seedmarca";
    },
  ); */
  //
  /* for (const key in marcas) {
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
  } */
  //
  /* ******************************************************************* */
  //};
  // seedOne(/* marcas */)
  //   .then(() => console.log("ok"))
  //   .catch(error => error);
  //seedAll(/* {
  //  tipo_producto: [
  //    { id: "MR-AUD", tipo: "MR-AUD" },
  //    { id: "MR-ILU", tipo: "MR-ILU" },
  //    { id: "MR-INS", tipo: "MR-INS" },
  //    { id: "MR-VID", tipo: "MR-VID" },
  //  ],
  //  concepto: [
  //    { id: "GR105", concepto: "GR105" },
  //    { id: "GR21", concepto: "GR21" },
  //    { id: "GR21I", concepto: "GR21I" },
  //  ],
  //  empresa: [
  //    { id: 1, empresa: "discopro" },
  //    { id: 2, empresa: "tevelam" },
  //    { id: 3, empresa: "inexistente" },
  //  ],
  //} */)
  //  .then(() =>
  //    console.log(
  //      "created many empresa, marca, concepto, tipo_producto, productos, codigo_red on db",
  //    ),
  //  )
  //  .catch(err => {
  //    console.log("err", err);
  //
  //    throw err;
  //  });
};

// seedOne();
