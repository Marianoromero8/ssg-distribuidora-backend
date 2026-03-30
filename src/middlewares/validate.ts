import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../shared/errors/AppError';

export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const message = (result.error as ZodError).errors
        .map((e) => `${e.path.slice(1).join('.')}: ${e.message}`)
        .join(', ');
      throw new AppError(message, 400);
    }

    req.body = result.data.body ?? req.body;
    next();
  };
}
