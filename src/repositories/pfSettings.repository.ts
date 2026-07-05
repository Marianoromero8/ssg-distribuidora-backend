import { PFSettings } from '../models/pfSettings.model';
import { UpdatePFSettingsDto } from '../types/pfSettings.types';
import { env } from '../config/env';

export class PFSettingsRepository {
  async get() {
    const [settings] = await PFSettings.findOrCreate({
      where: {},
      defaults: {
        accountHolderName: '',
        cuil: '',
        alias: env.PF_ALIAS,
        cbu: env.PF_CBU,
        phone: '',
      },
    });
    return settings;
  }

  async update(data: UpdatePFSettingsDto) {
    const settings = await this.get();
    return settings.update(data);
  }
}
