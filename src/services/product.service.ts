import { ProductRepository } from '../repositories/product.repository';
import { BrandRepository } from '../repositories/brand.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateProductDto, UpdateProductDto } from '../types/product.types';
import { NotFoundError } from '../shared/errors/NotFoundError';
import { PaginationOptions, buildPaginatedResponse } from '../shared/utils/pagination';
import { uploadToCloudinary } from '../middlewares/upload';
import { Product } from '../models/product.model';

const repo = new ProductRepository();
const brandRepo = new BrandRepository();
const categoryRepo = new CategoryRepository();

export class ProductService {
  async getAll(
    filters: { categoryId?: string; brandId?: string; isFeatured?: boolean },
    pagination: PaginationOptions
  ) {
    const result = await repo.findAll(filters, pagination);
    return buildPaginatedResponse(result, pagination);
  }

  async getAllAdmin(
    filters: { categoryId?: string; brandId?: string; isFeatured?: boolean },
    pagination: PaginationOptions
  ) {
    const result = await repo.findAllAdmin(filters, pagination);
    return buildPaginatedResponse(result, pagination);
  }

  async getById(id: string) {
    const product = await repo.findById(id);
    if (!product) throw new NotFoundError('Product');
    return product;
  }

  async create(data: CreateProductDto) {
    const brand = await brandRepo.findById(data.brandId);
    if (!brand) throw new NotFoundError('Brand');
    const category = await categoryRepo.findById(data.categoryId);
    if (!category) throw new NotFoundError('Category');
    return repo.create(data);
  }

  async update(id: string, data: UpdateProductDto) {
    const product = await repo.findById(id);
    if (!product) throw new NotFoundError('Product');
    if (data.brandId) {
      const brand = await brandRepo.findById(data.brandId);
      if (!brand) throw new NotFoundError('Brand');
    }
    if (data.categoryId) {
      const category = await categoryRepo.findById(data.categoryId);
      if (!category) throw new NotFoundError('Category');
    }
    await repo.update(id, data);
    return repo.findById(id);
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    const product = await repo.findById(id);
    if (!product) throw new NotFoundError('Product');
    const productImage = await uploadToCloudinary(file.buffer, 'ssg/products');
    await Product.update({ productImage }, { where: { id } });
    return repo.findById(id);
  }

  async delete(id: string) {
    const product = await repo.findById(id);
    if (!product) throw new NotFoundError('Product');
    await repo.softDelete(id);
  }

  async hardDelete(id: string) {
    const product = await repo.findById(id);
    if (!product) throw new NotFoundError('Product');
    await repo.hardDelete(id);
  }
}
