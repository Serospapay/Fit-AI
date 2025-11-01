import { prisma } from '../lib/prisma';
import { fetchAllExercisesFromWger, mapWgerToOurSchema } from '../services/wger.service';
import logger from '../lib/logger';

async function syncWgerExercises() {
  try {
    logger.info('🔄 Starting Wger exercise sync...');

    // Fetch all exercises from Wger
    const wgerExercises = await fetchAllExercisesFromWger();
    logger.info(`📊 Fetched ${wgerExercises.length} exercises from Wger`);

    let created = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (let i = 0; i < wgerExercises.length; i++) {
      const wgerEx = wgerExercises[i];
      
      try {
        // Map to our schema
        const mapped = mapWgerToOurSchema(wgerEx);

        // Check if exercise already exists
        const existing = await prisma.exercise.findUnique({
          where: { name: mapped.name }
        });

        if (existing) {
          // Update existing
          await prisma.exercise.update({
            where: { id: existing.id },
            data: {
              ...mapped,
              updatedAt: new Date()
            }
          });
          updated++;
        } else {
          // Create new
          await prisma.exercise.create({ data: mapped });
          created++;
        }

        // Progress logging
        if ((i + 1) % 50 === 0) {
          logger.info(`Progress: ${i + 1}/${wgerExercises.length} processed`);
        }

      } catch (error: any) {
        logger.error(`Error processing exercise ${wgerEx.id}: ${error.message}`);
        errors++;
      }
    }

    logger.info(`✅ Sync complete!`);
    logger.info(`   Created: ${created}`);
    logger.info(`   Updated: ${updated}`);
    logger.info(`   Skipped: ${skipped}`);
    logger.info(`   Errors: ${errors}`);
    logger.info(`   Total: ${created + updated}`);

  } catch (error: any) {
    logger.error('❌ Sync failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run sync
if (require.main === module) {
  syncWgerExercises()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { syncWgerExercises };

