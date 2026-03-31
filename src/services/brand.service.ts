import { BrandRepository } from '../repositories/brand.repository';
import { CreateBrandDto, UpdateBrandDto } from '../types/brand.types';
import { AppError } from '../shared/errors/AppError';
import { NotFoundError } from '../shared/errors/NotFoundError';
import { uploadToCloudinary } from '../middlewares/upload';
import { Brand } from '../models/brand.model';

const repo = new BrandRepository();

export class BrandService {
  async getAll() {
    return repo.findAll();
  }

  async getAllAdmin() {
    return repo.findAllAdmin();
  }

  async getById(id: string) {
    const brand = await repo.findById(id);
    if (!brand) throw new NotFoundError('Brand');
    return brand;
  }

  async create(data: CreateBrandDto) {
    const existing = await repo.findByName(data.brandName);
    if (existing) throw new AppError('Brand name already exists', 409);
    return repo.create(data);
  }

  async update(id: string, data: UpdateBrandDto) {
    const brand = await repo.findById(id);
    if (!brand) throw new NotFoundError('Brand');
    await repo.update(id, data);
    return repo.findById(id);
  }

  async toggleStatus(id: string) {
    const brand = await repo.findById(id);
    if (!brand) throw new NotFoundError('Brand');
    await repo.toggleStatus(id, !brand.isActive);
    return repo.findById(id);
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    const brand = await repo.findById(id);
    if (!brand) throw new NotFoundError('Brand');
    const brandImage = await uploadToCloudinary(file.buffer, 'ssg/brands');
    await Brand.update({ brandImage }, { where: { id } });
    return repo.findById(id);
  }

  async delete(id: string) {
    const brand = await repo.findById(id);
    if (!brand) throw new NotFoundError('Brand');
    await repo.delete(id);
  }
}
