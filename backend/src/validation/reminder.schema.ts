/**
 * @file: reminder.schema.ts
 * @description: Zod-схеми для валідації запитів, пов'язаних із нагадуваннями
 * @dependencies: zod
 * @created: 2025-11-07
 */
import { z } from 'zod';

export const reminderTypeEnum = z.enum(['workout', 'nutrition', 'water', 'custom']);
export const repeatFrequencyEnum = z.enum(['once', 'daily', 'weekly', 'custom']);
export const notificationChannelEnum = z.enum(['browser', 'push', 'email']).optional();

const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;

const stringBoolean = z
  .union([z.boolean(), z.string()])
  .transform(value => {
    if (typeof value === 'boolean') {
      return value;
    }
    return value === 'true';
  });

const optionalDate = z.preprocess(
  value => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (value instanceof Date) {
      return value;
    }
    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  },
  z.date().optional()
);

const repeatIntervalSchema = z
  .union([z.number(), z.string()])
  .optional()
  .transform(value => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  })
  .refine(value => value === undefined || (Number.isInteger(value) && value >= 1 && value <= 30), {
    message: 'Інтервал повторення має бути числом від 1 до 30',
  });

const daysOfWeekSchema = z
  .union([z.array(z.number()), z.array(z.string()), z.string(), z.undefined(), z.null()])
  .transform(value => {
    if (Array.isArray(value)) {
      return value
        .map(day => (typeof day === 'string' ? Number(day) : day))
        .filter(day => !Number.isNaN(day));
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed
            .map(day => (typeof day === 'string' ? Number(day) : day))
            .filter(day => !Number.isNaN(day));
        }
      } catch {
        return [];
      }
    }

    return [];
  })
  .refine(days => days.every(day => day >= 0 && day <= 6), {
    message: 'Дні тижня мають бути числами від 0 до 6',
  });

const timezoneSchema = z
  .string()
  .trim()
  .min(2, 'Таймзона повинна містити щонайменше 2 символи')
  .max(60, 'Таймзона надто довга')
  .optional();

export const createReminderSchema = z
  .object({
    type: reminderTypeEnum,
    title: z.string().trim().min(1, 'Назва обовʼязкова').max(120, 'Назва надто довга'),
    message: z.string().trim().max(500, 'Повідомлення має містити до 500 символів').optional().nullable(),
    time: z
      .string()
      .trim()
      .regex(timeRegex, 'Час має бути у форматі HH:MM'),
    daysOfWeek: daysOfWeekSchema.optional(),
    enabled: stringBoolean.optional(),
    startDate: optionalDate,
    repeatFrequency: repeatFrequencyEnum.optional().default('weekly'),
    repeatInterval: repeatIntervalSchema,
    repeatEndsAt: optionalDate,
    timezone: timezoneSchema,
    notificationChannel: notificationChannelEnum,
  })
  .superRefine((data, ctx) => {
    if (data.repeatFrequency === 'weekly') {
      if (!data.daysOfWeek || data.daysOfWeek.length === 0) {
        ctx.addIssue({
          path: ['daysOfWeek'],
          code: z.ZodIssueCode.custom,
          message: 'Оберіть принаймні один день тижня для щотижневого нагадування',
        });
      }
    }

    if (data.repeatFrequency === 'once') {
      if (!data.startDate) {
        ctx.addIssue({
          path: ['startDate'],
          code: z.ZodIssueCode.custom,
          message: 'Вкажіть дату для одноразового нагадування',
        });
      }
    }

    if (data.repeatFrequency === 'custom' || data.repeatFrequency === 'daily') {
      if (!data.repeatInterval) {
        ctx.addIssue({
          path: ['repeatInterval'],
          code: z.ZodIssueCode.custom,
          message: 'Вкажіть інтервал повторення',
        });
      }
    }

    if (data.repeatEndsAt && data.startDate && data.repeatEndsAt < data.startDate) {
      ctx.addIssue({
        path: ['repeatEndsAt'],
        code: z.ZodIssueCode.custom,
        message: 'Дата завершення не може бути раніше дати початку',
      });
    }
  });

export const updateReminderSchema = z
  .object({
    type: reminderTypeEnum.optional(),
    title: z.string().trim().min(1, 'Назва обовʼязкова').max(120, 'Назва надто довга').optional(),
    message: z.string().trim().max(500, 'Повідомлення має містити до 500 символів').optional().nullable(),
    time: z
      .string()
      .trim()
      .regex(timeRegex, 'Час має бути у форматі HH:MM')
      .optional(),
    daysOfWeek: daysOfWeekSchema.optional(),
    enabled: stringBoolean.optional(),
    startDate: optionalDate,
    repeatFrequency: repeatFrequencyEnum.optional(),
    repeatInterval: repeatIntervalSchema,
    repeatEndsAt: optionalDate,
    timezone: timezoneSchema,
    notificationChannel: notificationChannelEnum,
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'Потрібно вказати хоча б одне поле для оновлення',
  })
  .superRefine((data, ctx) => {
    if (data.repeatFrequency === 'weekly' && data.daysOfWeek && data.daysOfWeek.length === 0) {
      ctx.addIssue({
        path: ['daysOfWeek'],
        code: z.ZodIssueCode.custom,
        message: 'Оберіть принаймні один день тижня для щотижневого нагадування',
      });
    }

    if ((data.repeatFrequency === 'custom' || data.repeatFrequency === 'daily') && !data.repeatInterval) {
      ctx.addIssue({
        path: ['repeatInterval'],
        code: z.ZodIssueCode.custom,
        message: 'Вкажіть інтервал повторення',
      });
    }

    if (data.repeatEndsAt && data.startDate && data.repeatEndsAt < data.startDate) {
      ctx.addIssue({
        path: ['repeatEndsAt'],
        code: z.ZodIssueCode.custom,
        message: 'Дата завершення не може бути раніше дати початку',
      });
    }
  });

export const reminderQuerySchema = z.object({
  enabled: stringBoolean.optional(),
});

