import { UserScheduleRepository } from '../repositories/userSchedule.repository';
import { UserRepository } from '../repositories/user.repository';
import { ZoneRepository } from '../repositories/zone.repository';
import { CreateScheduleDto } from '../types/userSchedule.types';
import { AppError } from '../shared/errors/AppError';
import { NotFoundError } from '../shared/errors/NotFoundError';

const repo = new UserScheduleRepository();
const userRepo = new UserRepository();
const zoneRepo = new ZoneRepository();

export class UserScheduleService {
  async getByUser(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new NotFoundError('User');
    return repo.findByUser(userId);
  }

  async create(userId: string, data: CreateScheduleDto) {
    const user = await userRepo.findById(userId);
    if (!user) throw new NotFoundError('User');

    const zone = await zoneRepo.findById(data.zoneId);
    if (!zone) throw new NotFoundError('Zone');

    const duplicate = await repo.findDuplicate(userId, data.zoneId, data.dayOfWeek);
    if (duplicate) throw new AppError('Schedule entry already exists for this day and zone', 409);

    return repo.create(userId, data);
  }

  async delete(userId: string, scheduleId: string) {
    const schedule = await repo.findById(scheduleId);
    if (!schedule || schedule.userId !== userId) throw new NotFoundError('Schedule');
    await repo.delete(scheduleId);
  }
}
