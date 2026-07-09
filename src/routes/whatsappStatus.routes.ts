import { Router } from 'express';
import { WhatsappStatusController } from '../controllers/whatsappStatus.controller';

const router = Router();
const ctrl = new WhatsappStatusController();

// Público — sin datos sensibles (solo boolean + timestamps), pensado para
// que un monitor externo (UptimeRobot) lo pueda pollear sin autenticación.
router.get('/', ctrl.get.bind(ctrl));

export default router;
