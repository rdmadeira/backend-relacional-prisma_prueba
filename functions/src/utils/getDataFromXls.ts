import /* { utils, read, stream } */ * as XLSX from "xlsx/xlsx.mjs";

/* load 'fs' for readFile and writeFile support - https://www.npmjs.com/package/xlsx */
import * as fs from "fs";
XLSX.set_fs(fs);

/* load 'stream' for stream support - https://www.npmjs.com/package/xlsx*/
import { Readable } from "stream";
XLSX.stream.set_readable(Readable);

// import path from "path";

// import { WorkSheet } from "xlsx/types";
import {
  Product,
  CodigoReducido,
  ProductExcelTotal,
  Marca,
} from "../entities/products.js";
import { readAllProducts } from "../../prisma/read.js";
// const { pathname: root } = new URL("../src/", __dirname);

//const getCurrentListsProducts = async () => {
//  const codigosTotal = [];
//  const xlsFolder = path.resolve("src", "xls");
//  const dataFolder = path.resolve("src", "data");
//
//  const workbookDisco = await XLSX.readFile(xlsFolder + "/lista_discopro.xlsx");
//  const sheetDisco = workbookDisco.Sheets[workbookDisco.SheetNames[0]];
//  const codigosDisco = XLSX.utils
//    .sheet_to_json(sheetDisco, {
//      header: 1,
//    })
//    .map((item: any[]) => ({
//      codigo: item[0],
//      rubro: item[2],
//      modelo: item[4],
//    }))
//    .filter(
//      (item: any) =>
//        item.codigo &&
//        item.codigo !== "Código" &&
//        item.codigo !== "Codigo" &&
//        item.codigo !== "CODIGO" /* !== undefined || item !== null */,
//    );
//  codigosTotal.push(codigosDisco);
//
//  const workbookTevelam = await XLSX.readFile(
//    xlsFolder + "/lista_tevelam.xlsx",
//  );
//  const sheetTevelam = workbookTevelam.Sheets[workbookTevelam.SheetNames[0]];
//  const codigosTevelam = XLSX.utils
//    .sheet_to_json(sheetTevelam, {
//      header: 1,
//    })
//    .map((item: any[]) => ({
//      codigo: item[0],
//      rubro: item[3],
//      modelo: item[4],
//    }))
//    .filter(
//      (item: any) =>
//        item.codigo &&
//        item.codigo !== "Código" &&
//        item.codigo !== "Codigo" &&
//        item.codigo !== "CODIGO" /* !== undefined || item !== null */,
//    );
//  codigosTotal.push(codigosTevelam);
//
//  const workbookPro = await XLSX.readFile(
//    xlsFolder + "/lista_audiopro_adam_aston.xlsx",
//  );
//  const sheetPro = workbookPro.Sheets[workbookPro.SheetNames[0]];
//  const codigosPro = XLSX.utils
//    .sheet_to_json(sheetPro, {
//      header: 1,
//    })
//    .map((item: any[]) => ({
//      codigo: item[0],
//      rubro: item[2],
//      modelo: item[4],
//    }))
//    .filter(
//      (item: any) =>
//        item.codigo &&
//        item.codigo !== "Código" &&
//        item.codigo !== "Codigo" &&
//        item.codigo !== "CODIGO" /* !== undefined || item !== null */,
//    );
//  codigosTotal.push(codigosPro);
//
//
//
//  // new Set es para no tener repetidos:
//  const dataToJson = Array.from(new Set(codigosTotal.flat()));
//  console.log("codigosTotal", Array.from(new Set(codigosTotal.flat())));
//  fs.writeFileSync(dataFolder + "/codigos.json", JSON.stringify(dataToJson));
//};

//Cambio de Header para adaptarse a la DB:
//@ts-ignore
const adaptHeadersToDBKeys = sheet => {
  XLSX.utils.sheet_add_aoa(sheet, [
    [
      "codigo_reducido",
      "tipo_de_producto",
      "codigo_de_producto",
      "concepto",
      "marca",
      "descripcion",
      "precio_usd",
      "precio_arg",
      "tasa_iva",
      "costo_repo_usd",
      "mkup",
      "stock_disp",
      "stock_larp",
      "sku",
      "is_current",
      "rubro",
      "nombre",
    ],
  ]);
};

// Seed & update:
import currentProducts from "../data/codigos.json" with { type: "json" };
export const obtainDataFromXlsx = async (
  buffer: Buffer<ArrayBufferLike>,
): Promise<{
  productsToFlatArray: ProductExcelTotal[];
}> => {
  const myFile = XLSX.read(buffer);
  const mySheet = myFile.Sheets["ToUpgrade"];
  adaptHeadersToDBKeys(mySheet);

  // Transformar en stream y leer la data:
  const myFileStream: Readable = await XLSX.stream.to_json(mySheet); // Stream lo hace mas rápido para archivos grandes

  const productsToFlatArray: ProductExcelTotal[] = [];

  return new Promise((resolve, reject) => {
    // tuve que usar Reject, Resolve para devolver un valor a la funcion asincrona y a los listeners
    myFileStream
      .on("data", (row: ProductExcelTotal) => {
        const isCurrentIndex = currentProducts.findIndex(
          item => item?.codigo?.slice(1) === row?.codigo_reducido?.slice(1),
        );

        if (
          (row.tipo_de_producto === "MR-AUD" ||
            row.tipo_de_producto === "MR-ILU" ||
            row.tipo_de_producto === "MR-INS" ||
            row.tipo_de_producto === "MR-VID") &&
          row.codigo_reducido &&
          typeof row.codigo_reducido === "string" &&
          row.descripcion &&
          isCurrentIndex >= 0
        ) {
          productsToFlatArray.push({
            ...row,
            rubro: currentProducts[isCurrentIndex].rubro,
            nombre: currentProducts[isCurrentIndex].modelo.toString(),
            tasa_iva:
              typeof row.tasa_iva === "string"
                ? parseFloat(row.tasa_iva)
                : row.tasa_iva,
          });
        }
      })
      .on("error", error => {
        reject(console.log("error", error));
        throw new Error(error.message);
      })
      .on("end", () => {
        console.log(
          `Productos extraídos de Excel con suceso: ${productsToFlatArray.length} productos`,
        );

        return resolve({
          productsToFlatArray,
        });
      });
  });
};

// Solo se usa para crear por seed:
export const prepareProductsToDB = (data: {
  productsToFlatArray: ProductExcelTotal[];
}) => {
  const productsToDB: Product[] = [];
  const codRed: CodigoReducido[] = [];

  data.productsToFlatArray.forEach((product: ProductExcelTotal) => {
    const prodId = product.codigo_de_producto.replace(
      product?.codigo_de_producto?.slice(12, 16),
      "",
    );
    const existentIndex = productsToDB.findIndex(
      prodToDB => prodId === prodToDB.id,
    );

    if (existentIndex >= 0) {
      const existentProduct = productsToDB[existentIndex];
      existentProduct.stock_disp += product.stock_disp;
      existentProduct.stock_larp += product.stock_larp;
    } else {
      productsToDB.push({
        id: prodId,
        descripcion: product.descripcion,
        marca: product.marca,
        tipoId: product.tipo_de_producto,
        mkup: product.mkup,
        ConceptoId: product.concepto,
        precio_usd: product.precio_usd,
        precio_arg: product.precio_arg,
        costo_repo_usd: product.costo_repo_usd,
        sku: product.sku,
        stock_disp: product.stock_disp,
        stock_larp: product.stock_larp,
        tasa_iva: product.tasa_iva,
        is_current: false,
        rubro: product.rubro || "",
      });
    }
    codRed.push({
      codigo: product.codigo_reducido,
      codigo_largo: product.codigo_de_producto,
      stock_dis: product.stock_disp,
      stock_lar: product.stock_larp,
      productoId: prodId,
      marcaId: product.marca,
    });
  });

  return { productsToDB, codRedToDB: codRed };
};

import marcas from "../data/marcas.json" with { type: "json" };

// Solo se usa para crear por seed:
export const prepareDataToSeed = (data: {
  productsToFlatArray: ProductExcelTotal[];
}) => {
  const { productsToDB, codRedToDB } = prepareProductsToDB(data);

  const arrayOfMarcas: string[] = productsToDB.map(({ marca }) => {
    return marca;
  });
  const marcaToDB: Marca[] = [];

  const arrayOfMarcasSinRepetir = [...new Set(arrayOfMarcas)];

  arrayOfMarcasSinRepetir.forEach(marca => {
    let empresaId: number;
    const marcasDiscopro = marcas.discopro;
    const marcasTevelam = marcas.discopro;

    if (new RegExp(marcasDiscopro.join("|")).test(marca.toLowerCase())) {
      empresaId = 1;
    } else if (new RegExp(marcasTevelam.join("|")).test(marca.toLowerCase())) {
      empresaId = 2;
    } else {
      empresaId = 3;
    }
    console.log({ marca, empresaId });
    marcaToDB.push({ marca, empresaId });
  });

  return { productsToDB, codRedToDB, marcaToDB };
};

export const getProductsFromDB = async (empresa: string, iscurrent: string) => {
  const allProducts = await readAllProducts(empresa, JSON.parse(iscurrent));

  return allProducts;
};

// getCurrentListsProducts();
