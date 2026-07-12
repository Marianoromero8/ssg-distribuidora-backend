import { Op } from 'sequelize';
import { sequelize } from '../config/database';
import { PFProduct } from '../models/pfProduct.model';
import { PFCategory } from '../models/pfCategory.model';
import { CreatePFProductDto, UpdatePFProductDto } from '../types/pfProduct.types';

const CATEGORY_INCLUDE = [{ model: PFCategory, as: 'category' }];

export class PFProductRepository {
  findAll(onlyActive = true) {
    const where: Record<string, unknown> = {};
    if (onlyActive) where.active = true;
    return PFProduct.findAll({ where, include: CATEGORY_INCLUDE, order: [['name', 'ASC']] });
  }

  findById(id: string) {
    return PFProduct.findByPk(id, { include: CATEGORY_INCLUDE });
  }

  findByCode(code: string, excludeId?: string) {
    const where: Record<string, unknown> = { code };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    return PFProduct.findOne({ where });
  }

  async getNextCode(): Promise<string> {
    const result = (await PFProduct.findOne({
      attributes: [
        [sequelize.fn('MAX', sequelize.cast(sequelize.col('code'), 'INTEGER')), 'maxCode'],
      ],
      where: { code: { [Op.ne]: null } },
      raw: true,
    })) as unknown as { maxCode: string | null } | null;
    const max = result?.maxCode ? parseInt(result.maxCode, 10) : 0;
    return String(max + 1).padStart(4, '0');
  }

  async backfillMissingCodes() {
    const missing = await PFProduct.findAll({
      where: { code: null },
      order: [['createdAt', 'ASC']],
    });
    let next = parseInt(await this.getNextCode(), 10);
    for (const product of missing) {
      await product.update({ code: String(next).padStart(4, '0') });
      next++;
    }
  }

  create(data: CreatePFProductDto) {
    return PFProduct.create(data);
  }

  async update(id: string, data: UpdatePFProductDto) {
    await PFProduct.update(data, { where: { id } });
    return this.findById(id);
  }

  destroy(id: string) {
    return PFProduct.destroy({ where: { id } });
  }
}
