import app from './app';
import logger from './lib/logger';

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`📬 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    logger.info('✅ HTTP server closed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
