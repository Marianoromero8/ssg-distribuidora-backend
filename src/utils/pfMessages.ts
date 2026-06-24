import { env } from '../config/env';

interface OrderInfo {
  clientName: string;
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
  total: number
): string {
  const itemsList = confirmedItems
    .map((i) => `• ${i.product?.name ?? 'Producto'} x${i.quantity} — $${fmt(Number(i.unitPrice))}`)
    .join('\n');

  return (
    `Hola ${order.clientName}, ¡tu pedido fue confirmado! 🎉\n\n` +
    `Productos confirmados:\n${itemsList}\n\n` +
    `Total: $${fmt(total)}\n\n` +
    `Para completar tu pedido, realizá la transferencia a:\n` +
    `• Alias: ${env.PF_ALIAS}\n` +
    `• CBU: ${env.PF_CBU}\n\n` +
    `Una vez hecha la transferencia, envianos el comprobante por este chat. ¡Gracias!`
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
