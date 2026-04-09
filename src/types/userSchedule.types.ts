import { z } from 'zod';
import { DayOfWeek } from '../shared/types/enums';

export const createScheduleSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    zoneId: z.string().uuid(),
    dayOfWeek: z.nativeEnum(DayOfWeek),
  }),
});

export const deleteScheduleSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
    scheduleId: z.string().uuid(),
  }),
});

export type CreateScheduleDto = z.infer<typeof createScheduleSchema>['body'];
