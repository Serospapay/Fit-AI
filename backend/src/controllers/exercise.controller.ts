import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';

export const getAllExercises = async (req: Request, res: Response) => {
  try {
    const {
      type,
      muscleGroup,
      equipment,
      difficulty,
      location,
      search,
      page = '1',
      limit = '20'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (type) where.type = type;
    if (muscleGroup) where.muscleGroup = muscleGroup;
    if (equipment) where.equipment = equipment;
    if (difficulty) where.difficulty = difficulty;
    if (location) where.location = location;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { nameUk: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [exercises, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { name: 'asc' }
      }),
      prisma.exercise.count({ where })
    ]);

    res.json({
      exercises,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    logger.error('Get exercises error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getExerciseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const exercise = await prisma.exercise.findUnique({
      where: { id }
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error: any) {
    logger.error('Get exercise error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createExercise = async (req: Request, res: Response) => {
  try {
    const exerciseData = req.body;

    const exercise = await prisma.exercise.create({
      data: exerciseData
    });

    res.status(201).json(exercise);
  } catch (error: any) {
    logger.error('Create exercise error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exerciseData = req.body;

    const exercise = await prisma.exercise.update({
      where: { id },
      data: exerciseData
    });

    res.json(exercise);
  } catch (error: any) {
    logger.error('Update exercise error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.exercise.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error: any) {
    logger.error('Delete exercise error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFilterOptions = async (req: Request, res: Response) => {
  try {
    const [types, muscleGroups, equipments, difficulties, locations] = await Promise.all([
      prisma.exercise.findMany({ select: { type: true }, distinct: ['type'] }),
      prisma.exercise.findMany({ select: { muscleGroup: true }, distinct: ['muscleGroup'] }),
      prisma.exercise.findMany({ select: { equipment: true }, distinct: ['equipment'] }),
      prisma.exercise.findMany({ select: { difficulty: true }, distinct: ['difficulty'] }),
      prisma.exercise.findMany({ select: { location: true }, distinct: ['location'] })
    ]);

    res.json({
      types: types.map(t => t.type).filter(Boolean),
      muscleGroups: muscleGroups.map(m => m.muscleGroup).filter(Boolean),
      equipments: equipments.map(e => e.equipment).filter(Boolean),
      difficulties: difficulties.map(d => d.difficulty).filter(Boolean),
      locations: locations.map(l => l.location).filter(Boolean)
    });
  } catch (error: any) {
    logger.error('Get filter options error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

