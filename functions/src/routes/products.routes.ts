import { Router } from "express";
//import multer from "multer";

import {
  updateProductsAndCodRedToDBHandle,
  createProductsAndCodRedToDBHandle,
  getAllProductsHandle,
} from "../handles/products.handle.js";

// import { authenticator } from "../middlewares/getAuth.js";

const router = Router();

// const storage = multer.memoryStorage();

// const upload = multer({
//  storage: storage,
// }); // sin poner opts dest, y poniendo storage, evitamos grabar el archivo en disco

router.post("/update", updateProductsAndCodRedToDBHandle);
router.post("/create", createProductsAndCodRedToDBHandle);
router.get("/", getAllProductsHandle);

export default router;
