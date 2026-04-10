import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UserScheduleService } from '../services/userSchedule.service';
import { DocumentType } from '../shared/types/enums';

const service = new UserService();
const scheduleService = new UserScheduleService();

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

  async updateData(req: Request, res: Response) {
    const { name, lastname, email, phone, documentType, documentNumber } = req.body;
    const result = await service.updateData(req.params.id, {
      ...(name !== undefined && { name }),
      ...(lastname !== undefined && { lastname }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(documentType !== undefined && { documentType: documentType as DocumentType | null }),
      ...(documentNumber !== undefined && { documentNumber }),
    });
    res.json({ status: 'success', data: result });
  }

  async updateRole(req: Request, res: Response) {
    const result = await service.updateRole(req.params.id, req.body.role);
    res.json({ status: 'success', data: result });
  }

  async delete(req: Request, res: Response) {
    await service.delete(req.params.id);
    res.status(204).send();
  }

  async getSchedule(req: Request, res: Response) {
    const schedules = await scheduleService.getByUser(req.params.id);
    res.json({ status: 'success', data: schedules });
  }

  async addSchedule(req: Request, res: Response) {
    const schedule = await scheduleService.create(req.params.id, req.body);
    res.status(201).json({ status: 'success', data: schedule });
  }

  async removeSchedule(req: Request, res: Response) {
    await scheduleService.delete(req.params.id, req.params.scheduleId);
    res.status(204).send();
  }
}
