import { z } from 'zod';
import { MediaType } from '../models/banner.model';

export const updateBannerSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    title: z.string().max(200).optional().nullable(),
    displayOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const reorderBannersSchema = z.object({
  body: z.object({
    order: z.array(z.string().uuid()),
  }),
});

export type UpdateBannerDto = z.infer<typeof updateBannerSchema>['body'];
