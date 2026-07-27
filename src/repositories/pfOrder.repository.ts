import { Op, fn, col, Transaction } from 'sequelize';
import { PFOrder } from '../models/pfOrder.model';
import { PFOrderItem } from '../models/pfOrderItem.model';
import { PFProduct } from '../models/pfProduct.model';
import { PFOrderStatus, PFDeliveryMethod } from '../shared/types/enums';
import { PaginationOptions } from '../shared/utils/pagination';
import { sequelize } from '../config/database';
import { AppError } from '../shared/errors/AppError';

export type StatsPeriod = 'day' | 'week' | 'month' | 'year';

// Postgres SQLSTATE 40P01 = deadlock_detected. Aun con un orden consistente de
// locks, checkouts muy concurrentes sobre el mismo producto pueden seguir
// generando deadlocks esporádicos (comportamiento documentado de Postgres) —
// reintentar la transacción es la mitigación estándar recomendada por Postgres.
async function withDeadlockRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const code = (err as { parent?: { code?: string }; original?: { code?: string } })?.parent
        ?.code;
      const isDeadlock = code === '40P01';
      if (!isDeadlock || attempt === attempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, 30 * attempt + Math.random() * 50));
    }
  }
  throw new Error('unreachable');
}

const ITEM_INCLUDE = [
  {
    model: PFOrderItem,
    as: 'items',
    include: [{ model: PFProduct, as: 'product' }],
  },
];

export interface OrderFilters {
  status?: PFOrderStatus;
  deliveryMethod?: PFDeliveryMethod;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export class PFOrderRepository {
  findAll(filters: OrderFilters, pagination: PaginationOptions) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.deliveryMethod) where.deliveryMethod = filters.deliveryMethod;
    if (filters.search) {
      const orConditions: Record<string, unknown>[] = [
        { clientName: { [Op.iLike]: `%${filters.search}%` } },
        { clientSurname: { [Op.iLike]: `%${filters.search}%` } },
      ];
      const asNumber = Number(filters.search);
      if (Number.isInteger(asNumber)) {
        orConditions.push({ orderNumber: asNumber });
      }
      where[Op.or] = orConditions;
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
      distinct: true,
    });
  }

  findById(id: string) {
    return PFOrder.findByPk(id, { include: ITEM_INCLUDE });
  }

  async bootstrapOrderNumberSequence(): Promise<void> {
    // Sequelize's autoIncrement targets the PK only (unreliable on a secondary
    // column, see sequelize/sequelize#8658), so orderNumber is backed by a
    // hand-managed Postgres sequence instead. nextval() is atomic — safe under
    // concurrent checkouts with zero extra locking code.
    await sequelize.query(`CREATE SEQUENCE IF NOT EXISTS pf_orders_order_number_seq;`);
    await sequelize.query(
      `ALTER SEQUENCE pf_orders_order_number_seq OWNED BY pf_orders.order_number;`
    );
    await sequelize.query(
      `ALTER TABLE pf_orders ALTER COLUMN order_number SET DEFAULT nextval('pf_orders_order_number_seq');`
    );

    const missing = await PFOrder.findAll({
      where: { orderNumber: null as unknown as number },
      order: [['createdAt', 'ASC']],
    });
    for (const order of missing) {
      const [[row]] = (await sequelize.query(
        `SELECT nextval('pf_orders_order_number_seq') AS n`
      )) as [{ n: string }[], unknown];
      await order.update({ orderNumber: Number(row.n) });
    }

    await sequelize.query(`ALTER TABLE pf_orders ALTER COLUMN order_number SET NOT NULL;`);
  }

  findByIdForUpdate(id: string, t: Transaction) {
    // Sin include a propósito: lockear con LEFT OUTER JOIN falla en Postgres
    // ("FOR UPDATE cannot be applied to the nullable side of an outer join").
    return PFOrder.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
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
      deliveryMethod: PFDeliveryMethod;
      total: number;
    },
    items: { productId: string; quantity: number; unitPrice: number }[]
  ) {
    return withDeadlockRetry(() =>
      sequelize.transaction(async (t) => {
        // Lock de fila batcheado, hecho ANTES de crear el pedido/items: bajo
        // pedidos concurrentes del mismo producto, mantener el orden de
        // adquisición de locks consistente entre transacciones (siempre
        // stock primero) evita deadlocks que aparecían cuando el lock se
        // pedía después de otros inserts.
        const products = await PFProduct.findAll({
          where: { id: items.map((i) => i.productId) },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        const productById = new Map(products.map((p) => [p.id, p]));

        for (const item of items) {
          const product = productById.get(item.productId);
          if (!product || product.stock < item.quantity) {
            throw new AppError(`Sin stock suficiente para ${product?.name ?? item.productId}`, 400);
          }
        }

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
      })
    );
  }

  async restoreStock(orderId: string, t?: Transaction) {
    // Solo restaura items que todavía no fueron restaurados — permite declinar
    // un pedido ACCEPTED (donde los items no confirmados ya se restauraron al
    // aceptar) sin duplicar el crédito de stock.
    const items = await PFOrderItem.findAll({
      where: { orderId, stockRestored: false },
      transaction: t,
    });
    for (const item of items) {
      await PFProduct.increment('stock', {
        by: item.quantity,
        where: { id: item.productId },
        transaction: t,
      });
    }
    if (items.length > 0) {
      await PFOrderItem.update(
        { stockRestored: true },
        { where: { id: items.map((i) => i.id) }, transaction: t }
      );
    }
  }

  async restoreStockForItems(itemIds: string[], t?: Transaction) {
    const items = await PFOrderItem.findAll({
      where: { id: itemIds, stockRestored: false },
      transaction: t,
    });
    for (const item of items) {
      await PFProduct.increment('stock', {
        by: item.quantity,
        where: { id: item.productId },
        transaction: t,
      });
    }
    if (items.length > 0) {
      await PFOrderItem.update(
        { stockRestored: true },
        { where: { id: items.map((i) => i.id) }, transaction: t }
      );
    }
  }

  updateStatus(id: string, status: PFOrderStatus, note?: string, t?: Transaction) {
    return PFOrder.update({ status, note: note ?? null }, { where: { id }, transaction: t });
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
