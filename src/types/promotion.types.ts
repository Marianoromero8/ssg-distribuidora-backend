import { z } from 'zod';
import { DiscountType } from '../shared/types/enums';

export const createPromotionSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    title: z.string().min(1).max(200),
    discountType: z.nativeEnum(DiscountType),
    discountValue: z.number().positive(),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
  }),
});

export const updatePromotionSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    discountType: z.nativeEnum(DiscountType).optional(),
    discountValue: z.number().positive().optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
    isActive: z.boolean().optional(),
  }),
});

export type CreatePromotionDto = z.infer<typeof createPromotionSchema>['body'];
export type UpdatePromotionDto = z.infer<typeof updatePromotionSchema>['body'];
