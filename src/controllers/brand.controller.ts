import { Request, Response } from 'express';
import { BrandService } from '../services/brand.service';
import { AppError } from '../shared/errors/AppError';

const service = new BrandService();

export class BrandController {
  async getAll(_req: Request, res: Response) {
    const brands = await service.getAll();
    res.json({ status: 'success', data: brands });
  }

  async getAllAdmin(_req: Request, res: Response) {
    const brands = await service.getAllAdmin();
    res.json({ status: 'success', data: brands });
  }

  async getById(req: Request, res: Response) {
    const brand = await service.getById(req.params.id);
    res.json({ status: 'success', data: brand });
  }

  async create(req: Request, res: Response) {
    const brand = await service.create(req.body);
    res.status(201).json({ status: 'success', data: brand });
  }

  async update(req: Request, res: Response) {
    const brand = await service.update(req.params.id, req.body);
    res.json({ status: 'success', data: brand });
  }

  async toggleStatus(req: Request, res: Response) {
    const brand = await service.toggleStatus(req.params.id);
    res.json({ status: 'success', data: brand });
  }

  async uploadImage(req: Request, res: Response) {
    if (!req.file) throw new AppError('No file uploaded', 400);
    const brand = await service.uploadImage(req.params.id, req.file);
    res.json({ status: 'success', data: brand });
  }
}
