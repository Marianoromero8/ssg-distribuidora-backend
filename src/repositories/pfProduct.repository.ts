import { PFProduct } from '../models/pfProduct.model';
import { PFCategory } from '../models/pfCategory.model';
import { CreatePFProductDto, UpdatePFProductDto } from '../types/pfProduct.types';

const CATEGORY_INCLUDE = [{ model: PFCategory, as: 'category' }];

export class PFProductRepository {
  findAll(onlyActive = true) {
    const where: Record<string, unknown> = {};
    if (onlyActive) where.active = true;
    return PFProduct.findAll({ where, include: CATEGORY_INCLUDE, order: [['name', 'ASC']] });
  }

  findById(id: string) {
    return PFProduct.findByPk(id, { include: CATEGORY_INCLUDE });
  }

  create(data: CreatePFProductDto) {
    return PFProduct.create(data);
  }

  async update(id: string, data: UpdatePFProductDto) {
    await PFProduct.update(data, { where: { id } });
    return this.findById(id);
  }

  destroy(id: string) {
    return PFProduct.destroy({ where: { id } });
  }
}
