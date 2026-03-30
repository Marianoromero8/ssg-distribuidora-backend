import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { LoginDto } from '../types/auth.types';
import { comparePassword } from '../shared/utils/hash';
import { UnauthorizedError } from '../shared/errors/UnauthorizedError';
import { env } from '../config/env';

const userRepo = new UserRepository();

export class AuthService {
  async login(data: LoginDto) {
    const user = await userRepo.findByEmail(data.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const valid = await comparePassword(data.password, user.password);
    if (!valid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET as string,
      { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
    );

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
}
