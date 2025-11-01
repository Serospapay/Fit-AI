-- Add tips and warnings fields to exercises table
ALTER TABLE "exercises" 
ADD COLUMN IF NOT EXISTS "tips" TEXT,
ADD COLUMN IF NOT EXISTS "tipsUk" TEXT,
ADD COLUMN IF NOT EXISTS "warnings" TEXT,
ADD COLUMN IF NOT EXISTS "warningsUk" TEXT;

