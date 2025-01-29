import { Request, Response } from "express";
// import os from 'os';

import { createproductstoDB, updateProductstoDB } from "../../prisma/seed.js";
import {
  obtainDataFromXlsx,
  getProductsFromDB,
} from "../utils/getDataFromXls.js";
import { iFile } from "entities/products.js";

// const tmpPath = os.tmpdir();

export const createProductsAndCodRedToDBHandle = (
  req: Request,
  res: Response,
) => {
  const { originalname, mimetype, buffer } = (req.file as iFile) || {
    originalname: undefined,
    mimetype: undefined,
    buffer: undefined,
  };
  console.log(originalname, mimetype, buffer);

  // const xlsFineName = 'importado_Tevelam_general.xlsx';
  buffer &&
    obtainDataFromXlsx(buffer)
      .then(flatdata => {
        /* const dataToDB = prepareProductsToDB(flatdata); */

        createproductstoDB(flatdata)
          .then(() => {
            const msg = "db actualizada con suceso";
            console.log(msg);
            res.status(200).json({ message: msg });
          })
          .catch((err: Error) => {
            const msg = "Hubo un problema en alimentar la db";
            console.log(msg, err);
            res.status(500).json({ message: msg });
            throw err;
          });
      })
      .catch(error => console.log("error", error));
};

export const updateProductsAndCodRedToDBHandle = (
  req: Request,
  res: Response,
) => {
  console.log("Inicio del update:... ", new Date(Date.now()).toString());

  const { buffer } = req.file || {
    originalname: undefined,
    mimetype: undefined,
    buffer: undefined,
  };

  buffer &&
    obtainDataFromXlsx(buffer)
      .then(flatdata => {
        /* const dataToDB = prepareProductsToDB(flatdata); */

        updateProductstoDB(flatdata)
          .then(msg => {
            console.log(msg);
            res.status(200).json({ message: msg });
          })
          .catch((err: Error) => {
            const msg = "Hubo un problema en alimentar la db";
            console.log(msg, err);
            res.status(500).json({ message: msg });
            throw err;
          });
      })
      .catch(error => console.log("error", error));
};

export const getAllProductsHandle = (req: Request, res: Response) => {
  getProductsFromDB()
    .then(data => {
      /* console.log('allProducts', Buffer.from(JSON.stringify(data))); */
      const msg = "Solicitud de todos los productos con exito.";
      console.log("Productos leidos con exito");

      res.status(200).json({
        message: msg,
        data: data,
      });
    })
    .catch(err => {
      const msg = "Hubo un problema en alimentar la db";
      console.log(msg, err);
      res.status(500).json({ message: msg });
      throw err;
    });
};
