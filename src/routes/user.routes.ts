import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createUserSchema, updateUserSchema, updateUserStatusSchema, updateUserRoleSchema } from '../types/user.types';
import { createScheduleSchema, deleteScheduleSchema } from '../types/userSchedule.types';
import { Role } from '../shared/types/enums';

const router = Router();
const ctrl = new UserController();

router.use(authenticate, authorize(Role.ADMIN));

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getById.bind(ctrl));
router.post('/', validate(createUserSchema), ctrl.create.bind(ctrl));
router.patch('/:id', validate(updateUserSchema), ctrl.updateData.bind(ctrl));
router.patch('/:id/status', validate(updateUserStatusSchema), ctrl.updateStatus.bind(ctrl));
router.patch('/:id/role', validate(updateUserRoleSchema), ctrl.updateRole.bind(ctrl));
router.delete('/:id', ctrl.delete.bind(ctrl));

// User schedule (zones per day)
router.get('/:id/schedule', ctrl.getSchedule.bind(ctrl));
router.post('/:id/schedule', validate(createScheduleSchema), ctrl.addSchedule.bind(ctrl));
router.delete('/:id/schedule/:scheduleId', validate(deleteScheduleSchema), ctrl.removeSchedule.bind(ctrl));

export default router;
