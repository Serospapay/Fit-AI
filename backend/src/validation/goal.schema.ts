/**
 * @file: goal.schema.ts
 * @description: Zod-схеми для валідації запитів, пов'язаних із цілями користувача
 * @dependencies: zod
 * @created: 2025-11-07
 */
import { z } from 'zod';

export const goalCategoryEnum = z.enum(['weight', 'strength', 'endurance', 'nutrition', 'custom']);

export const goalStatusEnum = z.enum(['active', 'completed', 'cancelled', 'paused']);

const nullableNumber = z
  .union([z.string(), z.number()])
  .transform(value => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    const numericValue = typeof value === 'number' ? value : Number(value);
    return Number.isNaN(numericValue) ? Number.NaN : numericValue;
  })
  .refine(value => value === undefined || !Number.isNaN(value), {
    message: 'Значення має бути числом',
  })
  .refine(value => value === undefined || value >= 0, {
    message: 'Значення має бути невідʼємним',
  })
  .optional();

const optionalDate = z.preprocess(
  value => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    return value;
  },
  z.coerce.date().optional()
);

export const createGoalSchema = z.object({
  title: z.string().trim().min(1, 'Назва обовʼязкова').max(120, 'Назва надто довга'),
  description: z
    .string()
    .trim()
    .max(500, 'Опис має містити до 500 символів')
    .optional()
    .nullable(),
  category: goalCategoryEnum,
  targetValue: nullableNumber,
  unit: z
    .string()
    .trim()
    .max(50, 'Одиниці виміру мають містити до 50 символів')
    .optional()
    .nullable(),
  targetDate: optionalDate,
});

export const updateGoalSchema = createGoalSchema
  .extend({
    status: goalStatusEnum.optional(),
    currentValue: nullableNumber,
  })
  .partial()
  .refine(data => Object.keys(data).length > 0, {
    message: 'Потрібно вказати хоча б одне поле для оновлення',
  });

export const goalQuerySchema = z.object({
  status: goalStatusEnum.optional(),
});


