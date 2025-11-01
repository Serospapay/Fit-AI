import { PrismaClient } from '@prisma/client';
import logger from './logger';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

// Test database connection on startup (only if not in script mode)
if (require.main !== module && !process.env.SKIP_DB_CONNECT) {
  prisma.$connect()
    .then(() => {
      logger.info('✅ Database connected successfully');
    })
    .catch((error) => {
      logger.error('❌ Database connection failed:', error);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    });
}

// Handle graceful disconnection
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  logger.info('📦 Prisma Client disconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  logger.info('📦 Prisma Client disconnected (SIGINT)');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  logger.info('📦 Prisma Client disconnected (SIGTERM)');
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', async (error) => {
  logger.error('❌ Uncaught Exception:', error);
  await prisma.$disconnect();
  process.exit(1);
});

process.on('unhandledRejection', async (reason: any, promise: Promise<any>) => {
  logger.error('❌ Unhandled Rejection:', { reason, promise });
  await prisma.$disconnect();
  process.exit(1);
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
