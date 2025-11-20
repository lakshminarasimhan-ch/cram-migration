-- Reset RLS policies for comments table to fix permission issues
-- Drop all existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can update comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can delete comments" ON public.comments;

-- Enable RLS (just in case)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create new, permissive policies
-- Allow everyone to view non-deleted comments
CREATE POLICY "Comments are viewable by everyone" 
  ON public.comments FOR SELECT 
  USING (is_deleted = false);

-- Allow everyone to insert comments
CREATE POLICY "Anyone can insert comments" 
  ON public.comments FOR INSERT 
  WITH CHECK (true);

-- Allow everyone to update comments (needed for soft delete and edits)
CREATE POLICY "Anyone can update comments" 
  ON public.comments FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Allow everyone to delete comments (if we ever use hard delete)
CREATE POLICY "Anyone can delete comments" 
  ON public.comments FOR DELETE 
  USING (true);

-- Grant permissions to anon and authenticated roles
GRANT ALL ON public.comments TO anon;
GRANT ALL ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
