import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const service = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    const result = await service.login(req.body);
    res.json({ status: 'success', data: result });
  }
}
