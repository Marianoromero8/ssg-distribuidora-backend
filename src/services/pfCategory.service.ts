import { PFCategoryRepository } from '../repositories/pfCategory.repository';
import { PFProductRepository } from '../repositories/pfProduct.repository';
import { CreatePFCategoryDto, UpdatePFCategoryDto } from '../types/pfCategory.types';
import { NotFoundError } from '../shared/errors/NotFoundError';
import { AppError } from '../shared/errors/AppError';

const repo = new PFCategoryRepository();
const productRepo = new PFProductRepository();

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
    const productCount = await productRepo.countByCategory(id);
    if (productCount > 0) {
      throw new AppError(
        `No se puede eliminar "${category.name}": tiene ${productCount} producto(s) asociado(s). Movelos a otra categoría primero.`,
        409
      );
    }
    await repo.destroy(id);
  }
}
