import { Request, Response } from 'express';
import { PFProductService } from '../services/pfProduct.service';
import { AppError } from '../shared/errors/AppError';

const service = new PFProductService();

export class PFProductController {
  async getAll(req: Request, res: Response) {
    const onlyActive = req.query.all !== 'true';
    const products = await service.getAll(onlyActive);
    res.json({ status: 'success', data: products });
  }

  async getById(req: Request, res: Response) {
    const product = await service.getById(req.params.id);
    res.json({ status: 'success', data: product });
  }

  async create(req: Request, res: Response) {
    const product = await service.create(req.body);
    res.status(201).json({ status: 'success', data: product });
  }

  async update(req: Request, res: Response) {
    const product = await service.update(req.params.id, req.body);
    res.json({ status: 'success', data: product });
  }

  async uploadImage(req: Request, res: Response) {
    if (!req.file) throw new AppError('No file uploaded', 400);
    const product = await service.uploadImage(req.params.id, req.file);
    res.json({ status: 'success', data: product });
  }

  async delete(req: Request, res: Response) {
    await service.delete(req.params.id);
    res.status(204).send();
  }
}
