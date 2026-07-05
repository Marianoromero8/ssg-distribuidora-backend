import { PFSettingsRepository } from '../repositories/pfSettings.repository';
import { UpdatePFSettingsDto } from '../types/pfSettings.types';

const repo = new PFSettingsRepository();

export class PFSettingsService {
  async getSettings() {
    return repo.get();
  }

  async updateSettings(data: UpdatePFSettingsDto) {
    return repo.update(data);
  }
}
