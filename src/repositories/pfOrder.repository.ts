import { Op, fn, col } from 'sequelize';
import { PFOrder } from '../models/pfOrder.model';
import { PFOrderItem } from '../models/pfOrderItem.model';
import { PFProduct } from '../models/pfProduct.model';
import { PFOrderStatus } from '../shared/types/enums';
import { PaginationOptions } from '../shared/utils/pagination';
import { sequelize } from '../config/database';

export type StatsPeriod = 'day' | 'week' | 'month' | 'year';

const ITEM_INCLUDE = [
  {
    model: PFOrderItem,
    as: 'items',
    include: [{ model: PFProduct, as: 'product' }],
  },
];

export interface OrderFilters {
  status?: PFOrderStatus;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export class PFOrderRepository {
  findAll(filters: OrderFilters, pagination: PaginationOptions) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where[Op.or] = [
        { clientName: { [Op.iLike]: `%${filters.search}%` } },
        { clientSurname: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }
    if (filters.dateFrom || filters.dateTo) {
      const range: Record<symbol, Date> = {};
      if (filters.dateFrom) range[Op.gte] = filters.dateFrom;
      if (filters.dateTo) range[Op.lte] = filters.dateTo;
      where.createdAt = range;
    }

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
        await PFProduct.decrement('stock', {
          by: item.quantity,
          where: { id: item.productId },
          transaction: t,
        });
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

  async restoreStockForItems(itemIds: string[]) {
    const items = await PFOrderItem.findAll({ where: { id: itemIds } });
    for (const item of items) {
      await PFProduct.increment('stock', { by: item.quantity, where: { id: item.productId } });
    }
  }

  updateStatus(id: string, status: PFOrderStatus, note?: string) {
    return PFOrder.update({ status, note: note ?? null }, { where: { id } });
  }

  async getStats(period: StatsPeriod) {
    const now = new Date();
    let periodStart: Date;

    if (period === 'day') {
      periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      periodStart = new Date(now);
      periodStart.setDate(periodStart.getDate() - 6);
      periodStart.setHours(0, 0, 0, 0);
    } else if (period === 'month') {
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      periodStart = new Date(now.getFullYear(), 0, 1);
    }

    const periodWhere = { createdAt: { [Op.gte]: periodStart } };

    const [paidRow, acceptedRow, periodPaidRow, periodAcceptedRow] = await Promise.all([
      PFOrder.findOne({
        where: { status: PFOrderStatus.PAID },
        attributes: [[fn('COALESCE', fn('SUM', col('total')), '0'), 'total']],
        raw: true,
      }),
      PFOrder.findOne({
        where: { status: PFOrderStatus.ACCEPTED },
        attributes: [[fn('COALESCE', fn('SUM', col('total')), '0'), 'total']],
        raw: true,
      }),
      PFOrder.findOne({
        where: { status: PFOrderStatus.PAID, ...periodWhere },
        attributes: [
          [fn('COUNT', col('id')), 'count'],
          [fn('COALESCE', fn('SUM', col('total')), '0'), 'amount'],
        ],
        raw: true,
      }),
      PFOrder.findOne({
        where: { status: PFOrderStatus.ACCEPTED, ...periodWhere },
        attributes: [
          [fn('COUNT', col('id')), 'count'],
          [fn('COALESCE', fn('SUM', col('total')), '0'), 'amount'],
        ],
        raw: true,
      }),
    ]);

    return {
      paidTotal: Number((paidRow as any)?.total ?? 0),
      acceptedTotal: Number((acceptedRow as any)?.total ?? 0),
      periodPaidCount: Number((periodPaidRow as any)?.count ?? 0),
      periodPaidAmount: Number((periodPaidRow as any)?.amount ?? 0),
      periodAcceptedCount: Number((periodAcceptedRow as any)?.count ?? 0),
      periodAcceptedAmount: Number((periodAcceptedRow as any)?.amount ?? 0),
    };
  }
}
