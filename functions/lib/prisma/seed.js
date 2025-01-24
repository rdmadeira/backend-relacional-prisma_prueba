import { PrismaClient, } from "@prisma/client";
//prismaClient tiene que ser de unica instancia para servers comunes:
export const prisma = new PrismaClient();
export async function createproductstoDB(flatData) {
    try {
        for (const prod of flatData.productsToFlatArray) {
            const prodId = prod.codigo_de_producto.replace(prod?.codigo_de_producto?.slice(12, 16), "");
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
    }
    catch (error) {
        console.log("error", error);
        throw error;
    }
}
import marcas from "../src/data/marcas.json" with { type: "json" };
export async function updateProductstoDB(data) {
    try {
        // const arrayOfPromises = [];
        const marcasTevelam = marcas.tevelam;
        const marcasDiscopro = marcas.discopro;
        const marcasTodas = marcasTevelam.concat(marcasDiscopro);
        const marcasOR = marcasTodas.map((item) => {
            return {
                marca: item,
            };
        });
        const marcasORCodRed = marcasTodas.map((item) => {
            return {
                marcaId: item,
            };
        });
        const arrayOfPromises = [];
        data.productsToFlatArray.forEach(product => {
            if (marcasOR.find(marcaOR => marcaOR.marca === product.marca)) {
                const prodId = product.codigo_de_producto.replace(product?.codigo_de_producto?.slice(12, 16), "");
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
    }
    catch (error) {
        console.log("error a las " + new Date(Date.now()).toString(), error);
        throw error;
    }
}
import { obtainDataFromXlsx,
/* prepareDataToSeed, */
 } from "../src/utils/getDataFromXls.js";
import fs from "fs";
import path from "path";
export const seedAll = async (data) => {
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
        fs.readFile(path.resolve("src", "xls", "importado_Tevelam_general.xlsx"), async (err, data) => {
            if (err)
                throw err;
            const flatData = await obtainDataFromXlsx(data);
            const marcasTevelam = marcas.tevelam;
            const marcasDiscopro = marcas.discopro;
            const marcasTodas = marcasTevelam.concat(marcasDiscopro);
            const marcasOR = marcasTodas.map((item) => {
                return {
                    marca: item,
                };
            });
            const marcasORCodRed = marcasTodas.map((item) => {
                return {
                    marcaId: item,
                };
            });
            const arrayOftransactions = flatData.productsToFlatArray.flatMap(product => {
                const prodId = product.codigo_de_producto.replace(product?.codigo_de_producto?.slice(12, 16), "");
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
            });
            await prisma.$transaction(arrayOftransactions);
            return "successfull seedAll";
        });
    }
    catch (error) {
        console.log("error", error);
        throw error;
    }
};
export const seedOne = async () => {
    await prisma.codigo_Red.updateMany({
        data: [
            { marcaId: "discopro" },
            { marcaId: "tevelam" },
            { marcaId: "inexistente" },
        ],
    });
    console.log("terminado seedOne");
};
/*
seedOne()
  .then(() => console.log('ok'))
  .catch(error => error);
 */
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
