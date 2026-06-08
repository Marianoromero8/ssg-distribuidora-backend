import { z } from 'zod';

export const createPFCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    slug: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only'),
  }),
});

export const updatePFCategorySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    slug: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    active: z.boolean().optional(),
  }),
});

export type CreatePFCategoryDto = z.infer<typeof createPFCategorySchema>['body'];
export type UpdatePFCategoryDto = z.infer<typeof updatePFCategorySchema>['body'];
