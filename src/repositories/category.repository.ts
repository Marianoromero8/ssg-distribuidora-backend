import { Category } from '../models/category.model';
import { CreateCategoryDto, UpdateCategoryDto } from '../types/category.types';

export class CategoryRepository {
  findAll() {
    return Category.findAll({
      order: [['categoryName', 'ASC']],
      include: [{ model: Category, as: 'subcategories', attributes: ['id', 'categoryName'] }],
    });
  }

  findRoots() {
    return Category.findAll({
      where: { parentCategoryId: null },
      order: [['categoryName', 'ASC']],
      include: [{ model: Category, as: 'subcategories', attributes: ['id', 'categoryName'] }],
    });
  }

  findById(id: string) {
    return Category.findByPk(id, {
      include: [{ model: Category, as: 'subcategories', attributes: ['id', 'categoryName'] }],
    });
  }

  create(data: CreateCategoryDto) {
    return Category.create({
      categoryName: data.categoryName,
      parentCategoryId: data.parentCategoryId ?? null,
    });
  }

  update(id: string, data: UpdateCategoryDto) {
    return Category.update(data, { where: { id } });
  }
}
