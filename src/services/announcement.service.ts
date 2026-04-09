import { AnnouncementRepository } from '../repositories/announcement.repository';
import { UpdateAnnouncementDto } from '../types/announcement.types';
import { uploadToCloudinary } from '../middlewares/upload';
import { NotFoundError } from '../shared/errors/NotFoundError';

const repo = new AnnouncementRepository();

export class AnnouncementService {
  async getAll() {
    return repo.findAll();
  }

  async getActive() {
    return repo.findActive();
  }

  async create(file: Express.Multer.File, title?: string, description?: string) {
    const imageUrl = await uploadToCloudinary(file.buffer, 'ssg/announcements', 'image');
    return repo.create({ imageUrl, title, description });
  }

  async update(id: string, data: UpdateAnnouncementDto) {
    const announcement = await repo.findById(id);
    if (!announcement) throw new NotFoundError('Announcement');

    // If activating this one, deactivate all others first
    if (data.isActive === true) {
      await repo.deactivateAll();
    }

    await repo.update(id, data);
    return repo.findById(id);
  }

  async replaceImage(id: string, file: Express.Multer.File) {
    const announcement = await repo.findById(id);
    if (!announcement) throw new NotFoundError('Announcement');
    const imageUrl = await uploadToCloudinary(file.buffer, 'ssg/announcements', 'image');
    await repo.updateImage(id, imageUrl);
    return repo.findById(id);
  }

  async delete(id: string) {
    const announcement = await repo.findById(id);
    if (!announcement) throw new NotFoundError('Announcement');
    await repo.delete(id);
  }
}
