import { Router } from 'express';
import { PFSettingsController } from '../controllers/pfSettings.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { updatePFSettingsSchema } from '../types/pfSettings.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new PFSettingsController();

router.get('/public', ctrl.getPublic.bind(ctrl));
router.get('/', authenticate, authorize(Role.ADMIN), ctrl.get.bind(ctrl));
router.put(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  validate(updatePFSettingsSchema),
  ctrl.update.bind(ctrl)
);

export default router;
