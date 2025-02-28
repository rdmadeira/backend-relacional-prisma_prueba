import { Router } from "express";
import { createOrderHandle } from "../handles/orders.handle.js";

const router = Router();

router.post("/create", createOrderHandle);

export default router;
