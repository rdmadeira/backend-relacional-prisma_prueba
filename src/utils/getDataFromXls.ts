import xlsx from 'xlsx';
import path from 'path';
import {Readable} from 'stream';

import {Product, CodigoReducido, ProductExcelTotal} from '../entities/products';

//Cambio de Header para adaptarse a la DB:
const adaptHeadersToDBKeys = (sheet: xlsx.WorkSheet) => {
  xlsx.utils.sheet_add_aoa(sheet, [
    [
      'codigo_reducido',
      'tipo_de_producto',
      'codigo_de_producto',
      'concepto',
      'marca',
      'descripcion',
      'precio_usd',
      'precio_arg',
      'tasa_iva',
      'costo_repo_usd',
      'mkup',
      'stock_disp',
      'stock_larp',
      'sku',
    ],
  ]);
};

export const obtainDataFromXlsx = async (
  xlsxName: string,
): Promise<{
  productsToFlatArray: Product[];
  codReducidoToFlatArray: CodigoReducido[];
}> => {
  const xlsPath = path.resolve('src', 'xls');
  const myFile = xlsx.readFile(xlsPath.concat('/' + xlsxName));
  const mySheet = myFile.Sheets['Hoja3'];
  adaptHeadersToDBKeys(mySheet);

  // Transformar en stream y leer la data:
  const myFileStream: Readable = await xlsx.stream.to_json(mySheet); // Stream lo hace mas rápido para archivos grandes

  const productsToFlatArray: Product[] = [];

  const codReducidoToFlatArray: CodigoReducido[] = [];

  return new Promise((resolve, reject) => {
    // tuve que usar Reject, Resolve para devolver un valor a la funcion asincrona y a los listeners
    myFileStream
      .on('data', (row: ProductExcelTotal) => {
        if (
          row.tipo_de_producto === 'MR-AUD' ||
          row.tipo_de_producto === 'MR-ILU' ||
          row.tipo_de_producto === 'MR-INS' ||
          row.tipo_de_producto === 'MR-VID'
        ) {
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
            '',
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
            sku: sku ? sku.toString() : null,
            tipoId,
            ConceptoId,
            is_current: false,
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
          });
        }
      })
      .on('error', error => {
        reject(console.log('error', error));
        throw new Error(error.message);
      })
      .on('end', () => {
        console.log(
          `Productos extraídos de Excel con suceso: ${productsToFlatArray.length} productos`,
        );
        console.log(
          `Codigos reducidos extraídos de Excel con suceso: ${codReducidoToFlatArray.length} códigos`,
        );
        return resolve({
          productsToFlatArray,
          codReducidoToFlatArray,
        });
      });
  });
};

export const prepareDataToDB = (data: {
  productsToFlatArray: Product[];
  codReducidoToFlatArray: CodigoReducido[];
}) => {
  const productsToDB: Product[] = [];
  data.productsToFlatArray.forEach((product: Product) => {
    const existentIndex = productsToDB.findIndex(
      prodToDB => product.id === prodToDB.id,
    );

    if (existentIndex >= 0) {
      const existentProduct = productsToDB[existentIndex];
      existentProduct.stock_disp += product.stock_disp;
      existentProduct.stock_larp += product.stock_larp;
    } else {
      productsToDB.push({
        ...product,
      });
    }
  });
  console.log('productsToDB.length', productsToDB.length);
  console.log(
    'data.codReducidoToFlatArray',
    data.codReducidoToFlatArray.length,
  );

  return {productsToDB, codRedToDB: data.codReducidoToFlatArray};
};

// obtainDataFromXlsx('importado_Tevelam_general.xlsx') // archivo tiene que estar en la carpeta src/xls
//   .then(data => {
//     const dataToTB = prepareDataToDB(data);
//     console.log('productosToDB', dataToTB.productsToDB.length);
//     console.log('codRedToDB', dataToTB.codRedToDB.length);
//
//     console.log('Finalizado programa...');
//   })
//   .catch(error => console.log('error', error));
