import { PFOrderRepository, StatsPeriod, OrderFilters } from '../repositories/pfOrder.repository';
import { PFProductRepository } from '../repositories/pfProduct.repository';
import { CreatePFOrderDto, UpdatePFOrderStatusDto } from '../types/pfOrder.types';
import { NotFoundError } from '../shared/errors/NotFoundError';
import { AppError } from '../shared/errors/AppError';
import { PFOrderStatus } from '../shared/types/enums';
import { sequelize } from '../config/database';
import { PaginationOptions, buildPaginatedResponse } from '../shared/utils/pagination';
import { whatsappService } from './whatsapp.service';
import { buildAcceptedMessage, buildDeclinedMessage } from '../utils/pfMessages';
import { PFSettingsRepository } from '../repositories/pfSettings.repository';

const repo = new PFOrderRepository();
const productRepo = new PFProductRepository();
const settingsRepo = new PFSettingsRepository();

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
    const products = await productRepo.findByIds(data.items.map((i) => i.productId));
    const productById = new Map(products.map((p) => [p.id, p]));

    const resolvedItems: { productId: string; quantity: number; unitPrice: number }[] = [];
    let total = 0;

    for (const item of data.items) {
      const product = productById.get(item.productId);
      if (!product) throw new NotFoundError(`Product ${item.productId}`);
      if (!product.active) throw new AppError(`Product ${product.name} is not available`, 400);
      // El chequeo de stock se hace dentro de PFOrderRepository.create(), con
      // lock de fila, para evitar overselling con pedidos concurrentes.

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
        deliveryMethod: data.deliveryMethod,
        total,
      },
      resolvedItems
    );

    return repo.findById(order.id);
  }

  async updateStatus(id: string, data: UpdatePFOrderStatusDto) {
    const order = await repo.findById(id);
    if (!order) throw new NotFoundError('Order');

    await sequelize.transaction(async (t) => {
      const locked = await repo.findByIdForUpdate(id, t);
      if (!locked) throw new NotFoundError('Order');

      if (data.status === PFOrderStatus.PAID) {
        if (locked.status !== PFOrderStatus.ACCEPTED) {
          throw new AppError('Solo se puede cobrar un pedido que fue aceptado', 400);
        }
      } else if (data.status === PFOrderStatus.DECLINED) {
        // Rechazar/cancelar es válido tanto para un pedido pendiente como para
        // uno ya aceptado que nunca se pagó (ej. cliente no se presenta).
        if (locked.status !== PFOrderStatus.PENDING && locked.status !== PFOrderStatus.ACCEPTED) {
          throw new AppError('El pedido ya fue procesado', 400);
        }
      } else if (locked.status !== PFOrderStatus.PENDING) {
        throw new AppError('El pedido ya fue procesado', 400);
      }

      await repo.updateStatus(id, data.status, data.note, t);

      if (data.status === PFOrderStatus.DECLINED) {
        await repo.restoreStock(id, t);
      }

      if (data.status === PFOrderStatus.ACCEPTED && data.confirmedItemIds) {
        const allItemIds = (order.items ?? []).map((i) => i.id as string);
        const unconfirmedIds = allItemIds.filter(
          (itemId) => !data.confirmedItemIds!.includes(itemId)
        );
        if (unconfirmedIds.length > 0) {
          await repo.restoreStockForItems(unconfirmedIds, t);
        }
      }
    });

    const updated = await repo.findById(id);

    let whatsappSent = false;
    const needsWA =
      (data.status === PFOrderStatus.ACCEPTED && !!data.confirmedItemIds) ||
      data.status === PFOrderStatus.DECLINED;

    if (needsWA) {
      try {
        const settings = await settingsRepo.get();
        if (data.status === PFOrderStatus.ACCEPTED && data.confirmedItemIds) {
          const confirmedItems = (updated?.items ?? []).filter((i) =>
            data.confirmedItemIds!.includes(i.id as string)
          );
          const total = confirmedItems.reduce(
            (sum, i) => sum + Number(i.unitPrice) * i.quantity,
            0
          );
          const msg = await buildAcceptedMessage(
            order,
            confirmedItems,
            total,
            {
              alias: settings.alias,
              cbu: settings.cbu,
              accountHolderName: settings.accountHolderName,
            },
            settings.address
          );
          whatsappSent = await whatsappService.sendMessage(order.clientPhone, msg);
        } else if (data.status === PFOrderStatus.DECLINED) {
          const msg = await buildDeclinedMessage(order, {
            instagram: settings.instagramUrl,
            facebook: settings.facebookUrl,
            whatsapp: settings.whatsappUrl,
          });
          whatsappSent = await whatsappService.sendMessage(order.clientPhone, msg);
        }
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
