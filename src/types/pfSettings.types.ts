import { z } from 'zod';

export const updatePFSettingsSchema = z.object({
  body: z.object({
    accountHolderName: z.string(),
    cuil: z.string(),
    alias: z.string(),
    cbu: z.string(),
    phone: z.string(),
  }),
});

export type UpdatePFSettingsDto = z.infer<typeof updatePFSettingsSchema>['body'];
