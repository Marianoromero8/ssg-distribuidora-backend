import { Router } from 'express';
import { ZoneController } from '../controllers/zone.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createZoneSchema, updateZoneSchema } from '../types/zone.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new ZoneController();

// Any authenticated user can read zones (needed to show in user schedule)
router.get('/', authenticate, authorize(Role.ADMIN, Role.EMPLOYEE), ctrl.getAll.bind(ctrl));
router.get('/active', ctrl.getAllActive.bind(ctrl));
router.get('/:id', authenticate, authorize(Role.ADMIN, Role.EMPLOYEE), ctrl.getById.bind(ctrl));

router.post('/', authenticate, authorize(Role.ADMIN), validate(createZoneSchema), ctrl.create.bind(ctrl));
router.put('/:id', authenticate, authorize(Role.ADMIN), validate(updateZoneSchema), ctrl.update.bind(ctrl));
router.delete('/:id', authenticate, authorize(Role.ADMIN), ctrl.delete.bind(ctrl));

export default router;
