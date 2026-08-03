import { Request, Response } from 'express';
import { PFCustomerService } from '../services/pfCustomer.service';
import { getPagination } from '../shared/utils/pagination';

const service = new PFCustomerService();

export class PFCustomerController {
  async getAll(req: Request, res: Response) {
    const pagination = getPagination(req);
    const search = (req.query.search as string) || undefined;
    const result = await service.getAll({ search }, pagination);
    res.json({ status: 'success', data: result });
  }

  async getById(req: Request, res: Response) {
    const customer = await service.getById(req.params.id);
    res.json({ status: 'success', data: customer });
  }
}
