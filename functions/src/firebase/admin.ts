import admin from "firebase-admin";

// import serviceAccount from "./config.ts";
//import {appendFile} from "fs";
import serviceAccount from "./config.js";

const admin2 = admin.initializeApp({
  credential: admin.credential.cert(JSON.stringify(serviceAccount)),
});

export default admin2;
