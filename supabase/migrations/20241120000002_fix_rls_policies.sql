-- Fix RLS policies for anonymous comments
-- Drop existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

-- Re-create permissive policies for anonymous access
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
