import { Router } from 'express';
import { AnnouncementController } from '../controllers/announcement.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import { updateAnnouncementSchema } from '../types/announcement.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new AnnouncementController();

// Public — frontend checks for active announcement on load
router.get('/active', ctrl.getActive.bind(ctrl));

// Admin only
router.get('/', authenticate, authorize(Role.ADMIN), ctrl.getAll.bind(ctrl));
router.post('/', authenticate, authorize(Role.ADMIN), upload.single('image'), ctrl.create.bind(ctrl));
router.put('/:id', authenticate, authorize(Role.ADMIN), validate(updateAnnouncementSchema), ctrl.update.bind(ctrl));
router.patch('/:id/image', authenticate, authorize(Role.ADMIN), upload.single('image'), ctrl.replaceImage.bind(ctrl));
router.delete('/:id', authenticate, authorize(Role.ADMIN), ctrl.delete.bind(ctrl));

export default router;
