import { Request } from 'express';

export interface PaginationOptions {
  limit: number;
  offset: number;
  page: number;
}

export function getPagination(req: Request): PaginationOptions {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const offset = (page - 1) * limit;
  return { limit, offset, page };
}

export function buildPaginatedResponse<T>(
  data: { rows: T[]; count: number },
  options: PaginationOptions
) {
  return {
    items: data.rows,
    total: data.count,
    page: options.page,
    limit: options.limit,
    totalPages: Math.ceil(data.count / options.limit),
  };
}
