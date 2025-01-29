import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { applicationDefault, initializeApp } from "firebase-admin/app";

import routes from "./routes/index.js";

/* import serviceAccount from "./firebase/config.js";
console.log("serviceAccount", serviceAccount); */

initializeApp({ credential: applicationDefault() }); // puse el comando en powershell $env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\Administrador\Downloads\tevelam-5c6b4-firebase-adminsdk-iit3y-d8193a4ed1.json"

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

export const testFunctions = onRequest({}, (request, response) => {
  response.status(200).json({ msg: "test functions ok" });
});
