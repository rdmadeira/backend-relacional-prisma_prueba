import { Router } from "express";
import productsRoutes from "./products.routes.js";
const router = Router();
router.use("/products", productsRoutes);
router.get("/", (req, res) => {
    res.status(200).json({
        message: "Especificá una entidad, formato de ruta /api/v1/<entidad>",
    });
});
export default router;