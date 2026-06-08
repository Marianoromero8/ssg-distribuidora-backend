import { PFOrder } from '../models/pfOrder.model';
import { PFOrderItem } from '../models/pfOrderItem.model';
import { PFProduct } from '../models/pfProduct.model';
import { PFOrderStatus } from '../shared/types/enums';
import { PaginationOptions } from '../shared/utils/pagination';
import { sequelize } from '../config/database';

const ITEM_INCLUDE = [
  {
    model: PFOrderItem,
    as: 'items',
    include: [{ model: PFProduct, as: 'product' }],
  },
];

export class PFOrderRepository {
  findAll(status: PFOrderStatus | undefined, pagination: PaginationOptions) {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    return PFOrder.findAndCountAll({
      where,
      include: ITEM_INCLUDE,
      order: [['createdAt', 'DESC']],
      limit: pagination.limit,
      offset: pagination.offset,
    });
  }

  findById(id: string) {
    return PFOrder.findByPk(id, { include: ITEM_INCLUDE });
  }

  async create(
    orderData: {
      clientName: string;
      clientSurname: string;
      clientEmail: string;
      clientPhone: string;
      clientDni: string;
      clientCuil: string;
      clientAddress: string;
      total: number;
    },
    items: { productId: string; quantity: number; unitPrice: number }[]
  ) {
    return sequelize.transaction(async (t) => {
      const order = await PFOrder.create(orderData, { transaction: t });
      await PFOrderItem.bulkCreate(
        items.map((item) => ({ ...item, orderId: order.id })),
        { transaction: t }
      );
      for (const item of items) {
        await PFProduct.decrement('stock', { by: item.quantity, where: { id: item.productId }, transaction: t });
      }
      return order;
    });
  }

  async restoreStock(orderId: string) {
    const items = await PFOrderItem.findAll({ where: { orderId } });
    for (const item of items) {
      await PFProduct.increment('stock', { by: item.quantity, where: { id: item.productId } });
    }
  }

  updateStatus(id: string, status: PFOrderStatus, note?: string) {
    return PFOrder.update({ status, note: note ?? null }, { where: { id } });
  }
}
