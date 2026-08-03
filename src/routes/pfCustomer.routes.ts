import { Router } from 'express';
import { PFCustomerController } from '../controllers/pfCustomer.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { getPFCustomersQuerySchema, getPFCustomerParamsSchema } from '../types/pfCustomer.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new PFCustomerController();

// Dashboard — admin ve perfiles de clientes (Punto Fiesta es ADMIN-only)
router.get(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  validate(getPFCustomersQuerySchema),
  ctrl.getAll.bind(ctrl)
);
router.get(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  validate(getPFCustomerParamsSchema),
  ctrl.getById.bind(ctrl)
);

export default router;
