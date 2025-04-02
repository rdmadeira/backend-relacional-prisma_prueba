import { NextFunction, Request, Response } from "express";
import busboy from "busboy";
// import os from 'os';

import { createproductstoDB, updateProductstoDB } from "../../prisma/seed.js";
import {
  obtainDataFromXlsx,
  getProductsFromDB,
} from "../utils/getDataFromXls.js";
import { iFile } from "entities/products.js";

/* import path from "path";
import os from "os";
import fs from "fs";
 */
import BadRequestError from "../errors/BadRequestError.js";

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

export const updateProductsAndCodRedToDBHandle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Inicio del update:... ", new Date(Date.now()).toString());
  const bb = busboy({ headers: req.headers });
  /*  const uploads: {} = {}; */

  try {
    bb.on("file", (name: any, file: any, info: any) => {
      const { mimeType, filename, encoding } = info;
      console.log(
        `File: ${file}, filename: ${name}, encoding: ${encoding}, mimetipe: ${mimeType}`,
      );

      file
        .on("data", (chunk: Buffer<ArrayBufferLike>) => {
          console.log(`File ${filename} has ${chunk.length} bytes`);
          console.log("chunk", chunk);

          /* const filepath = path.join(os.tmpdir(), fieldname);
          uploads[fieldname] = { file: filepath };
          console.log(`Saving '${fieldname}' to ${filepath}`);
          file.pipe(fs.createWriteStream(filepath)); */

          obtainDataFromXlsx(chunk)
            .then(flatdata => {
              updateProductstoDB(flatdata)
                .then(msg => {
                  console.log(msg);
                  return res.json({ msg: "Updated with success!!" });
                })
                .catch((err: Error) => {
                  console.log("err  ", err);

                  const obtainDataError = new BadRequestError(err.message);
                  return next(obtainDataError);
                });
            })
            .catch(error => {
              console.log("error", error);

              const obtainDataError = new BadRequestError(error.message);
              return next(obtainDataError);
            });
        })
        .on("close", () => {
          console.log(`File [${filename}] done`);
        });
    });

    bb.on("close", () => {
      console.log("upload Done!");
    });
    bb.on("finish", () => {
      console.log("Finish upload Done!");
    });

    bb.end(req.body);
    req.pipe(bb);
    console.log("req.body", req.body, req.file);
  } catch (error) {
    console.log("error", error);
  }
};

export const getAllProductsHandle = (req: Request, res: Response) => {
  const { query } = req;

  if (query) {
    getProductsFromDB(query.empresa as string, query.iscurrent as string)
      .then(data => {
        console.log("query.empresa", query.empresa);
        /* console.log('allProducts', Buffer.from(JSON.stringify(data))); */
        const msg = "Solicitud de todos los productos con exito.";
        console.log("Productos leidos con exito");

        res.status(200).json({
          message: msg,
          data: data,
        });
      })
      .catch(err => {
        const msg = "Hubo un problema en consultar la db";
        console.log(msg, err);
        res.status(500).json({ message: msg });
        throw err;
      });
  }
};
