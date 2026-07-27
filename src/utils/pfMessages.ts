import { PFDeliveryMethod } from '../shared/types/enums';
import { renderTemplate } from './templateEngine';
import { PFMessageTemplateRepository } from '../repositories/pfMessageTemplate.repository';
import { AppError } from '../shared/errors/AppError';

const templateRepo = new PFMessageTemplateRepository();

interface OrderInfo {
  clientName: string;
  clientAddress: string;
  deliveryMethod: PFDeliveryMethod;
}

interface ItemInfo {
  quantity: number;
  unitPrice: string | number;
  product?: { name: string } | null;
}

function fmt(n: number) {
  return n.toLocaleString('es-AR');
}

export async function buildAcceptedMessage(
  order: OrderInfo,
  confirmedItems: ItemInfo[],
  total: number,
  paymentInfo: { alias: string; cbu: string; accountHolderName: string },
  storeAddress: string
): Promise<string> {
  const key =
    order.deliveryMethod === PFDeliveryMethod.PICKUP
      ? 'ORDER_ACCEPTED_PICKUP'
      : 'ORDER_ACCEPTED_DELIVERY';
  const template = await templateRepo.findByKey(key);
  if (!template) throw new AppError(`Message template ${key} not configured`, 500);

  const items = confirmedItems
    .map((i) => `• ${i.product?.name ?? 'Producto'} x${i.quantity} — $${fmt(Number(i.unitPrice))}`)
    .join('\n');

  const transferInfo =
    `• Alias: ${paymentInfo.alias}\n` +
    `• CBU: ${paymentInfo.cbu}\n` +
    `• Titular: ${paymentInfo.accountHolderName}`;

  return renderTemplate(template.body, {
    nombre: order.clientName,
    productos: items,
    total: fmt(total),
    direccion_local: storeAddress,
    direccion_cliente: order.clientAddress,
    datos_transferencia: transferInfo,
  });
}

export async function buildDeclinedMessage(
  order: OrderInfo,
  socials: { instagram: string; facebook: string; whatsapp: string }
): Promise<string> {
  const template = await templateRepo.findByKey('ORDER_DECLINED');
  if (!template) throw new AppError('Message template ORDER_DECLINED not configured', 500);

  return renderTemplate(template.body, {
    nombre: order.clientName,
    instagram: socials.instagram,
    facebook: socials.facebook,
    whatsapp: socials.whatsapp,
  });
}
