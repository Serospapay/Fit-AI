import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DEFAULT_USER_ID } from '../src/lib/config';

const prisma = new PrismaClient();

const TEST_EMAIL = 'demo@example.com';
const TEST_PASSWORD = 'demo123';

async function main() {
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

  // Шукаємо demo@example.com або старого тестового user@fitness.local
  let existing = await prisma.user.findFirst({
    where: { OR: [{ email: TEST_EMAIL }, { email: 'user@fitness.local' }] },
  });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { email: TEST_EMAIL, passwordHash: hashedPassword, name: 'Тестовий користувач' },
    });
    console.log(`Тестовий користувач оновлено: ${TEST_EMAIL} / ${TEST_PASSWORD}`);
  } else {
    await prisma.user.create({
      data: {
        id: DEFAULT_USER_ID,
        email: TEST_EMAIL,
        passwordHash: hashedPassword,
        name: 'Тестовий користувач',
      },
    });
    console.log(`Тестовий користувач створено: ${TEST_EMAIL} / ${TEST_PASSWORD}`);
  }
}

main()
  .catch((e) => {
    console.error('Помилка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
