import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../types/auth.types';

const router = Router();
const ctrl = new AuthController();

router.post('/login', validate(loginSchema), ctrl.login.bind(ctrl));

export default router;
