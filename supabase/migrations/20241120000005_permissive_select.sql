-- Make SELECT policy permissive to avoid RLS errors during update (soft delete)
-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;

-- Create a new permissive SELECT policy
CREATE POLICY "Comments are viewable by everyone" 
  ON public.comments FOR SELECT 
  USING (true);

-- Ensure other policies are still correct (re-applying just in case)
DROP POLICY IF EXISTS "Anyone can update comments" ON public.comments;
CREATE POLICY "Anyone can update comments" 
  ON public.comments FOR UPDATE 
  USING (true)
  WITH CHECK (true);
