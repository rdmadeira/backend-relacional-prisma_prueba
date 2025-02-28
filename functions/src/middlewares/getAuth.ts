import { Request, Response, NextFunction } from "express";
import * as jose from "jose";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client();
import NotAuthorizedError from "../errors/NotAuthorizedError.js";

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
    const notAuthorized = new NotAuthorizedError("Not Authorized!");
    return next(notAuthorized);
  }

  const decode = await jose.jwtVerify(jwtToken, secret);
  console.log("decode", decode);

  if (!decode) {
    const notAuthorized = new NotAuthorizedError("Not Authorized!");
    return next(notAuthorized);
  }

  /* HACER ACÁ LA VALIDACION DEL TOKEN CON USUARIO - PENSAR COMO */
  // https://developers.google.com/identity/gsi/web/guides/verify-google-id-token#node.js

  const { exp } = decode.payload;

  console.log("exp && Date.now()", exp, Date.now() / 1000);

  if (exp && Date.now() / 1000 > exp /* + 320 */) {
    const notAuthorized = new NotAuthorizedError(
      "Token expired. Please SignIn!",
    );

    return next(notAuthorized);
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: decode.payload.credential as string,
      audience: decode.payload.clienyId as string,
    });
    const payload = ticket.getPayload();

    const userId = payload && payload["sub"];

    const isTooLate = payload && payload["exp"] < payload["iat"];
    console.log("isTooLate", isTooLate);

    if (!userId) {
      const notAuthorized = new NotAuthorizedError("Not Authorized!");
      return next(notAuthorized);
    }

    return next();
  } catch (error) {
    const notAuthorized = new NotAuthorizedError(
      "Token expired. Please SignIn!",
    );

    return error && next(notAuthorized);
  }
};
