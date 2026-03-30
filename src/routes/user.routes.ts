import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createUserSchema, updateUserStatusSchema } from '../types/user.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new UserController();

router.use(authenticate, authorize(Role.ADMIN));

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));
router.post('/', validate(createUserSchema), ctrl.create.bind(ctrl));
router.patch('/:id/status', validate(updateUserStatusSchema), ctrl.updateStatus.bind(ctrl));

export default router;
