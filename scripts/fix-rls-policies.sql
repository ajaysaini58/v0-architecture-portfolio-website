-- ============================================================================
-- DByARCH — FIX RLS POLICIES
-- Run this in Supabase SQL Editor to fix Row Level Security policies.
-- These updates allow proper data flow between the app and Supabase.
-- ============================================================================

-- ============================================================================
-- FIX: user_profiles — Allow public read for profile display
-- ============================================================================

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;

-- Allow anyone to read user profiles (needed for architect pages, profile display)
CREATE POLICY "Anyone can read user profiles"
  ON user_profiles FOR SELECT USING (true);

-- Allow users to insert their own profile on signup
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- FIX: architects — Allow authenticated users to create architect profile
-- ============================================================================

-- Allow anyone to view architects (already exists but re-create for safety)
DROP POLICY IF EXISTS "Anyone can view architects" ON architects;
CREATE POLICY "Anyone can view architects"
  ON architects FOR SELECT USING (true);

-- Allow authenticated users to insert architect profile (signup)
DROP POLICY IF EXISTS "Architects can insert own profile" ON architects;
CREATE POLICY "Architects can insert own profile"
  ON architects FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow architects to update own profile
DROP POLICY IF EXISTS "Architects can update own profile" ON architects;
CREATE POLICY "Architects can update own profile"
  ON architects FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- FIX: portfolio_projects — Allow architects to manage their own projects
-- ============================================================================

-- Keep public read
DROP POLICY IF EXISTS "Anyone can view portfolio projects" ON portfolio_projects;
CREATE POLICY "Anyone can view portfolio projects"
  ON portfolio_projects FOR SELECT USING (true);

-- Allow architects to insert portfolio projects
DROP POLICY IF EXISTS "Architects can add portfolio projects" ON portfolio_projects;
CREATE POLICY "Architects can add portfolio projects"
  ON portfolio_projects FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM architects WHERE id = architect_id)
  );

-- Allow architects to update their own projects
DROP POLICY IF EXISTS "Architects can update own projects" ON portfolio_projects;
CREATE POLICY "Architects can update own projects"
  ON portfolio_projects FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM architects WHERE id = architect_id)
  );

-- Allow architects to delete their own projects
DROP POLICY IF EXISTS "Architects can delete own projects" ON portfolio_projects;
CREATE POLICY "Architects can delete own projects"
  ON portfolio_projects FOR DELETE USING (
    auth.uid() = (SELECT user_id FROM architects WHERE id = architect_id)
  );

-- ============================================================================
-- FIX: vacancies — Also allow viewing all vacancies (not just approved) for owners
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view approved vacancies" ON vacancies;
CREATE POLICY "Anyone can view approved vacancies or own"
  ON vacancies FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);

-- ============================================================================
-- STORAGE: Create buckets for image uploads
-- Note: Run these in Supabase Dashboard > Storage, or via SQL:
-- ============================================================================

-- Create storage buckets (if not exists)
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE USING (
    bucket_id = 'avatars' AND auth.uid() IS NOT NULL
  );

-- Storage policies for portfolio images
DROP POLICY IF EXISTS "Anyone can view portfolio images" ON storage.objects;
CREATE POLICY "Anyone can view portfolio images"
  ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "Users can upload portfolio images" ON storage.objects;
CREATE POLICY "Users can upload portfolio images"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Users can update portfolio images" ON storage.objects;
CREATE POLICY "Users can update portfolio images"
  ON storage.objects FOR UPDATE USING (
    bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL
  );
