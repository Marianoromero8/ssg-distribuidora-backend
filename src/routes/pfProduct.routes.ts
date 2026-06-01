import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();
const ctrl = new ProductController();

// Public — Punto Fiesta site fetches its available products
router.get('/', ctrl.getPuntoFiesta.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));

export default router;
