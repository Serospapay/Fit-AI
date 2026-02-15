import { z } from 'zod';

// Нормалізуємо email (обрізаємо пробіли та знижуємо регістр) перед валідацією
const emailSchema = z.string()
  .trim()
  .toLowerCase()
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: 'Невірний формат email',
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Пароль обовʼязковий'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Пароль має містити мінімум 6 символів'),
  name: z.string().trim().max(120).optional().nullable(),
});
