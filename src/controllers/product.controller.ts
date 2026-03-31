import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { getPagination } from '../shared/utils/pagination';
import { AppError } from '../shared/errors/AppError';

const service = new ProductService();

export class ProductController {
  async getAll(req: Request, res: Response) {
    const pagination = getPagination(req);
    const filters = {
      categoryId: req.query.categoryId as string | undefined,
      brandId: req.query.brandId as string | undefined,
      isFeatured: req.query.isFeatured === 'true' ? true : undefined,
    };
    const result = await service.getAll(filters, pagination);
    res.json({ status: 'success', data: result });
  }

  async getAllAdmin(req: Request, res: Response) {
    const pagination = getPagination(req);
    const filters = {
      categoryId: req.query.categoryId as string | undefined,
      brandId: req.query.brandId as string | undefined,
      isFeatured: req.query.isFeatured === 'true' ? true : undefined,
    };
    const result = await service.getAllAdmin(filters, pagination);
    res.json({ status: 'success', data: result });
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

  async hardDelete(req: Request, res: Response) {
    await service.hardDelete(req.params.id);
    res.status(204).send();
  }
}
