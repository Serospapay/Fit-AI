import prisma from './prisma';
import logger from './logger';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface RetryOptions {
  maxRetries?: number;
  delay?: number;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = MAX_RETRIES, delay = RETRY_DELAY } = options;
  
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a connection error
      const isConnectionError = 
        error.code === 'P1001' || // Can't reach database server
        error.code === 'P1003' || // Database does not exist
        error.code === 'P1017';   // Server has closed the connection

      if (!isConnectionError || attempt === maxRetries) {
        logger.error(`Operation failed: ${operationName}`, {
          attempt,
          error: error.message,
        });
        throw error;
      }

      logger.warn(`Retry ${attempt}/${maxRetries} for: ${operationName}`, {
        error: error.message,
      });

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
      
      // Try to reconnect to database
      try {
        await prisma.$connect();
        logger.info('✅ Database reconnected successfully');
      } catch (reconnectError) {
        logger.error('❌ Database reconnection failed:', reconnectError);
      }
    }
  }

  throw lastError;
}

