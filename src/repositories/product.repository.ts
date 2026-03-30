import { WhereOptions } from 'sequelize';
import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import { Category } from '../models/category.model';
import { CreateProductDto, UpdateProductDto } from '../types/product.types';
import { PaginationOptions } from '../shared/utils/pagination';

interface FilterOptions {
  categoryId?: string;
  brandId?: string;
  isFeatured?: boolean;
}

export class ProductRepository {
  findAll(filters: FilterOptions, pagination: PaginationOptions) {
    const where: WhereOptions = { available: true };
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.brandId) where.brandId = filters.brandId;
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;

    return Product.findAndCountAll({
      where,
      include: [
        { model: Brand, as: 'brand', attributes: ['id', 'brandName', 'brandImage'] },
        { model: Category, as: 'category', attributes: ['id', 'categoryName', 'parentCategoryId'] },
      ],
      order: [['productName', 'ASC']],
      limit: pagination.limit,
      offset: pagination.offset,
    });
  }

  findById(id: string) {
    return Product.findByPk(id, {
      include: [
        { model: Brand, as: 'brand', attributes: ['id', 'brandName', 'brandImage'] },
        { model: Category, as: 'category', attributes: ['id', 'categoryName', 'parentCategoryId'] },
      ],
    });
  }

  create(data: CreateProductDto) {
    return Product.create(data);
  }

  update(id: string, data: UpdateProductDto) {
    return Product.update(data, { where: { id } });
  }

  softDelete(id: string) {
    return Product.update({ available: false }, { where: { id } });
  }
}
