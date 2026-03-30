import { Request, Response, NextFunction } from 'express';
import { Role } from '../shared/types/enums';
import { ForbiddenError } from '../shared/errors/ForbiddenError';
import { UnauthorizedError } from '../shared/errors/UnauthorizedError';

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('You do not have permission to perform this action');
    }

    next();
  };
}
