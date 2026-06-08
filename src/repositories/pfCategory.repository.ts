import { PFCategory } from '../models/pfCategory.model';
import { CreatePFCategoryDto, UpdatePFCategoryDto } from '../types/pfCategory.types';

export class PFCategoryRepository {
  findAll() {
    return PFCategory.findAll({ order: [['name', 'ASC']] });
  }

  findById(id: string) {
    return PFCategory.findByPk(id);
  }

  findBySlug(slug: string) {
    return PFCategory.findOne({ where: { slug } });
  }

  create(data: CreatePFCategoryDto) {
    return PFCategory.create(data);
  }

  async update(id: string, data: UpdatePFCategoryDto) {
    await PFCategory.update(data, { where: { id } });
    return this.findById(id);
  }

  destroy(id: string) {
    return PFCategory.destroy({ where: { id } });
  }
}
