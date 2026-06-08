import { PFProductRepository } from '../repositories/pfProduct.repository';
import { PFCategoryRepository } from '../repositories/pfCategory.repository';
import { CreatePFProductDto, UpdatePFProductDto } from '../types/pfProduct.types';
import { NotFoundError } from '../shared/errors/NotFoundError';
import { uploadToCloudinary } from '../middlewares/upload';
import { PFProduct } from '../models/pfProduct.model';

const repo = new PFProductRepository();
const categoryRepo = new PFCategoryRepository();

export class PFProductService {
  getAll(onlyActive = true) {
    return repo.findAll(onlyActive);
  }

  async getById(id: string) {
    const product = await repo.findById(id);
    if (!product) throw new NotFoundError('Product');
    return product;
  }

  async create(data: CreatePFProductDto) {
    const category = await categoryRepo.findById(data.categoryId);
    if (!category) throw new NotFoundError('Category');
    return repo.create(data);
  }

  async update(id: string, data: UpdatePFProductDto) {
    const product = await repo.findById(id);
    if (!product) throw new NotFoundError('Product');
    if (data.categoryId) {
      const category = await categoryRepo.findById(data.categoryId);
      if (!category) throw new NotFoundError('Category');
    }
    return repo.update(id, data);
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    const product = await repo.findById(id);
    if (!product) throw new NotFoundError('Product');
    const imageUrl = await uploadToCloudinary(file.buffer, 'punto-fiesta/products');
    await PFProduct.update({ imageUrl }, { where: { id } });
    return repo.findById(id);
  }

  async delete(id: string) {
    const product = await repo.findById(id);
    if (!product) throw new NotFoundError('Product');
    await repo.destroy(id);
  }
}
