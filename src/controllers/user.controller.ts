import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const service = new UserService();

export class UserController {
  async getAll(_req: Request, res: Response) {
    const users = await service.getAll();
    res.json({ status: 'success', data: users });
  }

  async getById(req: Request, res: Response) {
    const user = await service.getById(req.params.id);
    res.json({ status: 'success', data: user });
  }

  async create(req: Request, res: Response) {
    const user = await service.create(req.body);
    res.status(201).json({ status: 'success', data: user });
  }

  async updateStatus(req: Request, res: Response) {
    const result = await service.updateStatus(req.params.id, req.body.isActive);
    res.json({ status: 'success', data: result });
  }
}
