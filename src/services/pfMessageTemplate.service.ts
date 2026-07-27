import { PFMessageTemplateRepository } from '../repositories/pfMessageTemplate.repository';
import { NotFoundError } from '../shared/errors/NotFoundError';

const repo = new PFMessageTemplateRepository();

export class PFMessageTemplateService {
  async getAll() {
    return repo.findAll();
  }

  async getByKey(key: string) {
    const template = await repo.findByKey(key);
    if (!template) throw new NotFoundError('Message template');
    return template;
  }

  async update(key: string, body: string) {
    return repo.update(key, body);
  }
}
