import { Request, Response } from 'express';
import { PFSettingsService } from '../services/pfSettings.service';

const service = new PFSettingsService();

export class PFSettingsController {
  async get(_req: Request, res: Response) {
    const settings = await service.getSettings();
    res.json({ status: 'success', data: settings });
  }

  async update(req: Request, res: Response) {
    const settings = await service.updateSettings(req.body);
    res.json({ status: 'success', data: settings });
  }
}
