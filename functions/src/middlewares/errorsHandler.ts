/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/CustomError.js";

// Express cuenta la cantidad de parametros de cada middleware.
// Si tiene 4, sabe que el primero es el error:

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Si es instancia de Custom Error, este creado por nosotros:
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  console.error(err);
  res.status(400).send({ errors: [{ message: "Algo salió mal!" }] }); // respeta la misma estructura!
};
