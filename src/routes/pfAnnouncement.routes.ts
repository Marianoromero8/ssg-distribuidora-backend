import { Router } from 'express';
import { PFAnnouncementController } from '../controllers/pfAnnouncement.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import { updatePFAnnouncementSchema } from '../types/pfAnnouncement.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new PFAnnouncementController();

// Public — PF frontend fetches on home load
router.get('/active-popup', ctrl.getActivePopups.bind(ctrl));
router.get('/active-carousel', ctrl.getActiveCarousel.bind(ctrl));

// Admin only
router.get('/', authenticate, authorize(Role.ADMIN), ctrl.getAll.bind(ctrl));
router.post(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  upload.single('image'),
  ctrl.create.bind(ctrl)
);
router.put(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  validate(updatePFAnnouncementSchema),
  ctrl.update.bind(ctrl)
);
router.patch(
  '/:id/image',
  authenticate,
  authorize(Role.ADMIN),
  upload.single('image'),
  ctrl.replaceImage.bind(ctrl)
);
router.delete('/:id', authenticate, authorize(Role.ADMIN), ctrl.delete.bind(ctrl));

export default router;
