import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';
import { prisma } from '../lib/prisma';

export const createWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { date, duration, notes, rating, exercises } = req.body;

    const workout = await prisma.workout.create({
      data: {
        userId,
        date: date ? new Date(date) : new Date(),
        duration: duration || null,
        notes: notes || null,
        rating: rating || null,
        exercises: {
          create: exercises?.map((ex: any, index: number) => ({
            exerciseId: ex.exerciseId,
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

    res.status(201).json(workout);
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    res.status(204).send();
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
        exerciseNameUk: exercise?.nameUk,
        count: mg._count
      };
    }).sort((a, b) => b.count - a.count).slice(0, 5);

    // Get recent workouts count by type
    const exerciseTypes = await prisma.workoutExercise.findMany({
      where: {
        workout: {
          userId,
          date: { gte: startDate }
        }
      },
      include: {
        exercise: {
          select: { type: true }
        }
      }
    });

    const typeStats = exerciseTypes.reduce((acc: any, we) => {
      const type = we.exercise.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

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

    res.json({
      totalWorkouts: stats._count.id,
      avgDuration: stats._avg.duration || 0,
      avgRating: stats._avg.rating || 0,
      mostExercised: muscleGroupStats,
      
      // Weekly stats
      weekWorkouts: weekStats._count.id,
      weekAvgDuration: weekStats._avg.duration || 0,
      
      // Monthly stats
      monthWorkouts: monthStats._count.id,
      monthAvgDuration: monthStats._avg.duration || 0,
      
      // Trends and analysis
      workoutStreak: streak,
      workoutsPerWeek,
      exerciseTypeStats: typeStats,
      
      // Recent activity
      recentWorkouts: recentWorkouts.slice(0, 7).map(w => ({
        date: w.date,
        duration: w.duration,
        rating: w.rating
      }))
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to get week key
function getWeekKey(date: Date): string {
  const d = new Date(date);
  const weekStart = new Date(d);
  weekStart.setDate(d.getDate() - d.getDay());
  return weekStart.toISOString().split('T')[0];
}

