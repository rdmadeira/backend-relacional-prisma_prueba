import { utils, read, stream /* * as XLSX */ } from "xlsx/xlsx.mjs";
import { WorkSheet } from "xlsx/types";
import { Readable } from "stream";

import {
  Product,
  CodigoReducido,
  ProductExcelTotal,
  Marca,
} from "../entities/products.js";
import { readAllProducts } from "../../prisma/read.js";

//Cambio de Header para adaptarse a la DB:
const adaptHeadersToDBKeys = (sheet: WorkSheet) => {
  utils.sheet_add_aoa(sheet, [
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
      "rubro",
    ],
  ]);
};

// Seed & update:
export const obtainDataFromXlsx = async (
  buffer: Buffer<ArrayBufferLike>,
): Promise<{
  productsToFlatArray: ProductExcelTotal[];
}> => {
  // const xlsPath = path.resolve('src', 'xls');
  const myFile = read(buffer /* xlsPath.concat('/' + xlsxName) */);
  const mySheet = myFile.Sheets["Hoja2"];
  adaptHeadersToDBKeys(mySheet);

  // Transformar en stream y leer la data:
  const myFileStream: Readable = await stream.to_json(mySheet); // Stream lo hace mas rápido para archivos grandes

  const productsToFlatArray: ProductExcelTotal[] = [];

  /* const codReducidoToFlatArray: CodigoReducido[] = []; */

  return new Promise((resolve, reject) => {
    // tuve que usar Reject, Resolve para devolver un valor a la funcion asincrona y a los listeners
    myFileStream
      .on("data", (row: ProductExcelTotal) => {
        if (
          (row.tipo_de_producto === "MR-AUD" ||
            row.tipo_de_producto === "MR-ILU" ||
            row.tipo_de_producto === "MR-INS" ||
            row.tipo_de_producto === "MR-VID") &&
          row.codigo_reducido &&
          typeof row.codigo_reducido === "string" &&
          row.descripcion
        ) {
          productsToFlatArray.push(row);
          /* const {
            marca,
            descripcion,
            precio_usd,
            precio_arg,
            tasa_iva,
            costo_repo_usd,
            mkup,
            stock_disp,
            stock_larp,
            sku,
            tipo_de_producto: tipoId,
            concepto: ConceptoId,
            codigo_reducido,
            codigo_de_producto,
            rubro,
          } = row;

          const id = row?.codigo_de_producto?.replace(
            row?.codigo_de_producto?.slice(12, 16),
            '',
          );

          const product: Product = {
            id,
            marca,
            descripcion: descripcion.replace(/\n/, ' '),
            precio_usd,
            precio_arg,
            tasa_iva,
            costo_repo_usd,
            mkup,
            stock_disp,
            stock_larp,
            sku: sku ? sku.toString() : null,
            tipoId,
            ConceptoId,
            is_current: false,
            rubro: rubro || '',
          };

          const codRed: CodigoReducido = {
            codigo: codigo_reducido,
            codigo_largo: codigo_de_producto,
            stock_dis: stock_disp,
            stock_lar: stock_larp,
            productoId: id,
          };

          productsToFlatArray.push({
            ...product,
          });

          codReducidoToFlatArray.push({
            ...codRed,
          }); */
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
        /* console.log(
          `Codigos reducidos extraídos de Excel con suceso: ${codReducidoToFlatArray.length} códigos`,
        ); */
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
  console.log("productsToDB.length", productsToDB.length);
  console.log("data.codReducidoToFlatArray", codRed.length);
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

export const getProductsFromDB = async () => {
  const allProducts = await readAllProducts();

  return allProducts;
};