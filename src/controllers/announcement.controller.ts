import { Request, Response } from 'express';
import { AnnouncementService } from '../services/announcement.service';
import { AppError } from '../shared/errors/AppError';

const service = new AnnouncementService();

export class AnnouncementController {
  async getActive(_req: Request, res: Response) {
    const announcement = await service.getActive();
    res.json({ status: 'success', data: announcement });
  }

  async getAll(_req: Request, res: Response) {
    const announcements = await service.getAll();
    res.json({ status: 'success', data: announcements });
  }

  async create(req: Request, res: Response) {
    if (!req.file) throw new AppError('Image file is required', 400);
    const { title, description } = req.body;
    const announcement = await service.create(req.file, title, description);
    res.status(201).json({ status: 'success', data: announcement });
  }

  async update(req: Request, res: Response) {
    const announcement = await service.update(req.params.id, req.body);
    res.json({ status: 'success', data: announcement });
  }

  async replaceImage(req: Request, res: Response) {
    if (!req.file) throw new AppError('Image file is required', 400);
    const announcement = await service.replaceImage(req.params.id, req.file);
    res.json({ status: 'success', data: announcement });
  }

  async delete(req: Request, res: Response) {
    await service.delete(req.params.id);
    res.status(204).send();
  }
}
