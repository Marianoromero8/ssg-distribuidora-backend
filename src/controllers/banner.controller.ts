import { Request, Response } from 'express';
import { BannerService } from '../services/banner.service';
import { AppError } from '../shared/errors/AppError';

const service = new BannerService();

export class BannerController {
  // Public — used by the frontend Home
  async getActive(_req: Request, res: Response) {
    const banners = await service.getActive();
    res.json({ status: 'success', data: banners });
  }

  // Admin — see all including inactive
  async getAll(_req: Request, res: Response) {
    const banners = await service.getAll();
    res.json({ status: 'success', data: banners });
  }

  async create(req: Request, res: Response) {
    if (!req.file) throw new AppError('No file uploaded', 400);
    const banner = await service.create(req.file, req.body.title);
    res.status(201).json({ status: 'success', data: banner });
  }

  async update(req: Request, res: Response) {
    const banner = await service.update(req.params.id, req.body);
    res.json({ status: 'success', data: banner });
  }

  async replaceMedia(req: Request, res: Response) {
    if (!req.file) throw new AppError('No file uploaded', 400);
    const banner = await service.replaceMedia(req.params.id, req.file);
    res.json({ status: 'success', data: banner });
  }

  async reorder(req: Request, res: Response) {
    await service.reorder(req.body.order);
    res.json({ status: 'success', message: 'Banners reordered' });
  }

  async delete(req: Request, res: Response) {
    await service.delete(req.params.id);
    res.status(204).send();
  }
}
