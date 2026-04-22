-- Stricter RLS Policies: Owner-based access control
-- Run these in your Supabase SQL Editor to enforce property ownership rules
-- This ensures:
-- 1. Anyone can READ properties (public listing)
-- 2. Only the property owner can UPDATE/DELETE their own properties
-- 3. Authenticated users can INSERT (and become the owner)

-- Enable RLS on properties table (if not already enabled)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- POLICY: Allow public/anonymous read access (no restrictions)
DROP POLICY IF EXISTS "Allow public read access" ON properties;
CREATE POLICY "Allow public read access"
  ON properties FOR SELECT
  USING (true);

-- POLICY: Allow authenticated users to insert properties
-- They become the owner (user_id is set to their auth.uid())
DROP POLICY IF EXISTS "Allow authenticated insert" ON properties;
CREATE POLICY "Allow authenticated insert"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- POLICY: Allow property owners to update their own properties
-- Only the user who created the property (auth.uid() matches user_id) can update
DROP POLICY IF EXISTS "Allow owner update" ON properties;
CREATE POLICY "Allow owner update"
  ON properties FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- POLICY: Allow property owners to delete their own properties
-- Only the user who created the property (auth.uid() matches user_id) can delete
DROP POLICY IF EXISTS "Allow owner delete" ON properties;
CREATE POLICY "Allow owner delete"
  ON properties FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Optional: If using a service role key from backend, you may also want to allow
-- the service role to bypass RLS for admin operations. The service role automatically
-- bypasses RLS, so no policy needed—it will always have full access.

-- Summary:
-- - SELECT: Public (true), anyone can read any property
-- - INSERT: Authenticated only, user_id must equal auth.uid()
-- - UPDATE: Authenticated only, user_id must equal auth.uid()
-- - DELETE: Authenticated only, user_id must equal auth.uid()
