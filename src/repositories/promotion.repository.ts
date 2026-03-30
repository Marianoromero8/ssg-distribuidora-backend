import { Promotion } from '../models/promotion.model';
import { Product } from '../models/product.model';
import { CreatePromotionDto, UpdatePromotionDto } from '../types/promotion.types';
import { PaginationOptions } from '../shared/utils/pagination';

export class PromotionRepository {
  findAll(pagination: PaginationOptions) {
    return Promotion.findAndCountAll({
      include: [{ model: Product, as: 'product', attributes: ['id', 'productName', 'imageUrl'] }],
      order: [['startsAt', 'DESC']],
      limit: pagination.limit,
      offset: pagination.offset,
    });
  }

  findById(id: string) {
    return Promotion.findByPk(id, {
      include: [{ model: Product, as: 'product', attributes: ['id', 'productName', 'imageUrl'] }],
    });
  }

  findByProductId(productId: string) {
    return Promotion.findAll({
      where: { productId },
      order: [['startsAt', 'DESC']],
    });
  }

  create(data: CreatePromotionDto) {
    return Promotion.create({
      ...data,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
    });
  }

  update(id: string, data: UpdatePromotionDto) {
    const payload: Record<string, unknown> = { ...data };
    if (data.startsAt) payload.startsAt = new Date(data.startsAt);
    if (data.endsAt) payload.endsAt = new Date(data.endsAt);
    return Promotion.update(payload, { where: { id } });
  }

  delete(id: string) {
    return Promotion.update({ isActive: false }, { where: { id } });
  }
}
