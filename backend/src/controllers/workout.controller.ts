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

    const stats = await prisma.workout.aggregate({
      where: {
        userId,
        date: { gte: startDate }
      },
      _count: { id: true },
      _avg: { duration: true, rating: true }
    });

    // Get most exercised muscle groups
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
    });

    res.json({
      totalWorkouts: stats._count.id,
      avgDuration: stats._avg.duration || 0,
      avgRating: stats._avg.rating || 0,
      mostExercised: muscleGroupStats.slice(0, 5)
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

