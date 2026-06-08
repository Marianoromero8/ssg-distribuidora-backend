import { Router } from 'express';
import { PFProductController } from '../controllers/pfProduct.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import { createPFProductSchema, updatePFProductSchema } from '../types/pfProduct.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new PFProductController();

// Public
router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));

// Admin
router.post('/', authenticate, authorize(Role.ADMIN), validate(createPFProductSchema), ctrl.create.bind(ctrl));
router.patch('/:id', authenticate, authorize(Role.ADMIN), validate(updatePFProductSchema), ctrl.update.bind(ctrl));
router.post('/:id/image', authenticate, authorize(Role.ADMIN), upload.single('image'), ctrl.uploadImage.bind(ctrl));
router.delete('/:id', authenticate, authorize(Role.ADMIN), ctrl.delete.bind(ctrl));

export default router;
