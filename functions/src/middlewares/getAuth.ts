import { Request, Response, NextFunction } from "express";
import * as jose from "jose";

export const authenticator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jwtToken =
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  if (!jwtToken) {
    const notAuthorized = new Error("Not Authorized");
    return next(notAuthorized);
  }

  const decode = await jose.jwtVerify(jwtToken, secret);

  if (!decode) {
    const notAuthorized = new Error("Not Authorized");
    return next(notAuthorized);
  }

  /* HACER ACÁ LA VALIDACION DEL TOKEN CON USUARIO - PENSAR COMO */
  /* if (decode) {
    
  } */
  return next();
};
