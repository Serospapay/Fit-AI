/**
 * @file: goals.int.test.ts
 * @description: Інтеграційні тести для цілей користувача
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

describe('Goals API', () => {
  describe('POST /api/goals', () => {
    it('створює нову ціль за валідних даних', async () => {
      const goalResponse = {
        id: 'goal-1',
        userId: 'test-user',
        title: 'Збільшити вагу',
        description: 'Набрати 5 кг м’язів',
        category: 'strength',
        targetValue: 80,
        currentValue: 0,
        unit: 'кг',
        startDate: new Date('2025-01-01'),
        targetDate: new Date('2025-06-01'),
        status: 'active',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      };

      prisma.goal.create.mockResolvedValue(goalResponse);

      const response = await request(app)
        .post('/api/goals')
        .send({
          title: 'Збільшити вагу',
          description: 'Набрати 5 кг м’язів',
          category: 'strength',
          targetValue: 80,
          unit: 'кг',
          targetDate: '2025-06-01',
        })
        .expect(201);

      expect(prisma.goal.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'test-user',
            title: 'Збільшити вагу',
            category: 'strength',
            targetValue: 80,
            unit: 'кг',
            targetDate: expect.any(Date),
            currentValue: 0,
          }),
        })
      );

      expect(response.body).toMatchObject({
        id: 'goal-1',
        title: 'Збільшити вагу',
        category: 'strength',
        targetValue: 80,
      });
    });

    it('повертає 400 при некоректних даних', async () => {
      const response = await request(app)
        .post('/api/goals')
        .send({
          description: 'Без назви',
          category: 'strength',
        })
        .expect(400);

      expect(prisma.goal.create).not.toHaveBeenCalled();
      expect(response.body).toMatchObject({
        success: false,
        error: 'Помилка валідації',
      });
    });
  });

  describe('GET /api/goals', () => {
    it('повертає список цілей за валідного статусу', async () => {
      prisma.goal.findMany.mockResolvedValue([
        {
          id: 'goal-1',
          userId: 'test-user',
          title: 'Підтримувати форму',
          description: null,
          category: 'endurance',
          targetValue: null,
          currentValue: 0,
          unit: null,
          startDate: new Date('2025-01-01'),
          targetDate: null,
          status: 'active',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
        },
      ]);

      const response = await request(app).get('/api/goals?status=active').expect(200);

      expect(prisma.goal.findMany).toHaveBeenCalledWith({
        where: { userId: 'test-user', status: 'active' },
        orderBy: { createdAt: 'desc' },
      });
      expect(response.body.goals).toHaveLength(1);
      expect(response.body.goals[0]).toMatchObject({
        id: 'goal-1',
        status: 'active',
      });
    });

    it('повертає 400 при неправильному статусі', async () => {
      await request(app).get('/api/goals?status=unknown').expect(400);
      expect(prisma.goal.findMany).not.toHaveBeenCalled();
    });
  });
});


