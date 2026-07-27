import { z } from 'zod';
import { PFOrderStatus, PFDeliveryMethod } from '../shared/types/enums';

export const createPFOrderSchema = z.object({
  body: z.object({
    clientName: z.string().min(1).max(200),
    clientSurname: z.string().min(1).max(200),
    clientEmail: z.string().email(),
    clientPhone: z.string().regex(/^\d{10}$/, 'clientPhone debe ser un número de 10 dígitos sin prefijo'),
    clientDni: z.string().regex(/^\d{7,8}$/, 'clientDni debe tener 7 u 8 dígitos'),
    clientCuil: z.string().min(1).max(20),
    clientAddress: z.string().min(1).max(300),
    deliveryMethod: z.nativeEnum(PFDeliveryMethod),
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
    confirmedItemIds: z.array(z.string().uuid()).min(1).optional(),
  }),
});

export const getPFOrdersQuerySchema = z.object({
  query: z
    .object({
      status: z.nativeEnum(PFOrderStatus).optional(),
      deliveryMethod: z.nativeEnum(PFDeliveryMethod).optional(),
      search: z.string().optional(),
      dateFrom: z
        .string()
        .refine((v) => !Number.isNaN(Date.parse(v)), 'dateFrom debe ser una fecha válida')
        .optional(),
      dateTo: z
        .string()
        .refine((v) => !Number.isNaN(Date.parse(v)), 'dateTo debe ser una fecha válida')
        .optional(),
    })
    .passthrough(),
});

export const getPFOrderStatsQuerySchema = z.object({
  query: z
    .object({
      period: z.enum(['day', 'week', 'month', 'year']).optional(),
    })
    .passthrough(),
});

export type CreatePFOrderDto = z.infer<typeof createPFOrderSchema>['body'];
export type UpdatePFOrderStatusDto = z.infer<typeof updatePFOrderStatusSchema>['body'];
