import { Op, fn, col, Transaction } from 'sequelize';
import { PFCustomer } from '../models/pfCustomer.model';
import { PFOrder } from '../models/pfOrder.model';
import { PFOrderItem } from '../models/pfOrderItem.model';
import { PFProduct } from '../models/pfProduct.model';
import { PaginationOptions } from '../shared/utils/pagination';

export interface CustomerFilters {
  search?: string;
}

const ORDER_ITEM_INCLUDE = [
  {
    model: PFOrderItem,
    as: 'items',
    include: [{ model: PFProduct, as: 'product' }],
  },
];

export class PFCustomerRepository {
  async findAll(filters: CustomerFilters, pagination: PaginationOptions) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { surname: { [Op.iLike]: `%${filters.search}%` } },
        { dni: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    const { rows, count } = await PFCustomer.findAndCountAll({
      where,
      order: [['lastOrderAt', 'DESC']],
      limit: pagination.limit,
      offset: pagination.offset,
    });

    // Agregados (cantidad de pedidos + total gastado) calculados al vuelo por
    // customerId — se evita mantener contadores desnormalizados que puedan
    // desincronizarse; el volumen de pedidos hoy no justifica esa complejidad.
    const customerIds = rows.map((c) => c.id);
    const aggregates =
      customerIds.length > 0
        ? await PFOrder.findAll({
            where: { customerId: customerIds },
            attributes: [
              'customerId',
              [fn('COUNT', col('id')), 'ordersCount'],
              [fn('COALESCE', fn('SUM', col('total')), '0'), 'totalSpent'],
            ],
            group: ['customerId'],
            raw: true,
          })
        : [];
    const aggregateByCustomerId = new Map(
      (aggregates as unknown as { customerId: string; ordersCount: string; totalSpent: string }[]).map(
        (a) => [a.customerId, { ordersCount: Number(a.ordersCount), totalSpent: Number(a.totalSpent) }]
      )
    );

    const items = rows.map((customer) => ({
      ...customer.toJSON(),
      ordersCount: aggregateByCustomerId.get(customer.id)?.ordersCount ?? 0,
      totalSpent: aggregateByCustomerId.get(customer.id)?.totalSpent ?? 0,
    }));

    return { rows: items, count };
  }

  findById(id: string) {
    return PFCustomer.findByPk(id, {
      include: [{ model: PFOrder, as: 'orders', include: ORDER_ITEM_INCLUDE }],
      order: [[{ model: PFOrder, as: 'orders' }, 'createdAt', 'DESC']],
    });
  }

  async findOrCreateByDni(
    data: {
      dni: string;
      name: string;
      surname: string;
      email: string;
      phone: string;
      cuil: string;
      address: string;
    },
    orderDate: Date,
    t?: Transaction
  ): Promise<PFCustomer> {
    const existing = await PFCustomer.findOne({ where: { dni: data.dni }, transaction: t });
    if (existing) {
      await existing.update({ lastOrderAt: orderDate }, { transaction: t });
      return existing;
    }
    return PFCustomer.create(
      { ...data, firstOrderAt: orderDate, lastOrderAt: orderDate },
      { transaction: t }
    );
  }

  // Idempotente — llamada una vez al boot (mismo patrón que
  // PFOrderRepository.bootstrapOrderNumberSequence). Agrupa por DNI los
  // pedidos que todavía no tienen customerId (datos preexistentes en la rama
  // "dev" u otro entorno, ya que producción se vació el 2026-07-26).
  async backfillCustomersFromOrders(): Promise<void> {
    const orphanOrders = await PFOrder.findAll({
      where: { customerId: null as unknown as string, clientDni: { [Op.ne]: '' } },
      order: [['createdAt', 'ASC']],
    });

    for (const order of orphanOrders) {
      const customer = await this.findOrCreateByDni(
        {
          dni: order.clientDni,
          name: order.clientName,
          surname: order.clientSurname,
          email: order.clientEmail,
          phone: order.clientPhone,
          cuil: order.clientCuil,
          address: order.clientAddress,
        },
        order.createdAt
      );
      await order.update({ customerId: customer.id });
    }
  }
}
