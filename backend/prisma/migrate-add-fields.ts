import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Adding new fields to exercises table...');
  
  try {
    await prisma.$executeRaw`
      ALTER TABLE "exercises" 
      ADD COLUMN IF NOT EXISTS "tips" TEXT,
      ADD COLUMN IF NOT EXISTS "tipsUk" TEXT,
      ADD COLUMN IF NOT EXISTS "warnings" TEXT,
      ADD COLUMN IF NOT EXISTS "warningsUk" TEXT;
    `;
    
    console.log('✅ Successfully added tips, tipsUk, warnings, warningsUk fields');
  } catch (error: any) {
    if (error.code === 'P2010' || error.message?.includes('already exists')) {
      console.log('ℹ️  Fields already exist, skipping...');
    } else {
      throw error;
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

