import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import routes from "./routes/index.js";

const app: Application = express();
dotenv.config({ path: process.cwd() });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});
app.use(cors());

///////////////////////////////////////////////////////////////////////////
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message:
      "Para entrar en la api: Especificá una ruta completa con una entidad, formato de ruta /api/v1/<entidad>",
  });
});
app.use("/api/v1", routes);

///////////////////////////////////////////////////////////////////////////
import { onRequest } from "firebase-functions/v2/https";

// const port = parseFloat(process.env.PORTA || "3001");
//
// app.listen(port, () => console.log("Server running on port: ", port));

export const tevelamFunctions = onRequest(app);
