import { PromotionRepository } from '../repositories/promotion.repository';
import { ProductRepository } from '../repositories/product.repository';
import { CreatePromotionDto, UpdatePromotionDto } from '../types/promotion.types';
import { NotFoundError } from '../shared/errors/NotFoundError';
import { AppError } from '../shared/errors/AppError';
import { PaginationOptions, buildPaginatedResponse } from '../shared/utils/pagination';

const repo = new PromotionRepository();
const productRepo = new ProductRepository();

export class PromotionService {
  async getAll(pagination: PaginationOptions) {
    const result = await repo.findAll(pagination);
    return buildPaginatedResponse(result, pagination);
  }

  async getById(id: string) {
    const promotion = await repo.findById(id);
    if (!promotion) throw new NotFoundError('Promotion');
    return promotion;
  }

  async getByProductId(productId: string) {
    return repo.findByProductId(productId);
  }

  async create(data: CreatePromotionDto) {
    const product = await productRepo.findById(data.productId);
    if (!product) throw new NotFoundError('Product');

    if (new Date(data.startsAt) >= new Date(data.endsAt)) {
      throw new AppError('startsAt must be before endsAt', 400);
    }

    return repo.create(data);
  }

  async update(id: string, data: UpdatePromotionDto) {
    const promotion = await repo.findById(id);
    if (!promotion) throw new NotFoundError('Promotion');

    if (data.startsAt && data.endsAt && new Date(data.startsAt) >= new Date(data.endsAt)) {
      throw new AppError('startsAt must be before endsAt', 400);
    }

    await repo.update(id, data);
    return repo.findById(id);
  }

  async delete(id: string) {
    const promotion = await repo.findById(id);
    if (!promotion) throw new NotFoundError('Promotion');
    await repo.delete(id);
  }
}
