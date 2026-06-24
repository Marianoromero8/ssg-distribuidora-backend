import { PFAnnouncementRepository } from '../repositories/pfAnnouncement.repository';
import { PFAnnouncementType } from '../models/pfAnnouncement.model';
import { UpdatePFAnnouncementDto } from '../types/pfAnnouncement.types';
import { uploadToCloudinary } from '../middlewares/upload';
import { NotFoundError } from '../shared/errors/NotFoundError';

const repo = new PFAnnouncementRepository();

export class PFAnnouncementService {
  async getAll() {
    return repo.findAll();
  }

  async getActivePopups() {
    return repo.findActiveByType(PFAnnouncementType.POPUP);
  }

  async getActiveCarousel() {
    return repo.findActiveByType(PFAnnouncementType.CAROUSEL);
  }

  async create(
    file: Express.Multer.File,
    type: PFAnnouncementType,
    title?: string,
    displayOrder?: number
  ) {
    const imageUrl = await uploadToCloudinary(file.buffer, 'punto-fiesta/announcements', 'image');
    return repo.create({ type, imageUrl, title, displayOrder });
  }

  async update(id: string, data: UpdatePFAnnouncementDto) {
    const announcement = await repo.findById(id);
    if (!announcement) throw new NotFoundError('PFAnnouncement');
    await repo.update(id, data);
    return repo.findById(id);
  }

  async replaceImage(id: string, file: Express.Multer.File) {
    const announcement = await repo.findById(id);
    if (!announcement) throw new NotFoundError('PFAnnouncement');
    const imageUrl = await uploadToCloudinary(file.buffer, 'punto-fiesta/announcements', 'image');
    await repo.updateImage(id, imageUrl);
    return repo.findById(id);
  }

  async delete(id: string) {
    const announcement = await repo.findById(id);
    if (!announcement) throw new NotFoundError('PFAnnouncement');
    await repo.delete(id);
  }
}
