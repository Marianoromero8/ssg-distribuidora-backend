import { UserSchedule } from '../models/userSchedule.model';
import { Zone } from '../models/zone.model';
import { CreateScheduleDto } from '../types/userSchedule.types';

export class UserScheduleRepository {
  findByUser(userId: string) {
    return UserSchedule.findAll({
      where: { userId },
      include: [{ model: Zone, as: 'zone', attributes: ['id', 'zoneName'] }],
      order: [['dayOfWeek', 'ASC']],
    });
  }

  findById(id: string) {
    return UserSchedule.findByPk(id);
  }

  findDuplicate(userId: string, zoneId: string, dayOfWeek: string) {
    return UserSchedule.findOne({ where: { userId, zoneId, dayOfWeek } });
  }

  create(userId: string, data: CreateScheduleDto) {
    return UserSchedule.create({ userId, ...data });
  }

  delete(id: string) {
    return UserSchedule.destroy({ where: { id } });
  }
}
