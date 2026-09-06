-- Migration script: Learning Progress tracking for PostgreSQL / Supabase
-- Run this in your Supabase SQL Editor or psql to initialize the learning progress schema.

CREATE TABLE IF NOT EXISTS learning_progress (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  career_id VARCHAR(255) NOT NULL,
  step_order INT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT uq_user_career_step UNIQUE (user_id, career_id, step_order)
);

CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_career ON learning_progress(career_id);

-- Optional table: User accounts & assessments (if migrating auth off localStorage)
CREATE TABLE IF NOT EXISTS user_profiles (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  academics JSONB NOT NULL DEFAULT '{}'::jsonb,
  interests JSONB NOT NULL DEFAULT '{}'::jsonb,
  aspirations JSONB NOT NULL DEFAULT '{}'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  favorites JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
