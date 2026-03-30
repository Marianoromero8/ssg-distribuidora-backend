import { Router } from 'express';
import { BannerController } from '../controllers/banner.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import { updateBannerSchema, reorderBannersSchema } from '../types/banner.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new BannerController();

// Public — frontend Home page fetches this
router.get('/', ctrl.getActive.bind(ctrl));

// Admin only
router.get('/admin', authenticate, authorize(Role.ADMIN), ctrl.getAll.bind(ctrl));
router.post('/', authenticate, authorize(Role.ADMIN), upload.single('file'), ctrl.create.bind(ctrl));
router.put('/:id', authenticate, authorize(Role.ADMIN), validate(updateBannerSchema), ctrl.update.bind(ctrl));
router.patch('/:id/media', authenticate, authorize(Role.ADMIN), upload.single('file'), ctrl.replaceMedia.bind(ctrl));
router.patch('/reorder', authenticate, authorize(Role.ADMIN), validate(reorderBannersSchema), ctrl.reorder.bind(ctrl));
router.delete('/:id', authenticate, authorize(Role.ADMIN), ctrl.delete.bind(ctrl));

export default router;
