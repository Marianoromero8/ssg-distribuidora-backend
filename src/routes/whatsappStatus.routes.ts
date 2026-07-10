import { Router } from 'express';
import { WhatsappStatusController } from '../controllers/whatsappStatus.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new WhatsappStatusController();

// Público — sin datos sensibles (solo boolean + timestamps), pensado para
// que un monitor externo (UptimeRobot) lo pueda pollear sin autenticación.
router.get('/status', ctrl.get.bind(ctrl));

router.get('/qr', authenticate, authorize(Role.ADMIN), ctrl.getQr.bind(ctrl));
router.post('/reconnect', authenticate, authorize(Role.ADMIN), ctrl.reconnect.bind(ctrl));

export default router;
