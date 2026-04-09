import { ZoneRepository } from '../repositories/zone.repository';
import { CreateZoneDto, UpdateZoneDto } from '../types/zone.types';
import { AppError } from '../shared/errors/AppError';
import { NotFoundError } from '../shared/errors/NotFoundError';

const repo = new ZoneRepository();

export class ZoneService {
  async getAll() {
    return repo.findAll();
  }

  async getAllActive() {
    return repo.findAllActive();
  }

  async getById(id: string) {
    const zone = await repo.findById(id);
    if (!zone) throw new NotFoundError('Zone');
    return zone;
  }

  async create(data: CreateZoneDto) {
    const existing = await repo.findByName(data.zoneName);
    if (existing) throw new AppError('Zone name already exists', 409);
    return repo.create(data);
  }

  async update(id: string, data: UpdateZoneDto) {
    const zone = await repo.findById(id);
    if (!zone) throw new NotFoundError('Zone');
    await repo.update(id, data);
    return repo.findById(id);
  }

  async delete(id: string) {
    const zone = await repo.findById(id);
    if (!zone) throw new NotFoundError('Zone');
    await repo.delete(id);
  }
}
