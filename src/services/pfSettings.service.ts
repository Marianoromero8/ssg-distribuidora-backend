import { PFSettingsRepository } from '../repositories/pfSettings.repository';
import { UpdatePFSettingsDto } from '../types/pfSettings.types';

const repo = new PFSettingsRepository();

export class PFSettingsService {
  async getSettings() {
    return repo.get();
  }

  async getPublicSettings() {
    const settings = await repo.get();
    return {
      address: settings.address,
      instagramUrl: settings.instagramUrl,
      facebookUrl: settings.facebookUrl,
      whatsappUrl: settings.whatsappUrl,
    };
  }

  async updateSettings(data: UpdatePFSettingsDto) {
    return repo.update(data);
  }
}
