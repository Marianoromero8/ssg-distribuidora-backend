import { z } from 'zod';

export const createPFProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    description: z.string().optional().nullable(),
    price: z.number().positive(),
    categoryId: z.string().uuid(),
    stock: z.number().int().min(0).optional(),
  }),
});

export const updatePFProductSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().optional().nullable(),
    price: z.number().positive().optional(),
    categoryId: z.string().uuid().optional(),
    stock: z.number().int().min(0).optional(),
    active: z.boolean().optional(),
  }),
});

export type CreatePFProductDto = z.infer<typeof createPFProductSchema>['body'];
export type UpdatePFProductDto = z.infer<typeof updatePFProductSchema>['body'];
