/**
 * Інтеграційні тести для auth API (login, register)
 */
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import app from '../src/app';

type PrismaMock = {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
  };
};

const prisma = (globalThis as unknown as { prismaMock: PrismaMock }).prismaMock;

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('повертає 200 та token при валідних даних', async () => {
      const hashedPassword = await bcrypt.hash('TestPass123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.local',
        passwordHash: hashedPassword,
        name: 'Test',
        createdAt: new Date(),
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.local', password: 'TestPass123' })
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('test@test.local');
    });

    it('повертає 401 при невірному паролі', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPass', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.local',
        passwordHash: hashedPassword,
        name: 'Test',
        createdAt: new Date(),
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.local', password: 'WrongPassword' })
        .expect(401);

      expect(res.body).toHaveProperty('error', 'Invalid email or password');
    });

    it('повертає 401 при неіснуючому email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@test.local', password: 'any' })
        .expect(401);
    });

    it('повертає 400 при відсутніх даних (валідація Zod)', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);
    });
  });
});
