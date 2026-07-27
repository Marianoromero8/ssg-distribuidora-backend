import { Request, Response } from 'express';
import { PFMessageTemplateService } from '../services/pfMessageTemplate.service';

const service = new PFMessageTemplateService();

export class PFMessageTemplateController {
  async getAll(_req: Request, res: Response) {
    const templates = await service.getAll();
    res.json({ status: 'success', data: templates });
  }

  async update(req: Request, res: Response) {
    const template = await service.update(req.params.key, req.body.body);
    res.json({ status: 'success', data: template });
  }
}
