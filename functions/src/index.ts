import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { applicationDefault } from "firebase-admin/app";

import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorsHandler.js";

import admin from "firebase-admin";

admin.initializeApp({
  credential: applicationDefault(),
});

const app: Application = express();
dotenv.config({ path: process.cwd() });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, DELETE, POST, GET, PATCH, PUT",
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Max-Age", "3600");

  if (req.method === "OPTIONS") {
    console.log("req.method", req.method);

    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, DELETE, POST, GET, PATCH, PUT",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, X-Requested-With, Content-Type, Accept",
    );
    res.setHeader("Access-Control-Max-Age", "3600");
    res.status(204).send("OK");
  }
  next();
});
const corsOptions = {
  origin: ["*"], // Whitelist domains
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

///////////////////////////////////////////////////////////////////////////
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message:
      "Para entrar en la api: Especificá una ruta completa con una entidad, formato de ruta /api/v1/<entidad>",
  });
});
app.use("/api/v1", routes);

app.use(errorHandler as express.ErrorRequestHandler);

///////////////////////////////////////////////////////////////////////////
import { onRequest } from "firebase-functions/v2/https";

// const port = parseFloat(process.env.PORTA || "3001");
//
// app.listen(port, () => console.log("Server running on port: ", port));

export const tevelamFunctions = onRequest(app);

export const testFunctions = onRequest({ cors: true }, (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  response.set("Access-Control-Max-Age", "3600");
  response.status(200).json({ msg: "test functions ok" });
});
