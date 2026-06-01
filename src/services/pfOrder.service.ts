import { PFOrderRepository } from '../repositories/pfOrder.repository';
import { ProductRepository } from '../repositories/product.repository';
import { CreatePFOrderDto, UpdatePFOrderStatusDto } from '../types/pfOrder.types';
import { NotFoundError } from '../shared/errors/NotFoundError';
import { AppError } from '../shared/errors/AppError';
import { PFOrderStatus } from '../shared/types/enums';
import { PaginationOptions, buildPaginatedResponse } from '../shared/utils/pagination';

const repo = new PFOrderRepository();
const productRepo = new ProductRepository();

export class PFOrderService {
  async getAll(status: PFOrderStatus | undefined, pagination: PaginationOptions) {
    const result = await repo.findAll(status, pagination);
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
      if (!product.isPuntoFiesta) throw new AppError('Product is not available in Punto Fiesta', 400);
      if (product.pfStock < item.quantity) throw new AppError(`Sin stock suficiente para ${product.productName}`, 400);

      const unitPrice = Number(product.price);
      resolvedItems.push({ productId: item.productId, quantity: item.quantity, unitPrice });
      total += unitPrice * item.quantity;
    }

    const order = await repo.create(
      {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        total,
      },
      resolvedItems
    );

    return repo.findById(order.id);
  }

  async updateStatus(id: string, data: UpdatePFOrderStatusDto) {
    const order = await repo.findById(id);
    if (!order) throw new NotFoundError('Order');
    if (order.status !== PFOrderStatus.PENDING) {
      throw new AppError('Order has already been processed', 400);
    }

    await repo.updateStatus(id, data.status, data.note);

    if (data.status === PFOrderStatus.DECLINED) {
      await repo.restoreStock(id);
    }

    if (data.status === PFOrderStatus.ACCEPTED) {
      // TODO: send email to order.clientEmail with transfer details (alias/CBU)
      // TODO: send WhatsApp to order.clientPhone (Phase 2)
    }

    return repo.findById(id);
  }
}
