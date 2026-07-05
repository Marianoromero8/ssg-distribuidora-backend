import { z } from 'zod';

export const updatePFAnnouncementSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    title: z.string().max(200).optional().nullable(),
    isActive: z.boolean().optional(),
    displayOrder: z.number().int().min(0).optional(),
  }),
});

export type UpdatePFAnnouncementDto = z.infer<typeof updatePFAnnouncementSchema>['body'];
