import { User } from '../models/user.model';
import { CreateUserDto } from '../types/user.types';
import { Role } from '../shared/types/enums';

export class UserRepository {
  findAll() {
    return User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
  }

  findById(id: string) {
    return User.findByPk(id, { attributes: { exclude: ['password'] } });
  }

  findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  create(data: CreateUserDto & { password: string }) {
    return User.create({
      name: data.name,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      phone: data.phone ?? null,
      documentType: data.documentType ?? null,
      documentNumber: data.documentNumber ?? null,
      role: data.role ?? Role.CLIENT,
    });
  }

  updateStatus(id: string, isActive: boolean) {
    return User.update({ isActive }, { where: { id } });
  }

  updateRole(id: string, role: Role) {
    return User.update({ role }, { where: { id } });
  }

  updateData(id: string, data: Partial<{ name: string; lastname: string; email: string; phone: string | null; documentType: string | null; documentNumber: string | null }>) {
    return User.update(data, { where: { id } });
  }

  delete(id: string) {
    return User.destroy({ where: { id } });
  }
}
