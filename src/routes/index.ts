import {Router, Request, Response} from 'express';
import productsRoutes from './products.routes';

const router = Router();

router.use('/products', productsRoutes);

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Especificá una entidad, formato de ruta /api/v1/<entidad>',
  });
});

export default router;
