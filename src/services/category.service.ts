import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../types/category.types';
import { NotFoundError } from '../shared/errors/NotFoundError';

const repo = new CategoryRepository();

export class CategoryService {
  async getAll() {
    return repo.findAll();
  }

  async getRoots() {
    return repo.findRoots();
  }

  async getById(id: string) {
    const category = await repo.findById(id);
    if (!category) throw new NotFoundError('Category');
    return category;
  }

  async create(data: CreateCategoryDto) {
    if (data.parentCategoryId) {
      const parent = await repo.findById(data.parentCategoryId);
      if (!parent) throw new NotFoundError('Parent category');
    }
    return repo.create(data);
  }

  async update(id: string, data: UpdateCategoryDto) {
    const category = await repo.findById(id);
    if (!category) throw new NotFoundError('Category');

    if (data.parentCategoryId) {
      const parent = await repo.findById(data.parentCategoryId);
      if (!parent) throw new NotFoundError('Parent category');
    }

    await repo.update(id, data);
    return repo.findById(id);
  }
}
