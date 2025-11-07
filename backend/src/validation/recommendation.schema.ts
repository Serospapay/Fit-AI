/**
 * @file: recommendation.schema.ts
 * @description: Zod-схеми для валідації запитів, пов'язаних із рекомендаціями
 * @dependencies: zod
 * @created: 2025-11-07
 */
import { z } from 'zod';

const booleanLike = z
  .union([z.boolean(), z.string(), z.undefined()])
  .transform(value => {
    if (value === undefined) {
      return undefined;
    }
    if (typeof value === 'boolean') {
      return value;
    }

    return value === 'true';
  });

export const recommendationQuerySchema = z.object({
  isRead: booleanLike.optional(),
  limit: z
    .union([z.string(), z.number(), z.undefined()])
    .transform(value => {
      if (value === undefined) {
        return 10;
      }
      const numericValue = typeof value === 'number' ? value : Number(value);
      return Number.isNaN(numericValue) ? Number.NaN : numericValue;
    })
    .refine(value => !Number.isNaN(value) && value > 0 && value <= 100, {
      message: 'Ліміт має бути числом від 1 до 100',
    })
    .optional(),
});


