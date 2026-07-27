import { PFMessageTemplate } from '../models/pfMessageTemplate.model';
import { NotFoundError } from '../shared/errors/NotFoundError';

const DEFAULT_TEMPLATES = [
  {
    key: 'ORDER_ACCEPTED_PICKUP',
    label: 'Pedido aceptado (retiro en local)',
    body:
      'Hola [nombre], ¡tu pedido fue confirmado! 🎉\n\n' +
      'Productos confirmados:\n[productos]\n\n' +
      'Total: $[total]\n\n' +
      'Podés pagar por transferencia o en efectivo al retirar tu pedido en:\n[direccion_local]\n\n' +
      'Si preferís transferir antes, estos son los datos:\n[datos_transferencia]\n\n' +
      'Si transferís, envianos el comprobante por este chat. ¡Te esperamos para retirar tu pedido!',
  },
  {
    key: 'ORDER_ACCEPTED_DELIVERY',
    label: 'Pedido aceptado (envío a domicilio)',
    body:
      'Hola [nombre], ¡tu pedido fue confirmado! 🎉\n\n' +
      'Productos confirmados:\n[productos]\n\n' +
      'Total: $[total]\n\n' +
      'Para completar tu pedido, realizá la transferencia a:\n[datos_transferencia]\n\n' +
      'Lo enviamos a: [direccion_cliente]\n\n' +
      'Una vez hecha la transferencia, envianos el comprobante por este chat. ¡Gracias!',
  },
  {
    key: 'ORDER_DECLINED',
    label: 'Pedido rechazado (sin stock)',
    body:
      'Hola [nombre], lamentablemente no pudimos confirmar tu pedido en este momento por falta de stock.\n\n' +
      '¡No te preocupes! Seguinos para enterarte cuando ingrese mercadería nueva:\n' +
      '• Instagram: [instagram]\n' +
      '• Facebook: [facebook]\n' +
      '• WhatsApp: [whatsapp]\n\n' +
      '¡Gracias por elegirnos y disculpá las molestias! 🙏',
  },
];

export class PFMessageTemplateRepository {
  findAll() {
    return PFMessageTemplate.findAll({ order: [['key', 'ASC']] });
  }

  findByKey(key: string) {
    return PFMessageTemplate.findOne({ where: { key } });
  }

  async update(key: string, body: string) {
    const [count] = await PFMessageTemplate.update({ body }, { where: { key } });
    if (count === 0) throw new NotFoundError('Message template');
    return this.findByKey(key);
  }

  async seedDefaults() {
    for (const t of DEFAULT_TEMPLATES) {
      await PFMessageTemplate.findOrCreate({ where: { key: t.key }, defaults: t });
    }
  }
}
