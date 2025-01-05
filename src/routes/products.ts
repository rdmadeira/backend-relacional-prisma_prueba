import {Router} from 'express';
import {
  updateProductsAndCodRedToDBHandle,
  createProductsAndCodRedToDBHandle,
} from '../handles/products.handle';

const router = Router();

router.post('/update', updateProductsAndCodRedToDBHandle);
router.post('/create', createProductsAndCodRedToDBHandle);

export default router;
