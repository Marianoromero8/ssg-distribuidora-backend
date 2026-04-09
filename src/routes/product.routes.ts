import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import { createProductSchema, updateProductSchema } from '../types/product.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new ProductController();

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/admin', authenticate, authorize(Role.ADMIN, Role.EMPLOYEE), ctrl.getAllAdmin.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));

router.post('/', authenticate, authorize(Role.ADMIN), validate(createProductSchema), ctrl.create.bind(ctrl));
router.put('/:id', authenticate, authorize(Role.ADMIN), validate(updateProductSchema), ctrl.update.bind(ctrl));
router.patch('/:id/image', authenticate, authorize(Role.ADMIN), upload.single('image'), ctrl.uploadImage.bind(ctrl));
router.delete('/:id', authenticate, authorize(Role.ADMIN), ctrl.delete.bind(ctrl));
router.delete('/:id/permanent', authenticate, authorize(Role.ADMIN), ctrl.hardDelete.bind(ctrl));

export default router;
