import { Request, Response } from 'express';
import { PFOrderService } from '../services/pfOrder.service';
import { getPagination } from '../shared/utils/pagination';
import { PFOrderStatus } from '../shared/types/enums';

const service = new PFOrderService();

export class PFOrderController {
  async getAll(req: Request, res: Response) {
    const pagination = getPagination(req);
    const status = req.query.status as PFOrderStatus | undefined;
    const search = (req.query.search as string) || undefined;
    const dateFrom = req.query.dateFrom
      ? new Date(req.query.dateFrom as string)
      : undefined;
    const dateTo = req.query.dateTo
      ? new Date(`${req.query.dateTo as string}T23:59:59`)
      : undefined;
    const result = await service.getAll({ status, search, dateFrom, dateTo }, pagination);
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

  async getStats(req: Request, res: Response) {
    const period = (req.query.period as string) ?? 'month';
    const data = await service.getStats(period as any);
    res.json({ status: 'success', data });
  }

  async updateStatus(req: Request, res: Response) {
    const { order, whatsappSent, whatsappRequired } = await service.updateStatus(
      req.params.id,
      req.body
    );
    res.json({ status: 'success', data: order, whatsappSent, whatsappRequired });
  }
}
