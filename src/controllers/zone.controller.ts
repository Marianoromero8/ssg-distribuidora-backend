import { Request, Response } from 'express';
import { ZoneService } from '../services/zone.service';

const service = new ZoneService();

export class ZoneController {
  async getAll(_req: Request, res: Response) {
    const zones = await service.getAll();
    res.json({ status: 'success', data: zones });
  }

  async getAllActive(_req: Request, res: Response) {
    const zones = await service.getAllActive();
    res.json({ status: 'success', data: zones });
  }

  async getById(req: Request, res: Response) {
    const zone = await service.getById(req.params.id);
    res.json({ status: 'success', data: zone });
  }

  async create(req: Request, res: Response) {
    const zone = await service.create(req.body);
    res.status(201).json({ status: 'success', data: zone });
  }

  async update(req: Request, res: Response) {
    const zone = await service.update(req.params.id, req.body);
    res.json({ status: 'success', data: zone });
  }

  async delete(req: Request, res: Response) {
    await service.delete(req.params.id);
    res.status(204).send();
  }
}
