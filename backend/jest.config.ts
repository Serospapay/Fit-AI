/**
 * @file: jest.config.ts
 * @description: Конфігурація Jest для тестування backend-додатку
 * @dependencies: ts-jest, jest
 * @created: 2025-11-07
 */
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/controllers/**/*.ts',
    'src/utils/**/*.ts',
    'src/validation/**/*.ts',
    '!src/index.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  resetMocks: true,
  clearMocks: true,
  restoreMocks: true,
};

export default config;


