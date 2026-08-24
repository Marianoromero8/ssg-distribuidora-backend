import { z } from 'zod';

export const getPFCustomersQuerySchema = z.object({
  query: z
    .object({
      search: z.string().optional(),
    })
    .passthrough(),
});

export const getPFCustomerParamsSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
