/**
 * @file: export.int.test.ts
 * @description: Інтеграційні тести для експорту тренувань та харчування
 * @dependencies: supertest, app, prisma mock
 * @created: 2025-11-07
 */
import request from 'supertest';
import app from '../src/app';

type PrismaMock = {
  goal: {
    create: jest.Mock;
    findMany: jest.Mock;
    findFirst: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  workout: {
    findMany: jest.Mock;
  };
  nutritionLog: {
    findMany: jest.Mock;
  };
  quote: {
    findMany: jest.Mock;
  };
};

const prisma = (globalThis as unknown as { prismaMock: PrismaMock }).prismaMock;

describe('Export API', () => {
  beforeEach(() => {
    prisma.workout.findMany.mockResolvedValue([]);
    prisma.nutritionLog.findMany.mockResolvedValue([]);
  });

  it('повертає Excel-файл тренувань', async () => {
    prisma.workout.findMany.mockResolvedValue([
      {
        id: 'workout-1',
        userId: 'test-user',
        date: new Date('2025-01-10T10:00:00Z'),
        type: 'strength',
        duration: 60,
        notes: 'Ноги та спина',
        rating: 5,
        exercises: [
          {
            exercise: { name: 'Присідання' },
            customName: null,
            sets: 4,
            reps: 8,
            weight: 100,
            duration: null,
            distance: null,
            rest: 90,
            order: 0,
            notes: null,
          },
        ],
      },
    ]);

    const response = await request(app).get('/api/export/workouts/excel').expect(200);

    expect(response.headers['content-type']).toBe(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    expect(response.headers['content-disposition']).toContain('attachment; filename=');
    expect(prisma.workout.findMany).toHaveBeenCalledWith({
      where: { userId: 'test-user' },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  });

  it('повертає PDF-файл харчування', async () => {
    prisma.nutritionLog.findMany.mockResolvedValue([
      {
        id: 'log-1',
        userId: 'test-user',
        date: new Date('2025-01-10T08:00:00Z'),
        mealType: 'breakfast',
        createdAt: new Date('2025-01-10T08:00:00Z'),
        updatedAt: new Date('2025-01-10T08:00:00Z'),
        items: [
          {
            id: 'item-1',
            nutritionLogId: 'log-1',
            name: 'Овсянка',
            nameUk: 'Вівсянка',
            amount: 150,
            calories: 250,
            protein: 10,
            carbs: 40,
            fat: 5,
            fiber: 4,
            createdAt: new Date('2025-01-10T08:00:00Z'),
          },
        ],
      },
    ]);

    const response = await request(app).get('/api/export/nutrition/pdf').expect(200);

    expect(response.headers['content-type']).toBe('application/pdf');
    expect(response.headers['content-disposition']).toContain('attachment; filename=');
    expect(prisma.nutritionLog.findMany).toHaveBeenCalledWith({
      where: { userId: 'test-user' },
      include: { items: true },
      orderBy: { date: 'desc' },
    });
  });

  it('застосовує фільтри для тренувань', async () => {
    prisma.workout.findMany.mockResolvedValue([
      {
        id: 'workout-2',
        userId: 'test-user',
        date: new Date('2025-02-01T10:00:00Z'),
        type: 'cardio',
        duration: 45,
        notes: null,
        rating: 4,
        exercises: [],
      },
    ]);

    await request(app)
      .get('/api/export/workouts/excel?type=cardio&status=completed&minRating=3&maxRating=5')
      .expect(200);

    const callArgs = prisma.workout.findMany.mock.calls[0][0];
    expect(callArgs.where).toMatchObject({
      userId: 'test-user',
      type: 'cardio',
      status: 'completed',
      rating: { gte: 3, lte: 5 },
    });
  });

  it('застосовує фільтри для харчування', async () => {
    prisma.nutritionLog.findMany.mockResolvedValue([]);

    await request(app)
      .get('/api/export/nutrition/pdf?mealType=breakfast&minCalories=200&maxProtein=30')
      .expect(200);

    const callArgs = prisma.nutritionLog.findMany.mock.calls[0][0];
    expect(callArgs.where).toMatchObject({
      userId: 'test-user',
      mealType: 'breakfast',
      items: {
        some: expect.objectContaining({
          calories: { gte: 200 },
          protein: { lte: 30 },
        }),
      },
    });
  });
});


