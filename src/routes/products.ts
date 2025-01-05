import {Router} from 'express';
import multer from 'multer';

import {
  updateProductsAndCodRedToDBHandle,
  createProductsAndCodRedToDBHandle,
} from '../handles/products.handle';

const router = Router();
const upload = multer({dest: '/uploads'});

router.post(
  '/update',
  upload.single('importado_Tevelam_general'),
  updateProductsAndCodRedToDBHandle,
);
router.post('/create', createProductsAndCodRedToDBHandle);

export default router;
