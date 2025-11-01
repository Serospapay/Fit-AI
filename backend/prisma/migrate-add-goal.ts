import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Adding goal field to exercises table...');
  const sql = fs.readFileSync(path.join(__dirname, 'add-goal-field.sql'), 'utf-8');
  await prisma.$executeRawUnsafe(sql);
  console.log('✅ Successfully added goal field');
}

main()
  .catch((e) => {
    console.error('❌ Error applying migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

