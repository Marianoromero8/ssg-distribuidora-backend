import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';

const service = new CategoryService();

export class CategoryController {
  async getAll(_req: Request, res: Response) {
    const categories = await service.getAll();
    res.json({ status: 'success', data: categories });
  }

  async getRoots(_req: Request, res: Response) {
    const categories = await service.getRoots();
    res.json({ status: 'success', data: categories });
  }

  async getById(req: Request, res: Response) {
    const category = await service.getById(req.params.id);
    res.json({ status: 'success', data: category });
  }

  async create(req: Request, res: Response) {
    const category = await service.create(req.body);
    res.status(201).json({ status: 'success', data: category });
  }

  async update(req: Request, res: Response) {
    const category = await service.update(req.params.id, req.body);
    res.json({ status: 'success', data: category });
  }

  async delete(req: Request, res: Response) {
    await service.delete(req.params.id);
    res.status(204).send();
  }
}
