import { env } from '../config/env';
import { PFDeliveryMethod } from '../shared/types/enums';

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

export function buildAcceptedMessage(
  order: OrderInfo,
  confirmedItems: ItemInfo[],
  total: number,
  paymentInfo: { alias: string; cbu: string; accountHolderName: string },
  storeAddress: string
): string {
  const itemsList = confirmedItems
    .map((i) => `• ${i.product?.name ?? 'Producto'} x${i.quantity} — $${fmt(Number(i.unitPrice))}`)
    .join('\n');

  const transferInfo =
    `• Alias: ${paymentInfo.alias}\n` +
    `• CBU: ${paymentInfo.cbu}\n` +
    `• Titular: ${paymentInfo.accountHolderName}`;

  const isPickup = order.deliveryMethod === PFDeliveryMethod.PICKUP;

  const deliveryBlock = isPickup
    ? `Podés pagar por transferencia o en efectivo al retirar tu pedido en:\n${storeAddress}\n\n` +
      `Si preferís transferir antes, estos son los datos:\n${transferInfo}`
    : `Para completar tu pedido, realizá la transferencia a:\n${transferInfo}\n\n` +
      `Lo enviamos a: ${order.clientAddress}`;

  const closing = isPickup
    ? 'Si transferís, envianos el comprobante por este chat. ¡Te esperamos para retirar tu pedido!'
    : 'Una vez hecha la transferencia, envianos el comprobante por este chat. ¡Gracias!';

  return (
    `Hola ${order.clientName}, ¡tu pedido fue confirmado! 🎉\n\n` +
    `Productos confirmados:\n${itemsList}\n\n` +
    `Total: $${fmt(total)}\n\n` +
    `${deliveryBlock}\n\n` +
    closing
  );
}

export function buildDeclinedMessage(order: OrderInfo): string {
  return (
    `Hola ${order.clientName}, lamentablemente no pudimos confirmar tu pedido en este momento por falta de stock.\n\n` +
    `¡No te preocupes! Seguinos para enterarte cuando ingrese mercadería nueva:\n` +
    `• Instagram: ${env.PF_INSTAGRAM}\n` +
    `• Facebook: ${env.PF_FACEBOOK}\n` +
    `• WhatsApp: ${env.PF_WHATSAPP_URL}\n\n` +
    `¡Gracias por elegirnos y disculpá las molestias! 🙏`
  );
}
