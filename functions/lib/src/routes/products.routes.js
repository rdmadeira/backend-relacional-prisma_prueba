import { Router } from "express";
import multer from "multer";
import { updateProductsAndCodRedToDBHandle, createProductsAndCodRedToDBHandle, getAllProductsHandle, } from "../handles/products.handle.js";
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ /* dest: '/uploads' */ storage: storage }); // sin poner opts dest, y poniendo storage, evitamos grabar el archivo en disco
router.post("/update", upload.single("importado_Tevelam_general"), updateProductsAndCodRedToDBHandle);
router.post("/create", createProductsAndCodRedToDBHandle);
router.get("/", getAllProductsHandle);
export default router;