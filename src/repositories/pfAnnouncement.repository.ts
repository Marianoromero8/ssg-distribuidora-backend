import { PFAnnouncement, PFAnnouncementType } from '../models/pfAnnouncement.model';
import { UpdatePFAnnouncementDto } from '../types/pfAnnouncement.types';

export class PFAnnouncementRepository {
  findAll() {
    return PFAnnouncement.findAll({
      order: [
        ['displayOrder', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });
  }

  findActiveByType(type: PFAnnouncementType) {
    return PFAnnouncement.findAll({
      where: { type, isActive: true },
      order: [['displayOrder', 'ASC']],
    });
  }

  findById(id: string) {
    return PFAnnouncement.findByPk(id);
  }

  create(data: {
    type: PFAnnouncementType;
    imageUrl: string;
    title?: string | null;
    displayOrder?: number;
  }) {
    return PFAnnouncement.create(data);
  }

  update(id: string, data: UpdatePFAnnouncementDto) {
    return PFAnnouncement.update(data, { where: { id } });
  }

  updateImage(id: string, imageUrl: string) {
    return PFAnnouncement.update({ imageUrl }, { where: { id } });
  }

  delete(id: string) {
    return PFAnnouncement.destroy({ where: { id } });
  }
}
