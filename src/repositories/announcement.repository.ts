import { Announcement } from '../models/announcement.model';
import { UpdateAnnouncementDto } from '../types/announcement.types';

export class AnnouncementRepository {
  findAll() {
    return Announcement.findAll({ order: [['createdAt', 'DESC']] });
  }

  findActive() {
    return Announcement.findOne({ where: { isActive: true } });
  }

  findById(id: string) {
    return Announcement.findByPk(id);
  }

  create(data: { imageUrl: string; title?: string | null; description?: string | null }) {
    return Announcement.create(data);
  }

  update(id: string, data: UpdateAnnouncementDto) {
    return Announcement.update(data, { where: { id } });
  }

  updateImage(id: string, imageUrl: string) {
    return Announcement.update({ imageUrl }, { where: { id } });
  }

  deactivateAll() {
    return Announcement.update({ isActive: false }, { where: {} });
  }

  delete(id: string) {
    return Announcement.destroy({ where: { id } });
  }
}
