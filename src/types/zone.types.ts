import { z } from 'zod';

export const createZoneSchema = z.object({
  body: z.object({
    zoneName: z.string().min(2).max(100),
  }),
});

export const updateZoneSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    zoneName: z.string().min(2).max(100).optional(),
    isActive: z.boolean().optional(),
  }),
});

export type CreateZoneDto = z.infer<typeof createZoneSchema>['body'];
export type UpdateZoneDto = z.infer<typeof updateZoneSchema>['body'];
