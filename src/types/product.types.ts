import { z } from 'zod';
import { ContentUnit } from '../shared/types/enums';

export const createProductSchema = z.object({
  body: z.object({
    productName: z.string().min(1).max(200),
    productImage: z.string().url().optional().nullable(),
    brandId: z.string().uuid(),
    categoryId: z.string().uuid(),
    price: z.number().positive(),
    contentValue: z.number().positive(),
    contentUnit: z.nativeEnum(ContentUnit),
    packQuantity: z.number().int().positive(),
    stock: z.number().int().min(0).optional(),
    isFeatured: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    productName: z.string().min(1).max(200).optional(),
    productImage: z.string().url().optional().nullable(),
    brandId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    price: z.number().positive().optional(),
    contentValue: z.number().positive().optional(),
    contentUnit: z.nativeEnum(ContentUnit).optional(),
    packQuantity: z.number().int().positive().optional(),
    stock: z.number().int().min(0).optional(),
    available: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  }),
});

export type CreateProductDto = z.infer<typeof createProductSchema>['body'];
export type UpdateProductDto = z.infer<typeof updateProductSchema>['body'];
