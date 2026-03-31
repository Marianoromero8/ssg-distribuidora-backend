import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createCategorySchema, updateCategorySchema } from '../types/category.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new CategoryController();

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/roots', ctrl.getRoots.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));

router.post('/', authenticate, authorize(Role.ADMIN), validate(createCategorySchema), ctrl.create.bind(ctrl));
router.put('/:id', authenticate, authorize(Role.ADMIN), validate(updateCategorySchema), ctrl.update.bind(ctrl));
router.delete('/:id', authenticate, authorize(Role.ADMIN), ctrl.delete.bind(ctrl));

export default router;
