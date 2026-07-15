import { z } from 'zod';

export const updatePFSettingsSchema = z.object({
  body: z.object({
    accountHolderName: z.string(),
    cuil: z.string(),
    alias: z.string(),
    cbu: z.string(),
    phone: z.string(),
    address: z.string(),
    instagramUrl: z.string(),
    facebookUrl: z.string(),
    whatsappUrl: z.string(),
  }),
});

export type UpdatePFSettingsDto = z.infer<typeof updatePFSettingsSchema>['body'];
