import { AuthRequest } from '../types';
import { Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';

// Створити нагадування
export const createReminder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { type, title, message, time, daysOfWeek, enabled } = req.body;

    const reminder = await prisma.reminder.create({
      data: {
        userId,
        type,
        title,
        message: message || null,
        time,
        daysOfWeek: JSON.stringify(daysOfWeek || []),
        enabled: enabled !== undefined ? enabled : true,
      },
    });

    logger.info('Reminder created successfully', { reminderId: reminder.id });
    res.status(201).json(reminder);
  } catch (error: unknown) {
    logger.error('Create reminder error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Отримати всі нагадування користувача
export const getUserReminders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { enabled } = req.query;

    const where: Record<string, unknown> = { userId };
    if (enabled !== undefined) {
      where.enabled = enabled === 'true';
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
    logger.error('Get reminders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Оновити нагадування
export const updateReminder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { title, message, time, daysOfWeek, enabled } = req.body;

    const existingReminder = await prisma.reminder.findFirst({
      where: { id, userId },
    });

    if (!existingReminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (message !== undefined) updateData.message = message;
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
    logger.error('Update reminder error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
    logger.error('Delete reminder error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

