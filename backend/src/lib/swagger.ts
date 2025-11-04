/**
 * @file: swagger.ts
 * @description: Swagger/OpenAPI конфігурація та документація
 * @dependencies: swagger-jsdoc, swagger-ui-express
 * @created: 2024-11-04
 */

import swaggerJsdoc, { Options as SwaggerOptions } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Кишеньковий тренер API',
      version: '1.0.0',
      description: 'REST API для фітнес-додатку "Кишеньковий тренер"',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Аутентифікація та профіль користувача' },
      { name: 'Exercises', description: 'Управління вправами' },
      { name: 'Workouts', description: 'Щоденник тренувань' },
      { name: 'Nutrition', description: 'Щоденник харчування' },
      { name: 'Foods', description: 'База продуктів' }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Кишеньковий тренер API Documentation'
  }));
};

export default swaggerSpec;


