import { Request, Response, NextFunction } from "express";
import * as jose from "jose";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client();

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
  // https://developers.google.com/identity/gsi/web/guides/verify-google-id-token#node.js
  if (decode) {
    const ticket = client.verifyIdToken({
      idToken: decode.payload.credential as string,
      audience: decode.payload.clienyId as string,
    });
    const payload = (await ticket).getPayload();

    const userId = payload && payload["sub"];

    if (!userId) {
      const notAuthorized = new Error("Not Authorized");
      return next(notAuthorized);
    }

    return next();
  }
};
