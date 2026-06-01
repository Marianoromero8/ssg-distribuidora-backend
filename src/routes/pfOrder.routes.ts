import { Router } from 'express';
import { PFOrderController } from '../controllers/pfOrder.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createPFOrderSchema, updatePFOrderStatusSchema } from '../types/pfOrder.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new PFOrderController();

// Public — client submits order from Punto Fiesta site
router.post('/', validate(createPFOrderSchema), ctrl.create.bind(ctrl));

// Dashboard — admin/employee manages orders
router.get('/', authenticate, authorize(Role.ADMIN, Role.EMPLOYEE), ctrl.getAll.bind(ctrl));
router.get('/:id', authenticate, authorize(Role.ADMIN, Role.EMPLOYEE), ctrl.getById.bind(ctrl));
router.patch(
  '/:id/status',
  authenticate,
  authorize(Role.ADMIN, Role.EMPLOYEE),
  validate(updatePFOrderStatusSchema),
  ctrl.updateStatus.bind(ctrl)
);

export default router;
