import { Router } from 'express';
import { PFMessageTemplateController } from '../controllers/pfMessageTemplate.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { updatePFMessageTemplateSchema } from '../types/pfMessageTemplate.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new PFMessageTemplateController();

router.get('/', authenticate, authorize(Role.ADMIN), ctrl.getAll.bind(ctrl));
router.put(
  '/:key',
  authenticate,
  authorize(Role.ADMIN),
  validate(updatePFMessageTemplateSchema),
  ctrl.update.bind(ctrl)
);

export default router;
