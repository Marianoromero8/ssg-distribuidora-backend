import { Request, Response } from 'express';
import { PFAnnouncementService } from '../services/pfAnnouncement.service';
import { PFAnnouncementType } from '../models/pfAnnouncement.model';
import { AppError } from '../shared/errors/AppError';

const service = new PFAnnouncementService();

export class PFAnnouncementController {
  async getActivePopups(_req: Request, res: Response) {
    const items = await service.getActivePopups();
    res.json({ status: 'success', data: items });
  }

  async getActiveCarousel(_req: Request, res: Response) {
    const items = await service.getActiveCarousel();
    res.json({ status: 'success', data: items });
  }

  async getAll(_req: Request, res: Response) {
    const items = await service.getAll();
    res.json({ status: 'success', data: items });
  }

  async create(req: Request, res: Response) {
    if (!req.file) throw new AppError('Image file is required', 400);
    const { type, title, displayOrder } = req.body;
    if (!type || !Object.values(PFAnnouncementType).includes(type)) {
      throw new AppError('type must be POPUP or CAROUSEL', 400);
    }
    const item = await service.create(
      req.file,
      type as PFAnnouncementType,
      title,
      displayOrder !== undefined ? Number(displayOrder) : undefined
    );
    res.status(201).json({ status: 'success', data: item });
  }

  async update(req: Request, res: Response) {
    const item = await service.update(req.params.id, req.body);
    res.json({ status: 'success', data: item });
  }

  async replaceImage(req: Request, res: Response) {
    if (!req.file) throw new AppError('Image file is required', 400);
    const item = await service.replaceImage(req.params.id, req.file);
    res.json({ status: 'success', data: item });
  }

  async delete(req: Request, res: Response) {
    await service.delete(req.params.id);
    res.status(204).send();
  }
}
