import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../types/user.types';
import { hashPassword } from '../shared/utils/hash';
import { AppError } from '../shared/errors/AppError';
import { NotFoundError } from '../shared/errors/NotFoundError';

const repo = new UserRepository();

export class UserService {
  async getAll() {
    return repo.findAll();
  }

  async getById(id: string) {
    const user = await repo.findById(id);
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async create(data: CreateUserDto) {
    const existing = await repo.findByEmail(data.email);
    if (existing) throw new AppError('Email already in use', 409);

    const hashed = await hashPassword(data.password);
    const user = await repo.create({ ...data, password: hashed });

    const { password: _, ...safe } = user.toJSON();
    return safe;
  }

  async updateStatus(id: string, isActive: boolean) {
    const user = await repo.findById(id);
    if (!user) throw new NotFoundError('User');

    await repo.updateStatus(id, isActive);
    return { id, isActive };
  }

  async delete(id: string) {
    const user = await repo.findById(id);
    if (!user) throw new NotFoundError('User');
    await repo.delete(id);
  }
}
