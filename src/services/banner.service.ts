import { BannerRepository } from '../repositories/banner.repository';
import { UpdateBannerDto } from '../types/banner.types';
import { Banner, MediaType } from '../models/banner.model';
import { uploadToCloudinary } from '../middlewares/upload';
import { NotFoundError } from '../shared/errors/NotFoundError';

const repo = new BannerRepository();

export class BannerService {
  async getActive() {
    return repo.findAllActive();
  }

  async getAll() {
    return repo.findAll();
  }

  async getById(id: string) {
    const banner = await repo.findById(id);
    if (!banner) throw new NotFoundError('Banner');
    return banner;
  }

  async create(file: Express.Multer.File, title?: string) {
    const isVideo = file.mimetype === 'video/mp4';
    const resourceType = isVideo ? 'video' : 'image';
    const folder = isVideo ? 'ssg/banners/videos' : 'ssg/banners/images';

    const mediaUrl = await uploadToCloudinary(file.buffer, folder, resourceType);
    const mediaType = isVideo ? MediaType.VIDEO : MediaType.IMAGE;

    const allBanners = await repo.findAll();
    const displayOrder = allBanners.length;

    return repo.create({ mediaUrl, mediaType, title, displayOrder });
  }

  async update(id: string, data: UpdateBannerDto) {
    const banner = await repo.findById(id);
    if (!banner) throw new NotFoundError('Banner');
    await repo.update(id, data);
    return repo.findById(id);
  }

  async replaceMedia(id: string, file: Express.Multer.File) {
    const banner = await repo.findById(id);
    if (!banner) throw new NotFoundError('Banner');

    const isVideo = file.mimetype === 'video/mp4';
    const resourceType = isVideo ? 'video' : 'image';
    const folder = isVideo ? 'ssg/banners/videos' : 'ssg/banners/images';
    const mediaType = isVideo ? MediaType.VIDEO : MediaType.IMAGE;

    const mediaUrl = await uploadToCloudinary(file.buffer, folder, resourceType);
    await Banner.update({ mediaUrl, mediaType }, { where: { id } });
    return repo.findById(id);
  }

  async reorder(orderedIds: string[]) {
    await Promise.all(
      orderedIds.map((id, index) => repo.update(id, { displayOrder: index }))
    );
  }

  async delete(id: string) {
    const banner = await repo.findById(id);
    if (!banner) throw new NotFoundError('Banner');
    await repo.delete(id);
  }
}
