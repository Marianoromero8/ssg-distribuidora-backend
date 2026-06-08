import { Request, Response } from 'express';
import { PFOrderService } from '../services/pfOrder.service';
import { getPagination } from '../shared/utils/pagination';
import { PFOrderStatus } from '../shared/types/enums';

const service = new PFOrderService();

export class PFOrderController {
  async getAll(req: Request, res: Response) {
    const pagination = getPagination(req);
    const status = req.query.status as PFOrderStatus | undefined;
    const result = await service.getAll(status, pagination);
    res.json({ status: 'success', data: result });
  }

  async getById(req: Request, res: Response) {
    const order = await service.getById(req.params.id);
    res.json({ status: 'success', data: order });
  }

  async create(req: Request, res: Response) {
    const order = await service.create(req.body);
    res.status(201).json({ status: 'success', data: order });
  }

  async updateStatus(req: Request, res: Response) {
    const order = await service.updateStatus(req.params.id, req.body);
    res.json({ status: 'success', data: order });
  }
}
