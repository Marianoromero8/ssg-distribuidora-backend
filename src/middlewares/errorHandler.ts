import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';
import { env } from '../config/env';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  console.error(err);

  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}
