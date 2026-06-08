import { PFCategoryRepository } from '../repositories/pfCategory.repository';
import { CreatePFCategoryDto, UpdatePFCategoryDto } from '../types/pfCategory.types';
import { NotFoundError } from '../shared/errors/NotFoundError';
import { AppError } from '../shared/errors/AppError';

const repo = new PFCategoryRepository();

export class PFCategoryService {
  getAll() {
    return repo.findAll();
  }

  async getById(id: string) {
    const category = await repo.findById(id);
    if (!category) throw new NotFoundError('Category');
    return category;
  }

  async create(data: CreatePFCategoryDto) {
    const existing = await repo.findBySlug(data.slug);
    if (existing) throw new AppError('A category with this slug already exists', 409);
    return repo.create(data);
  }

  async update(id: string, data: UpdatePFCategoryDto) {
    const category = await repo.findById(id);
    if (!category) throw new NotFoundError('Category');
    if (data.slug && data.slug !== category.slug) {
      const existing = await repo.findBySlug(data.slug);
      if (existing) throw new AppError('A category with this slug already exists', 409);
    }
    return repo.update(id, data);
  }

  async delete(id: string) {
    const category = await repo.findById(id);
    if (!category) throw new NotFoundError('Category');
    await repo.destroy(id);
  }
}
