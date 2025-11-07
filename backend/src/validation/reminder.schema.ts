/**
 * @file: reminder.schema.ts
 * @description: Zod-схеми для валідації запитів, пов'язаних із нагадуваннями
 * @dependencies: zod
 * @created: 2025-11-07
 */
import { z } from 'zod';

export const reminderTypeEnum = z.enum(['workout', 'nutrition', 'water', 'custom']);

const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;

const stringBoolean = z
  .union([z.boolean(), z.string()])
  .transform(value => {
    if (typeof value === 'boolean') {
      return value;
    }
    return value === 'true';
  });

const daysOfWeekSchema = z
  .union([
    z.array(z.number()),
    z.array(z.string()),
    z.string(),
    z.undefined(),
    z.null(),
  ])
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

export const createReminderSchema = z.object({
  type: reminderTypeEnum,
  title: z.string().trim().min(1, 'Назва обовʼязкова').max(120, 'Назва надто довга'),
  message: z.string().trim().max(500, 'Повідомлення має містити до 500 символів').optional().nullable(),
  time: z
    .string()
    .trim()
    .regex(timeRegex, 'Час має бути у форматі HH:MM'),
  daysOfWeek: daysOfWeekSchema.optional(),
  enabled: stringBoolean.optional(),
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
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'Потрібно вказати хоча б одне поле для оновлення',
  });

export const reminderQuerySchema = z.object({
  enabled: stringBoolean.optional(),
});


