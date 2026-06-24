import { PFOrderRepository, StatsPeriod, OrderFilters } from '../repositories/pfOrder.repository';
import { PFProductRepository } from '../repositories/pfProduct.repository';
import { CreatePFOrderDto, UpdatePFOrderStatusDto } from '../types/pfOrder.types';
import { NotFoundError } from '../shared/errors/NotFoundError';
import { AppError } from '../shared/errors/AppError';
import { PFOrderStatus } from '../shared/types/enums';
import { PaginationOptions, buildPaginatedResponse } from '../shared/utils/pagination';
import { whatsappService } from './whatsapp.service';
import { buildAcceptedMessage, buildDeclinedMessage } from '../utils/pfMessages';

const repo = new PFOrderRepository();
const productRepo = new PFProductRepository();

export class PFOrderService {
  async getAll(filters: OrderFilters, pagination: PaginationOptions) {
    const result = await repo.findAll(filters, pagination);
    return buildPaginatedResponse(result, pagination);
  }

  async getById(id: string) {
    const order = await repo.findById(id);
    if (!order) throw new NotFoundError('Order');
    return order;
  }

  async create(data: CreatePFOrderDto) {
    const resolvedItems: { productId: string; quantity: number; unitPrice: number }[] = [];
    let total = 0;

    for (const item of data.items) {
      const product = await productRepo.findById(item.productId);
      if (!product) throw new NotFoundError(`Product ${item.productId}`);
      if (!product.active) throw new AppError(`Product ${product.name} is not available`, 400);
      if (product.stock < item.quantity)
        throw new AppError(`Sin stock suficiente para ${product.name}`, 400);

      const unitPrice = Number(product.price);
      resolvedItems.push({ productId: item.productId, quantity: item.quantity, unitPrice });
      total += unitPrice * item.quantity;
    }

    const order = await repo.create(
      {
        clientName: data.clientName,
        clientSurname: data.clientSurname,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        clientDni: data.clientDni,
        clientCuil: data.clientCuil,
        clientAddress: data.clientAddress,
        total,
      },
      resolvedItems
    );

    return repo.findById(order.id);
  }

  async updateStatus(id: string, data: UpdatePFOrderStatusDto) {
    const order = await repo.findById(id);
    if (!order) throw new NotFoundError('Order');

    if (data.status === PFOrderStatus.PAID) {
      if (order.status !== PFOrderStatus.ACCEPTED) {
        throw new AppError('Solo se puede cobrar un pedido que fue aceptado', 400);
      }
    } else if (order.status !== PFOrderStatus.PENDING) {
      throw new AppError('El pedido ya fue procesado', 400);
    }

    await repo.updateStatus(id, data.status, data.note);

    if (data.status === PFOrderStatus.DECLINED) {
      await repo.restoreStock(id);
    }

    if (data.status === PFOrderStatus.ACCEPTED && data.confirmedItemIds) {
      const allItemIds = (order.items ?? []).map((i) => i.id as string);
      const unconfirmedIds = allItemIds.filter(
        (itemId) => !data.confirmedItemIds!.includes(itemId)
      );
      if (unconfirmedIds.length > 0) {
        await repo.restoreStockForItems(unconfirmedIds);
      }
    }

    const updated = await repo.findById(id);

    let whatsappSent = false;
    const needsWA =
      (data.status === PFOrderStatus.ACCEPTED && !!data.confirmedItemIds) ||
      data.status === PFOrderStatus.DECLINED;

    if (needsWA) {
      try {
        if (data.status === PFOrderStatus.ACCEPTED && data.confirmedItemIds) {
          const confirmedItems = (updated?.items ?? []).filter((i) =>
            data.confirmedItemIds!.includes(i.id as string)
          );
          const total = confirmedItems.reduce(
            (sum, i) => sum + Number(i.unitPrice) * i.quantity,
            0
          );
          const msg = buildAcceptedMessage(order, confirmedItems, total);
          await whatsappService.sendMessage(order.clientPhone, msg);
        } else if (data.status === PFOrderStatus.DECLINED) {
          const msg = buildDeclinedMessage(order);
          await whatsappService.sendMessage(order.clientPhone, msg);
        }
        whatsappSent = true;
      } catch (e) {
        console.error('[WA] Error al enviar mensaje:', e);
      }
    }

    return { order: updated, whatsappSent, whatsappRequired: needsWA };
  }

  async getStats(period: StatsPeriod) {
    return repo.getStats(period);
  }
}
