import { Brand } from '../models/brand.model';
import { CreateBrandDto, UpdateBrandDto } from '../types/brand.types';

export class BrandRepository {
  findAll() {
    return Brand.findAll({ where: { isActive: true }, order: [['brandName', 'ASC']] });
  }

  findAllAdmin() {
    return Brand.findAll({ order: [['brandName', 'ASC']] });
  }

  findById(id: string) {
    return Brand.findByPk(id);
  }

  findByName(brandName: string) {
    return Brand.findOne({ where: { brandName } });
  }

  create(data: CreateBrandDto) {
    return Brand.create(data);
  }

  update(id: string, data: UpdateBrandDto) {
    return Brand.update(data, { where: { id } });
  }

  toggleStatus(id: string, isActive: boolean) {
    return Brand.update({ isActive }, { where: { id } });
  }
}
