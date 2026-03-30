import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '../shared/types/enums';
import { UnauthorizedError } from '../shared/errors/UnauthorizedError';

interface TokenPayload {
  id: string;
  email: string;
  role: Role;
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.split(' ')[1];

  const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  req.user = decoded;
  next();
}
