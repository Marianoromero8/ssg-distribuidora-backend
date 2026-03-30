import { Request, Response } from 'express';
import { PromotionService } from '../services/promotion.service';
import { getPagination } from '../shared/utils/pagination';

const service = new PromotionService();

export class PromotionController {
  async getAll(req: Request, res: Response) {
    const pagination = getPagination(req);
    const result = await service.getAll(pagination);
    res.json({ status: 'success', data: result });
  }

  async getById(req: Request, res: Response) {
    const promotion = await service.getById(req.params.id);
    res.json({ status: 'success', data: promotion });
  }

  async getByProduct(req: Request, res: Response) {
    const promotions = await service.getByProductId(req.params.productId);
    res.json({ status: 'success', data: promotions });
  }

  async create(req: Request, res: Response) {
    const promotion = await service.create(req.body);
    res.status(201).json({ status: 'success', data: promotion });
  }

  async update(req: Request, res: Response) {
    const promotion = await service.update(req.params.id, req.body);
    res.json({ status: 'success', data: promotion });
  }

  async delete(req: Request, res: Response) {
    await service.delete(req.params.id);
    res.status(204).send();
  }
}
