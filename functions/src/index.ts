import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
// import { applicationDefault, initializeApp } from "firebase-admin/app";

import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorsHandler.js";

/* import serviceAccount from "./firebase/config.js";
console.log("serviceAccount", serviceAccount); */

//initializeApp({ credential: applicationDefault() }); // puse el comando en powershell $env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\Administrador\Downloads\tevelam-5c6b4-firebase-adminsdk-iit3y-d8193a4ed1.json"

import admin from "firebase-admin";
import serviceAccount from "C:\\Users\\Administrador\\Downloads\\tevelam-5c6b4-firebase-adminsdk-fbsvc-efea4ac616.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(JSON.stringify(serviceAccount)),
});

const app: Application = express();
dotenv.config({ path: process.cwd() });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, DELETE, POST, GET, PATCH, PUT",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    next();
  }
});
const corsOptions = {
  origin: ["*"], // Whitelist domains
  credentials: true, // Allow cookies and credentials
};

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

export const testFunctions = onRequest({}, (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Headers", "Content-Type");
  response.set("Access-Control-Max-Age", "3600");
  response.status(200).json({ msg: "test functions ok" });
});
