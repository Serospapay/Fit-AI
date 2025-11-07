/**
 * @file: tests/setup.ts
 * @description: Глобальна конфігурація для Jest-тестів backend-додатку
 * @dependencies: jest
 * @created: 2025-11-07
 */

process.env.NODE_ENV = 'test';
process.env.SKIP_DB_CONNECT = '1';
process.env.CORS_ORIGIN = 'http://localhost:3000';

jest.setTimeout(15000);

jest.mock('../src/lib/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

jest.mock('../src/middleware/auth', () => ({
  authenticateToken: (req: any, _res: any, next: () => void) => {
    req.userId = 'test-user';
    next();
  },
}));

const prismaMockFactory = {
  goal: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  workout: {
    findMany: jest.fn(),
  },
  nutritionLog: {
    findMany: jest.fn(),
  },
};

type PrismaMock = typeof prismaMockFactory;

const prismaMock = prismaMockFactory as PrismaMock;

jest.mock('../src/lib/prisma', () => ({
  __esModule: true,
  prisma: prismaMock,
  default: prismaMock,
}));

declare global {
  // eslint-disable-next-line no-var
  var prismaMock: PrismaMock;
}

globalThis.prismaMock = prismaMock;

export {};

