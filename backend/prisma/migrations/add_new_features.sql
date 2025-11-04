-- Migration: Add new features tables (goals, reminders, recommendations, workout_templates, quotes)
-- Add status field to workouts table

-- Add status column to workouts if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'workouts' AND column_name = 'status'
  ) THEN
    ALTER TABLE workouts ADD COLUMN status VARCHAR DEFAULT 'completed';
  END IF;
END $$;

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT,
  category TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  "targetValue" DOUBLE PRECISION,
  "currentValue" DOUBLE PRECISION DEFAULT 0,
  unit TEXT,
  "startDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "targetDate" TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT goals_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS goals_userId_status_idx ON goals("userId", status);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  time TEXT NOT NULL,
  "daysOfWeek" TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT reminders_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS reminders_userId_enabled_idx ON reminders("userId", enabled);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT recommendations_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS recommendations_userId_isRead_createdAt_idx ON recommendations("userId", "isRead", "createdAt");

-- Create workout_templates table
CREATE TABLE IF NOT EXISTS workout_templates (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  exercises JSONB NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT workout_templates_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS workout_templates_userId_idx ON workout_templates("userId");

