import { z } from 'zod';
import { PFOrderStatus } from '../shared/types/enums';

export const createPFOrderSchema = z.object({
  body: z.object({
    clientName: z.string().min(1).max(200),
    clientSurname: z.string().min(1).max(200),
    clientEmail: z.string().email(),
    clientPhone: z.string().min(1).max(50),
    clientDni: z.string().min(1).max(20),
    clientCuil: z.string().min(1).max(20),
    clientAddress: z.string().min(1).max(300),
    items: z
      .array(
        z.object({
          productId: z.string().uuid(),
          quantity: z.number().int().positive(),
        })
      )
      .min(1),
  }),
});

export const updatePFOrderStatusSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    status: z.enum([PFOrderStatus.ACCEPTED, PFOrderStatus.DECLINED, PFOrderStatus.PAID]),
    note: z.string().optional(),
    confirmedItemIds: z.array(z.string().uuid()).optional(),
  }),
});

export type CreatePFOrderDto = z.infer<typeof createPFOrderSchema>['body'];
export type UpdatePFOrderStatusDto = z.infer<typeof updatePFOrderStatusSchema>['body'];
