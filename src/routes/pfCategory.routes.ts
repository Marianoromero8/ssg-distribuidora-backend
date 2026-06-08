import { Router } from 'express';
import { PFCategoryController } from '../controllers/pfCategory.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createPFCategorySchema, updatePFCategorySchema } from '../types/pfCategory.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new PFCategoryController();

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));
router.post('/', authenticate, authorize(Role.ADMIN), validate(createPFCategorySchema), ctrl.create.bind(ctrl));
router.patch('/:id', authenticate, authorize(Role.ADMIN), validate(updatePFCategorySchema), ctrl.update.bind(ctrl));
router.delete('/:id', authenticate, authorize(Role.ADMIN), ctrl.delete.bind(ctrl));

export default router;
