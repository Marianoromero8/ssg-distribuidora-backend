import { Banner, MediaType } from '../models/banner.model';
import { UpdateBannerDto } from '../types/banner.types';

export class BannerRepository {
  findAllActive() {
    return Banner.findAll({
      where: { isActive: true },
      order: [['displayOrder', 'ASC']],
    });
  }

  findAll() {
    return Banner.findAll({ order: [['displayOrder', 'ASC']] });
  }

  findById(id: string) {
    return Banner.findByPk(id);
  }

  create(data: { mediaUrl: string; mediaType: MediaType; title?: string | null; displayOrder?: number }) {
    return Banner.create(data);
  }

  update(id: string, data: UpdateBannerDto) {
    return Banner.update(data, { where: { id } });
  }

  delete(id: string) {
    return Banner.destroy({ where: { id } });
  }
}
