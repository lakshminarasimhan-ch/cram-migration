-- Migration to support anonymous comments
-- Make user_id nullable and add author_name field

-- Add author_name field if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'comments' AND column_name = 'author_name'
  ) THEN
    ALTER TABLE public.comments ADD COLUMN author_name TEXT DEFAULT 'Anonymous';
  END IF;
END $$;

-- Make user_id nullable if it isn't already
DO $$
BEGIN
  ALTER TABLE public.comments ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL; -- Ignore if already nullable
END $$;

-- Update existing comments to have author_name from users table
UPDATE public.comments c
SET author_name = u.name
FROM public.users u
WHERE c.user_id = u.id AND (c.author_name IS NULL OR c.author_name = 'Anonymous');
