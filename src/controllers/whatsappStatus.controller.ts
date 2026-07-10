import { Request, Response } from 'express';
import { whatsappService } from '../services/whatsapp.service';

export class WhatsappStatusController {
  get(_req: Request, res: Response) {
    res.json({ status: 'success', data: whatsappService.getStatus() });
  }

  getQr(_req: Request, res: Response) {
    res.json({ status: 'success', data: { qr: whatsappService.getQr() } });
  }

  async reconnect(_req: Request, res: Response) {
    await whatsappService.reconnect();
    res.json({ status: 'success', data: whatsappService.getStatus() });
  }
}
