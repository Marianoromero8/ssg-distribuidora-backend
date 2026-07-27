import { Router } from 'express';
import { WhatsappStatusController } from '../controllers/whatsappStatus.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new WhatsappStatusController();

router.get('/status', authenticate, ctrl.get.bind(ctrl));

router.get('/qr', authenticate, authorize(Role.ADMIN), ctrl.getQr.bind(ctrl));
router.post('/reconnect', authenticate, authorize(Role.ADMIN), ctrl.reconnect.bind(ctrl));

export default router;
