import {Request, Response} from 'express';
import os from 'os';

import {seedproductstoDB, updateProductstoDB} from '../../prisma/seed';
import {obtainDataFromXlsx, prepareDataToDB} from '../utils/getDataFromXls';

const tmpPath = os.tmpdir();

export const createProductsAndCodRedToDBHandle = (
  req: Request,
  res: Response,
) => {
  const {originalname, mimetype, buffer} = req.file;
  console.log(originalname, mimetype, buffer);

  const xlsFineName = 'importado_Tevelam_general.xlsx';
  obtainDataFromXlsx(xlsFineName)
    .then(flatdata => {
      const dataToDB = prepareDataToDB(flatdata);

      seedproductstoDB(dataToDB)
        .then(() => console.log('db migrada con suceso'))
        .catch((err: Error) => {
          console.log('Hubo un problema en alimentar la db', err);
          throw err;
        });
    })
    .catch(error => console.log('error', error));
};

export const updateProductsAndCodRedToDBHandle = (
  req: Request,
  res: Response,
) => {
  const {originalname, mimetype, buffer} = req.file;
  console.log(originalname, mimetype, buffer);

  const xlsFineName = 'importado_Tevelam_general.xlsx';
  obtainDataFromXlsx(xlsFineName)
    .then(flatdata => {
      const dataToDB = prepareDataToDB(flatdata);

      updateProductstoDB(dataToDB)
        .then(() => {
          const msg = 'db migrada con suceso';
          console.log(msg);
          res.status(200).json({message: msg});
        })
        .catch((err: Error) => {
          const msg = 'Hubo un problema en alimentar la db';
          console.log(msg, err);
          res.status(500).json({message: msg});
          throw err;
        });
    })
    .catch(error => console.log('error', error));
};

// createProductsAndCodRedToDBHandle();
// updateProductsAndCodRedToDBHandle();
