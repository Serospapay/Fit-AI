import { AuthRequest } from '../types';
import { Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';
import { handleControllerError } from '../utils/apiResponse';

export const createWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { date, time, type, duration, notes, rating, exercises } = req.body;

    // Combine date and time into a single DateTime
    let workoutDate = new Date();
    if (date) {
      if (time) {
        // Combine date and time
        const [hours, minutes] = time.split(':');
        workoutDate = new Date(date);
        workoutDate.setHours(parseInt(hours) || 0, parseInt(minutes) || 0, 0, 0);
      } else {
        workoutDate = new Date(date);
      }
    }

    const workout = await prisma.workout.create({
      data: {
        userId,
        date: workoutDate,
        type: type || null,
        duration: duration || null,
        notes: notes || null,
        rating: rating || null,
        exercises: {
          create: exercises?.map((ex: any, index: number) => ({
            exerciseId: ex.exerciseId,
            customName: ex.customName || null,
            sets: ex.sets || null,
            reps: ex.reps || null,
            weight: ex.weight || null,
            duration: ex.duration || null,
            distance: ex.distance || null,
            rest: ex.rest || null,
            order: ex.order || index,
            notes: ex.notes || null
          })) || []
        }
      },
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });

    logger.info('Workout created successfully', { workoutId: workout.id });
    res.status(201).json(workout);
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'WorkoutController',
      operation: 'createWorkout',
      errorTitle: 'Помилка створення тренування',
      userMessage: 'Не вдалося створити тренування.',
    });
  }
};

export const getUserWorkouts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate, limit = '20', offset = '0' } = req.query;

    const where: any = { userId };
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const [workouts, total] = await Promise.all([
      prisma.workout.findMany({
        where,
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        orderBy: { date: 'desc' },
        include: {
          exercises: {
            include: {
              exercise: true
            },
            orderBy: { order: 'asc' }
          }
        }
      }),
      prisma.workout.count({ where })
    ]);

    res.json({ workouts, total });
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'WorkoutController',
      operation: 'getUserWorkouts',
      errorTitle: 'Помилка отримання тренувань',
      userMessage: 'Не вдалося завантажити список тренувань.',
      details: { query: req.query },
    });
  }
};

export const getWorkoutById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const workout = await prisma.workout.findFirst({
      where: {
        id,
        userId
      },
      include: {
        exercises: {
          include: {
            exercise: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json(workout);
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'WorkoutController',
      operation: 'getWorkoutById',
      errorTitle: 'Помилка отримання тренування',
      userMessage: 'Не вдалося завантажити тренування.',
      details: { params: req.params },
    });
  }
};

export const updateWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { date, duration, notes, rating, exercises } = req.body;

    const workout = await prisma.workout.findFirst({
      where: { id, userId }
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Update workout basic fields
    const updatedWorkout = await prisma.workout.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        duration,
        notes,
        rating
      },
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });

    // Update exercises if provided
    if (exercises) {
      // Delete old exercises
      await prisma.workoutExercise.deleteMany({
        where: { workoutId: id }
      });

      // Create new exercises
      if (exercises.length > 0) {
        await prisma.workoutExercise.createMany({
          data: exercises.map((ex: any, index: number) => ({
            workoutId: id,
            exerciseId: ex.exerciseId,
            sets: ex.sets || null,
            reps: ex.reps || null,
            weight: ex.weight || null,
            duration: ex.duration || null,
            distance: ex.distance || null,
            rest: ex.rest || null,
            order: ex.order || index,
            notes: ex.notes || null
          }))
        });
      }

      // Fetch updated workout
      const finalWorkout = await prisma.workout.findUnique({
        where: { id },
        include: {
          exercises: {
            include: {
              exercise: true
            },
            orderBy: { order: 'asc' }
          }
        }
      });

      return res.json(finalWorkout);
    }

    res.json(updatedWorkout);
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'WorkoutController',
      operation: 'updateWorkout',
      errorTitle: 'Помилка оновлення тренування',
      userMessage: 'Не вдалося оновити тренування.',
      details: { params: req.params },
    });
  }
};

export const deleteWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const workout = await prisma.workout.findFirst({
      where: { id, userId }
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    await prisma.workout.delete({
      where: { id }
    });

    logger.info('Workout deleted successfully', { workoutId: id });
    res.status(204).send();
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'WorkoutController',
      operation: 'deleteWorkout',
      errorTitle: 'Помилка видалення тренування',
      userMessage: 'Не вдалося видалити тренування.',
      details: { params: req.params },
    });
  }
};

export const getWorkoutStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { days = '30' } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days as string));

    // Get overall stats for the period
    const stats = await prisma.workout.aggregate({
      where: {
        userId,
        date: { gte: startDate }
      },
      _count: { id: true },
      _avg: { duration: true, rating: true }
    });

    // Get weekly stats
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekStats = await prisma.workout.aggregate({
      where: {
        userId,
        date: { gte: weekStart }
      },
      _count: { id: true },
      _avg: { duration: true }
    });

    // Get previous week stats for comparison
    const prevWeekStart = new Date();
    prevWeekStart.setDate(prevWeekStart.getDate() - 14);
    const prevWeekEnd = new Date();
    prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);
    const prevWeekStats = await prisma.workout.aggregate({
      where: {
        userId,
        date: { gte: prevWeekStart, lt: weekStart }
      },
      _count: { id: true },
      _avg: { duration: true }
    });

    // Get monthly stats
    const monthStart = new Date();
    monthStart.setDate(monthStart.getDate() - 30);
    const monthStats = await prisma.workout.aggregate({
      where: {
        userId,
        date: { gte: monthStart }
      },
      _count: { id: true },
      _avg: { duration: true }
    });

    // Get previous month stats for comparison
    const prevMonthStart = new Date();
    prevMonthStart.setDate(prevMonthStart.getDate() - 60);
    const prevMonthEnd = new Date();
    prevMonthEnd.setDate(prevMonthEnd.getDate() - 30);
    const prevMonthStats = await prisma.workout.aggregate({
      where: {
        userId,
        date: { gte: prevMonthStart, lt: monthStart }
      },
      _count: { id: true },
      _avg: { duration: true }
    });

    // Get workouts by day of week for trend
    const recentWorkouts = await prisma.workout.findMany({
      where: {
        userId,
        date: { gte: startDate }
      },
      select: { date: true, duration: true, rating: true }
    });

    // Calculate weekly progress (days with workouts)
    const workoutsPerWeek: { [key: string]: number } = {};
    recentWorkouts.forEach(workout => {
      const weekKey = getWeekKey(workout.date);
      workoutsPerWeek[weekKey] = (workoutsPerWeek[weekKey] || 0) + 1;
    });

    // Get most exercised exercises
    const muscleGroups = await prisma.workoutExercise.groupBy({
      by: ['exerciseId'],
      where: {
        workout: {
          userId,
          date: { gte: startDate }
        }
      },
      _count: true
    });

    const exerciseIds = muscleGroups.map(mg => mg.exerciseId);
    const exercises = await prisma.exercise.findMany({
      where: { id: { in: exerciseIds } }
    });

    const muscleGroupStats = muscleGroups.map(mg => {
      const exercise = exercises.find(e => e.id === mg.exerciseId);
      return {
        exerciseId: mg.exerciseId,
        exerciseName: exercise?.name,
        count: mg._count
      };
    }).sort((a, b) => b.count - a.count).slice(0, 5);

    // Exercise type stats removed since type field doesn't exist anymore

    // Calculate streak (consecutive days with workouts)
    const sortedDates = recentWorkouts.map(w => w.date.toISOString().split('T')[0]).sort().reverse();
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const dateKey = currentDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateKey)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate achievements
    const achievements = await calculateAchievements(userId, stats._count.id, streak, recentWorkouts.length);

    // Prepare weekly progress data for chart
    const weeklyChartData = prepareWeeklyChartData(workoutsPerWeek);

    res.json({
      totalWorkouts: stats._count.id,
      avgDuration: stats._avg.duration || 0,
      avgRating: stats._avg.rating || 0,
      mostExercised: muscleGroupStats,
      
      // Weekly stats
      weekWorkouts: weekStats._count.id,
      weekAvgDuration: weekStats._avg.duration || 0,
      
      // Previous week comparison
      prevWeekWorkouts: prevWeekStats._count.id,
      prevWeekAvgDuration: prevWeekStats._avg.duration || 0,
      
      // Monthly stats
      monthWorkouts: monthStats._count.id,
      monthAvgDuration: monthStats._avg.duration || 0,
      
      // Previous month comparison
      prevMonthWorkouts: prevMonthStats._count.id,
      prevMonthAvgDuration: prevMonthStats._avg.duration || 0,
      
      // Trends and analysis
      workoutStreak: streak,
      workoutsPerWeek,
      exerciseTypeStats: {},
      
      // Recent activity
      recentWorkouts: recentWorkouts.slice(0, 7).map(w => ({
        date: w.date,
        duration: w.duration,
        rating: w.rating
      })),
      
      // Achievements
      achievements,
      
      // Chart data
      weeklyChartData
    });
  } catch (error: unknown) {
    return handleControllerError(res, error, {
      controller: 'WorkoutController',
      operation: 'getWorkoutStats',
      errorTitle: 'Помилка отримання статистики тренувань',
      userMessage: 'Не вдалося завантажити статистику тренувань.',
      details: { query: req.query },
    });
  }
};

// Helper function to get week key
function getWeekKey(date: Date): string {
  const d = new Date(date);
  const weekStart = new Date(d);
  weekStart.setDate(d.getDate() - d.getDay());
  return weekStart.toISOString().split('T')[0];
}

// Calculate user achievements
async function calculateAchievements(userId: string, totalWorkouts: number, streak: number, recentCount: number): Promise<any[]> {
  const allAchievements = [
    {
      id: 'first_workout',
      name: 'First Steps',
      nameUk: 'Перші кроки',
      description: 'Complete your first workout',
      descriptionUk: 'Виконайте своє перше тренування',
      icon: 'bi bi-bullseye',
      condition: () => totalWorkouts >= 1
    },
    {
      id: 'week_warrior',
      name: 'Week Warrior',
      nameUk: 'Війна тижня',
      description: 'Workout 7 days in a row',
      descriptionUk: 'Тренуватися 7 днів підряд',
      icon: 'bi bi-fire',
      condition: () => streak >= 7
    },
    {
      id: 'month_warrior',
      name: 'Month Warrior',
      nameUk: 'Війна місяця',
      description: 'Workout 30 days in a row',
      descriptionUk: 'Тренуватися 30 днів підряд',
      icon: 'bi bi-lightning',
      condition: () => streak >= 30
    },
    {
      id: 'century',
      name: 'Century Club',
      nameUk: 'Клуб сотні',
      description: 'Complete 100 workouts',
      descriptionUk: 'Виконайте 100 тренувань',
      icon: 'bi bi-trophy',
      condition: () => totalWorkouts >= 100
    },
    {
      id: 'hundred_days',
      name: 'Hundred Days',
      nameUk: 'Сто днів',
      description: 'Complete 100 workouts total',
      descriptionUk: 'Виконайте 100 тренувань загалом',
      icon: 'bi bi-star-fill',
      condition: () => totalWorkouts >= 100
    },
    {
      id: 'dedication',
      name: 'Dedication',
      nameUk: 'Відданість',
      description: '30 workouts in 30 days',
      descriptionUk: '30 тренувань за 30 днів',
      icon: 'bi bi-star',
      condition: () => recentCount >= 30
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      nameUk: 'Майстер серій',
      description: 'Maintain a 14-day streak',
      descriptionUk: 'Зберігайте серію 14 днів',
      icon: 'bi bi-award',
      condition: () => streak >= 14
    },
    {
      id: 'beginner',
      name: 'Getting Started',
      nameUk: 'Початок',
      description: 'Complete 5 workouts',
      descriptionUk: 'Виконайте 5 тренувань',
      icon: 'bi bi-star',
      condition: () => totalWorkouts >= 5
    }
  ];

  return allAchievements.map(achievement => ({
    ...achievement,
    unlocked: achievement.condition()
  }));
}

// Prepare weekly chart data
function prepareWeeklyChartData(workoutsPerWeek: { [key: string]: number }): any[] {
  const weeks = Object.keys(workoutsPerWeek)
    .sort()
    .slice(-8); // Last 8 weeks

  return weeks.map(week => {
    const date = new Date(week);
    return {
      week: `${date.getDate()}/${date.getMonth() + 1}`,
      workouts: workoutsPerWeek[week]
    };
  });
}

