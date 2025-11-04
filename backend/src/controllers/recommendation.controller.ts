import { AuthRequest } from '../types';
import { Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';

// Отримати рекомендації користувача
export const getUserRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { isRead, limit = '10' } = req.query;

    const where: Record<string, unknown> = { userId };
    if (isRead !== undefined) {
      where.isRead = isRead === 'true';
    }

    const recommendations = await prisma.recommendation.findMany({
      where,
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' },
    });

    res.json({ recommendations });
  } catch (error: unknown) {
    logger.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Отримати кількість непрочитаних рекомендацій
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const count = await prisma.recommendation.count({
      where: {
        userId,
        isRead: false,
      },
    });

    res.json({ count });
  } catch (error: unknown) {
    logger.error('Get unread count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Позначити рекомендацію як прочитану
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const recommendation = await prisma.recommendation.findFirst({
      where: { id, userId },
    });

    if (!recommendation) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }

    const updated = await prisma.recommendation.update({
      where: { id },
      data: { isRead: true },
    });

    logger.info('Recommendation marked as read', { recommendationId: id });
    res.json(updated);
  } catch (error: unknown) {
    logger.error('Mark as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Видалити рекомендацію
export const deleteRecommendation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const recommendation = await prisma.recommendation.findFirst({
      where: { id, userId },
    });

    if (!recommendation) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }

    await prisma.recommendation.delete({
      where: { id },
    });

    logger.info('Recommendation deleted', { recommendationId: id });
    res.status(204).send();
  } catch (error: unknown) {
    logger.error('Delete recommendation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Згенерувати рекомендації на основі статистики
export const generateRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const recommendations: Array<{
      type: string;
      title: string;
      message: string;
      priority: string;
    }> = [];

    // Отримати статистику тренувань за останні 7 днів
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentWorkouts = await prisma.workout.findMany({
      where: {
        userId,
        date: { gte: sevenDaysAgo },
        status: 'completed',
      },
      orderBy: { date: 'desc' },
    });

    // Перевірка: чи не тренувався довше 3 днів
    if (recentWorkouts.length > 0) {
      const lastWorkoutDate = recentWorkouts[0].date;
      const daysSinceLastWorkout = Math.floor(
        (new Date().getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastWorkout >= 3) {
        recommendations.push({
          type: 'workout',
          title: 'Час повернутися до тренувань!',
          message: `Ви не тренувалися ${daysSinceLastWorkout} днів. Час повернутися до залу та продовжити свій прогрес!`,
          priority: 'high',
        });
      }
    } else {
      recommendations.push({
        type: 'workout',
        title: 'Почніть свій фітнес-шлях!',
        message: 'Ви ще не додали жодного тренування за останні 7 днів. Почати сьогодні - краще рішення!',
        priority: 'high',
      });
    }

    // Перевірка серії тренувань
    const workoutStreak = await calculateWorkoutStreak(userId);
    if (workoutStreak >= 7) {
      recommendations.push({
        type: 'progress',
        title: 'Відмінна серія!',
        message: `Ви досягли серії з ${workoutStreak} днів тренувань підряд! Продовжуйте в тому ж дусі! 🔥`,
        priority: 'normal',
      });
    }

    // Перевірка харчування
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentNutritionLogs = await prisma.nutritionLog.findMany({
      where: {
        userId,
        date: { gte: thirtyDaysAgo },
      },
      include: {
        items: true,
      },
    });

    // Розрахувати середнє споживання білків
    let totalProtein = 0;
    let totalDays = 0;

    for (const log of recentNutritionLogs) {
      const dayProtein = log.items.reduce((sum, item) => sum + item.protein, 0);
      totalProtein += dayProtein;
      totalDays++;
    }

    if (totalDays > 0) {
      const avgProtein = totalProtein / totalDays;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      
      // Рекомендована норма білків: ~1.6-2.2г на кг ваги для активних людей
      const recommendedProtein = user?.weight ? user.weight * 1.8 : 120;
      
      if (avgProtein < recommendedProtein * 0.8) {
        recommendations.push({
          type: 'nutrition',
          title: 'Недостатнє споживання білків',
          message: `Ваше середнє споживання білків (${Math.round(avgProtein)}г) нижче за рекомендоване (${Math.round(recommendedProtein)}г). Додайте більше білкових продуктів до раціону!`,
          priority: 'normal',
        });
      }
    }

    // Перевірка прогресу тривалості тренувань
    if (recentWorkouts.length >= 7) {
      const firstWeek = recentWorkouts.slice(-7);
      const secondWeek = recentWorkouts.slice(-14, -7);
      
      if (secondWeek.length >= 7) {
        const avgFirstWeek = firstWeek.reduce((sum, w) => sum + (w.duration || 0), 0) / firstWeek.length;
        const avgSecondWeek = secondWeek.reduce((sum, w) => sum + (w.duration || 0), 0) / secondWeek.length;
        
        if (avgFirstWeek > avgSecondWeek * 1.1) {
          const increase = Math.round(((avgFirstWeek - avgSecondWeek) / avgSecondWeek) * 100);
          recommendations.push({
            type: 'progress',
            title: 'Відмінний прогрес!',
            message: `Ваша середня тривалість тренувань збільшилася на ${increase}% порівняно з попереднім тижнем. Продовжуйте! 💪`,
            priority: 'normal',
          });
        }
      }
    }

    // Створити рекомендації в БД
    const createdRecommendations = [];
    for (const rec of recommendations) {
      const created = await prisma.recommendation.create({
        data: {
          userId,
          ...rec,
        },
      });
      createdRecommendations.push(created);
    }

    logger.info('Recommendations generated', { count: createdRecommendations.length, userId });
    res.json({ recommendations: createdRecommendations });
  } catch (error: unknown) {
    logger.error('Generate recommendations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Допоміжна функція для розрахунку серії тренувань
async function calculateWorkoutStreak(userId: string): Promise<number> {
  const workouts = await prisma.workout.findMany({
    where: {
      userId,
      status: 'completed',
    },
    orderBy: { date: 'desc' },
    take: 30, // Перевіряємо останні 30 днів
  });

  if (workouts.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    checkDate.setHours(0, 0, 0, 0);

    const hasWorkout = workouts.some(w => {
      const workoutDate = new Date(w.date);
      workoutDate.setHours(0, 0, 0, 0);
      return workoutDate.getTime() === checkDate.getTime();
    });

    if (hasWorkout) {
      streak++;
    } else {
      break; // Серія перервана
    }
  }

  return streak;
}

