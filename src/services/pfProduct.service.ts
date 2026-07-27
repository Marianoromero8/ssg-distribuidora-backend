import { PFProductRepository } from '../repositories/pfProduct.repository';
import { PFCategoryRepository } from '../repositories/pfCategory.repository';
import { CreatePFProductDto, UpdatePFProductDto } from '../types/pfProduct.types';
import { NotFoundError } from '../shared/errors/NotFoundError';
import { AppError } from '../shared/errors/AppError';
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

    let code = data.code;
    if (code) {
      const existing = await repo.findByCode(code);
      if (existing) throw new AppError('Product code already in use', 409);
    } else {
      code = await repo.getNextCode();
    }

    return repo.create({ ...data, code });
  }

  async update(id: string, data: UpdatePFProductDto) {
    const product = await repo.findById(id);
    if (!product) throw new NotFoundError('Product');
    if (data.categoryId) {
      const category = await categoryRepo.findById(data.categoryId);
      if (!category) throw new NotFoundError('Category');
    }
    if (data.code) {
      const existing = await repo.findByCode(data.code, id);
      if (existing) throw new AppError('Product code already in use', 409);
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
    const orderCount = await repo.countOrderHistory(id);
    if (orderCount > 0) {
      throw new AppError(
        `No se puede eliminar "${product.name}": tiene ${orderCount} pedido(s) en su historial. Desactivalo en vez de eliminarlo.`,
        409
      );
    }
    await repo.destroy(id);
  }
}
