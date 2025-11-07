import { AuthRequest } from '../types';
import { Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';
import { handleControllerError, sendError } from '../utils/apiResponse';
import {
  createReminderSchema,
  reminderQuerySchema,
  updateReminderSchema,
} from '../validation/reminder.schema';

// Створити нагадування
export const createReminder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const parsed = createReminderSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, {
        statusCode: 400,
        error: 'Помилка валідації',
        message: 'Перевірте дані нагадування.',
        details: parsed.error.flatten(),
      });
    }

    const { type, title, message, time, daysOfWeek = [], enabled } = parsed.data;

    const reminder = await prisma.reminder.create({
      data: {
        userId,
        type,
        title,
        message: message ?? null,
        time,
        daysOfWeek: JSON.stringify(daysOfWeek),
        enabled: enabled !== undefined ? enabled : true,
      },
    });

    logger.info('Reminder created successfully', { reminderId: reminder.id });
    res.status(201).json(reminder);
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'ReminderController',
      operation: 'createReminder',
      errorTitle: 'Помилка створення нагадування',
      userMessage: 'Не вдалося створити нагадування.',
    });
  }
};

// Отримати всі нагадування користувача
export const getUserReminders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const parsedQuery = reminderQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      return sendError(res, {
        statusCode: 400,
        error: 'Помилка валідації',
        message: 'Невірні параметри фільтрації нагадувань.',
        details: parsedQuery.error.flatten(),
      });
    }

    const { enabled } = parsedQuery.data;

    const where: Record<string, unknown> = { userId };
    if (enabled !== undefined) {
      where.enabled = enabled;
    }

    const reminders = await prisma.reminder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Parse daysOfWeek JSON
    const remindersWithParsedDays = reminders.map(reminder => ({
      ...reminder,
      daysOfWeek: JSON.parse(reminder.daysOfWeek),
    }));

    res.json({ reminders: remindersWithParsedDays });
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'ReminderController',
      operation: 'getUserReminders',
      errorTitle: 'Помилка отримання нагадувань',
      userMessage: 'Не вдалося завантажити список нагадувань.',
      details: { query: req.query },
    });
  }
};

// Оновити нагадування
export const updateReminder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const parsed = updateReminderSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, {
        statusCode: 400,
        error: 'Помилка валідації',
        message: 'Перевірте дані для оновлення нагадування.',
        details: parsed.error.flatten(),
      });
    }

    const existingReminder = await prisma.reminder.findFirst({
      where: { id, userId },
    });

    if (!existingReminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    const { title, message, time, daysOfWeek, enabled, type } = parsed.data;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (message !== undefined) updateData.message = message ?? null;
    if (time !== undefined) updateData.time = time;
    if (daysOfWeek !== undefined) updateData.daysOfWeek = JSON.stringify(daysOfWeek);
    if (enabled !== undefined) updateData.enabled = enabled;

    const reminder = await prisma.reminder.update({
      where: { id },
      data: updateData,
    });

    const reminderWithParsedDays = {
      ...reminder,
      daysOfWeek: JSON.parse(reminder.daysOfWeek),
    };

    logger.info('Reminder updated successfully', { reminderId: id });
    res.json(reminderWithParsedDays);
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'ReminderController',
      operation: 'updateReminder',
      errorTitle: 'Помилка оновлення нагадування',
      userMessage: 'Не вдалося оновити нагадування.',
      details: { params: req.params },
    });
  }
};

// Видалити нагадування
export const deleteReminder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const reminder = await prisma.reminder.findFirst({
      where: { id, userId },
    });

    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    await prisma.reminder.delete({
      where: { id },
    });

    logger.info('Reminder deleted successfully', { reminderId: id });
    res.status(204).send();
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'ReminderController',
      operation: 'deleteReminder',
      errorTitle: 'Помилка видалення нагадування',
      userMessage: 'Не вдалося видалити нагадування.',
      details: { params: req.params },
    });
  }
};

