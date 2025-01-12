import xlsx from 'xlsx';
import {Readable} from 'stream';

import {
  Product,
  CodigoReducido,
  ProductExcelTotal,
  Marca,
} from '../entities/products';
import {readAllProducts} from '../../prisma/read';

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
      'rubro',
    ],
  ]);
};

export const obtainDataFromXlsx = async (
  buffer: Buffer<ArrayBufferLike>,
): Promise<{
  productsToFlatArray: Product[];
  codReducidoToFlatArray: CodigoReducido[];
}> => {
  // const xlsPath = path.resolve('src', 'xls');
  const myFile = xlsx.read(buffer /* xlsPath.concat('/' + xlsxName) */);
  const mySheet = myFile.Sheets['Hoja2'];
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
          (row.tipo_de_producto === 'MR-AUD' ||
            row.tipo_de_producto === 'MR-ILU' ||
            row.tipo_de_producto === 'MR-INS' ||
            row.tipo_de_producto === 'MR-VID') &&
          row.codigo_reducido &&
          typeof row.codigo_reducido === 'string' &&
          row.descripcion
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

export const prepareProductsToDB = (data: {
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

export const prepareDataToSeed = (data: {
  productsToFlatArray: Product[];
  codReducidoToFlatArray: CodigoReducido[];
}) => {
  const {productsToDB} = prepareProductsToDB(data);

  const arrayOfMarcas: string[] = productsToDB.map(({marca}) => {
    return marca;
  });
  const marcaToDB: Marca[] = [];

  const arrayOfMarcasSinRepetir = [...new Set(arrayOfMarcas)];

  arrayOfMarcasSinRepetir.forEach(marca => {
    let empresaId: number;
    const marcasDiscopro = [
      'Adam'.toLowerCase(),
      'Apogee'.toLowerCase(),
      'Aston'.toLowerCase(),
      'Celestion'.toLowerCase(),
      'C-series'.toLowerCase(),
      'DAS'.toLowerCase(),
      'DFX'.toLowerCase(),
      'Focusrite'.toLowerCase(),
      'Novation'.toLowerCase(),
      'Klark Teknik'.toLowerCase(),
      'Költ'.toLowerCase(),
      'Midas'.toLowerCase(),
      'Mode'.toLowerCase(),
      'SHURE'.toLowerCase(),
      'tannoy'.toLowerCase(),
      'PLS'.toLowerCase(),
      'Hercules'.toLowerCase(),
      'Proled'.toLowerCase(),
    ];
    const marcasTevelam = [
      'Behringer'.toLowerCase(),
      'Benson'.toLowerCase(),
      'Bugera'.toLowerCase(),
      'Gator'.toLowerCase(),
      'J Series'.toLowerCase(),
      'JBL CAR AUDIO'.toLowerCase(),
      'JBL Selenium'.toLowerCase(),
      'Legend'.toLowerCase(),
      'Lexsen'.toLowerCase(),
      'Mapex'.toLowerCase(),
      'Marshall'.toLowerCase(),
      'Medeli'.toLowerCase(),
      'Natal'.toLowerCase(),
      'Newen'.toLowerCase(),
      'Orion'.toLowerCase(),
      'TC Electronic'.toLowerCase(),
      'TC Helicon'.toLowerCase(),
      'Turbosound'.toLowerCase(),
      'Warwick'.toLowerCase(),
      'Washburn'.toLowerCase(),
    ];

    if (new RegExp(marcasDiscopro.join('|')).test(marca.toLowerCase())) {
      empresaId = 1;
    } else if (new RegExp(marcasTevelam.join('|')).test(marca.toLowerCase())) {
      empresaId = 2;
    } else {
      empresaId = 3;
    }
    console.log({marca, empresaId});
    marcaToDB.push({marca, empresaId});
  });

  return {productsToDB, codRedToDB: data.codReducidoToFlatArray, marcaToDB};
};

export const getProductsFromDB = async () => {
  const allProducts = await readAllProducts();

  return allProducts;
};
