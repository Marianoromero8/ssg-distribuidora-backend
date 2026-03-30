import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    categoryName: z.string().min(1).max(100),
    parentCategoryId: z.string().uuid().optional().nullable(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    categoryName: z.string().min(1).max(100).optional(),
    parentCategoryId: z.string().uuid().optional().nullable(),
  }),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>['body'];
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>['body'];
