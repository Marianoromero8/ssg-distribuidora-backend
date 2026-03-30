import { z } from 'zod';
import { Role, DocumentType } from '../shared/types/enums';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    lastname: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().max(20).optional().nullable(),
    documentType: z.nativeEnum(DocumentType).optional().nullable(),
    documentNumber: z.string().max(20).optional().nullable(),
    role: z.nativeEnum(Role).optional(),
  }),
});

export const updateUserStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    isActive: z.boolean(),
  }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>['body'];
