import { Router } from 'express';
import { BrandController } from '../controllers/brand.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import { createBrandSchema, updateBrandSchema } from '../types/brand.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new BrandController();

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/admin', authenticate, authorize(Role.ADMIN, Role.EMPLOYEE), ctrl.getAllAdmin.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));

router.post('/', authenticate, authorize(Role.ADMIN, Role.EMPLOYEE), validate(createBrandSchema), ctrl.create.bind(ctrl));
router.put('/:id', authenticate, authorize(Role.ADMIN, Role.EMPLOYEE), validate(updateBrandSchema), ctrl.update.bind(ctrl));
router.patch('/:id/status', authenticate, authorize(Role.ADMIN, Role.EMPLOYEE), ctrl.toggleStatus.bind(ctrl));
router.patch('/:id/image', authenticate, authorize(Role.ADMIN, Role.EMPLOYEE), upload.single('image'), ctrl.uploadImage.bind(ctrl));

export default router;
