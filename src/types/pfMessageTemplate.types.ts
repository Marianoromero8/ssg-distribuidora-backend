import { z } from 'zod';

export const PF_MESSAGE_TEMPLATE_KEYS = [
  'ORDER_ACCEPTED_PICKUP',
  'ORDER_ACCEPTED_DELIVERY',
  'ORDER_DECLINED',
] as const;

export const updatePFMessageTemplateSchema = z.object({
  params: z.object({ key: z.enum(PF_MESSAGE_TEMPLATE_KEYS) }),
  body: z.object({ body: z.string().min(1) }),
});

export type UpdatePFMessageTemplateDto = z.infer<typeof updatePFMessageTemplateSchema>['body'];
