import { Router } from 'express';
import { PromotionController } from '../controllers/promotion.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createPromotionSchema, updatePromotionSchema } from '../types/promotion.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new PromotionController();

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));
router.get('/product/:productId', ctrl.getByProduct.bind(ctrl));

router.post('/', authenticate, authorize(Role.ADMIN, Role.EMPLOYEE), validate(createPromotionSchema), ctrl.create.bind(ctrl));
router.put('/:id', authenticate, authorize(Role.ADMIN, Role.EMPLOYEE), validate(updatePromotionSchema), ctrl.update.bind(ctrl));
router.delete('/:id', authenticate, authorize(Role.ADMIN), ctrl.delete.bind(ctrl));

export default router;
