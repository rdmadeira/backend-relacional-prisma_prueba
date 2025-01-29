import { iFile } from "entities/products.ts";
declare module "express-serve-static-core" {
  export interface Request {
    file?: iFile;
  }
}
