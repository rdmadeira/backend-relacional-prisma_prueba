import { utils, readFile, stream /* * as XLSX */ } from "xlsx/xlsx.mjs";
import { WorkSheet } from "xlsx/types";

import path from "path";
import { Readable } from "stream";
// import fs from 'fs';
import {
  Product,
  CodigoReducido,
  ProductExcelTotal,
} from "../entities/products.js";

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
    ],
  ]);
};

export const obtainDataFromXlsx = async (
  xlsxName: string,
): Promise<{
  productsToUpload: Product[];
  codReducidoToUpload: CodigoReducido[];
}> => {
  const xlsPath = path.resolve("src", "xls");
  const myFile = readFile(xlsPath.concat("/" + xlsxName));
  const mySheet = myFile.Sheets["Hoja3"];
  adaptHeadersToDBKeys(mySheet);

  // Transformar en stream y leer la data:
  const myFileStream: Readable = await stream.to_json(mySheet); // Stream lo hace mas rápido para archivos grandes

  const productsToUpload: Product[] = [];
  // let productsToUploadBuffer: Buffer<ArrayBuffer>;
  const codReducidoToUpload: CodigoReducido[] = [];
  // let codReducidoToUploadBuffer: Buffer<ArrayBuffer>;
  /* const productsToUploadBuffer: Buffer[] = [];

  const codReducidoToUploadBuffer: Buffer[] = []; */

  return new Promise((resolve, reject) => {
    // tuve que usar Reject, Resolve para devolver un valor a la funcion asincrona y a los listeners
    myFileStream
      .on("data", (row: ProductExcelTotal) => {
        const {
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
        } = row;

        const id = row?.codigo_de_producto?.replace(
          row?.codigo_de_producto?.slice(12, 16),
          "",
        );

        const product: Product = {
          id,
          marca,
          descripcion,
          precio_usd,
          precio_arg,
          tasa_iva,
          costo_repo_usd,
          mkup,
          stock_disp,
          stock_larp,
          sku: sku || null,
          tipoId,
          ConceptoId,
          is_current: false,
          rubro: "",
        };

        const codRed: CodigoReducido = {
          codigo: codigo_reducido,
          codigo_largo: codigo_de_producto,
          stock_dis: stock_disp,
          stock_lar: stock_larp,
          productoId: id,
          marcaId: marca,
        };

        if (
          row.tipo_de_producto === "MR-AUD" ||
          row.tipo_de_producto === "MR-ILU" ||
          row.tipo_de_producto === "MR-INS" ||
          row.tipo_de_producto === "MR-VID"
        ) {
          if (
            !codReducidoToUpload.find(
              value => row.codigo_reducido.slice(1) === value.codigo.slice(1),
            )
          ) {
            productsToUpload.push({
              ...product,
            });
            /* productsToUploadBuffer.push(Buffer.from(JSON.stringify(product))); */

            // const buf = Buffer.from(JSON.stringify(product));
            // productsToUploadBuffer.push(buf);
          } else {
            productsToUpload.forEach(product => {
              if (product.id === codRed.productoId) {
                // Si el id del producto es igual
                product.stock_disp += stock_disp;
                product.stock_larp += stock_larp;
                /* productsToUploadBuffer[index] = Buffer.from(
                  JSON.stringify(product),
                  ); */
              }
              /* productsToUploadBuffer.push(Buffer.from(JSON.stringify(product))); */
            });
          }

          codReducidoToUpload.push({
            ...codRed,
          });
          /* codReducidoToUploadBuffer.push(Buffer.from(JSON.stringify(codRed))); */
        }
        /* productsToUploadBuffer = Buffer.from(JSON.stringify(productsToUpload));
        codReducidoToUploadBuffer = Buffer.from(
          JSON.stringify(codReducidoToUpload),
        ); */
      })
      .on("error", error => reject(console.log("error", error)))
      .on("end", () => {
        console.log(
          `Productos extraídos con suceso: ${productsToUpload.length} productos`,
        );
        console.log(
          `Codigos reducidos extraídos con suceso: ${codReducidoToUpload.length} códigos`,
        );
        return resolve({
          productsToUpload,
          codReducidoToUpload,
        });
      });
  });
};

obtainDataFromXlsx("importado_Tevelam_general.xlsx") // archivo tiene que estar en la carpeta src/xls
  .then(() => console.log("Finalizado programa..."))
  .catch(error => console.log("error", error));
/* *************  Diferencia ArrayBuffer vs Buffer ************************ */
/* function toArrayBuffer(buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}


function toBuffer(arrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
    return buffer;
} or
var buffer = Buffer.from( new Uint8Array(arrayBuffer) );
*/
