import { Zone } from '../models/zone.model';
import { CreateZoneDto, UpdateZoneDto } from '../types/zone.types';

export class ZoneRepository {
  findAll() {
    return Zone.findAll({ order: [['zoneName', 'ASC']] });
  }

  findAllActive() {
    return Zone.findAll({ where: { isActive: true }, order: [['zoneName', 'ASC']] });
  }

  findById(id: string) {
    return Zone.findByPk(id);
  }

  findByName(zoneName: string) {
    return Zone.findOne({ where: { zoneName } });
  }

  create(data: CreateZoneDto) {
    return Zone.create(data);
  }

  update(id: string, data: UpdateZoneDto) {
    return Zone.update(data, { where: { id } });
  }

  delete(id: string) {
    return Zone.destroy({ where: { id } });
  }
}
