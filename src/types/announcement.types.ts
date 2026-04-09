import { z } from 'zod';

export const updateAnnouncementSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    title: z.string().max(200).optional().nullable(),
    description: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

export type UpdateAnnouncementDto = z.infer<typeof updateAnnouncementSchema>['body'];
