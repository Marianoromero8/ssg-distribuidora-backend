import { z } from 'zod';

export const createBrandSchema = z.object({
  body: z.object({
    brandName: z.string().min(1).max(100),
    brandImage: z.string().url().optional().nullable(),
  }),
});

export const updateBrandSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    brandName: z.string().min(1).max(100).optional(),
    brandImage: z.string().url().optional().nullable(),
  }),
});

export type CreateBrandDto = z.infer<typeof createBrandSchema>['body'];
export type UpdateBrandDto = z.infer<typeof updateBrandSchema>['body'];
