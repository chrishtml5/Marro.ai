-- Fix RLS policies to allow public read access for client portals
-- Run these commands one by one in Supabase SQL editor

-- First, check existing policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('clients', 'projects', 'documents', 'timelines');

-- Drop all existing policies for clients table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.clients;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.clients;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.clients;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.clients;
DROP POLICY IF EXISTS "Users can only access their own clients" ON public.clients;

-- Drop all existing policies for projects table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.projects;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.projects;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.projects;
DROP POLICY IF EXISTS "Users can only access their own projects" ON public.projects;

-- Create new policies for clients table
CREATE POLICY "clients_auth_full_access" ON public.clients
    FOR ALL 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "clients_anon_read_access" ON public.clients
    FOR SELECT 
    TO anon
    USING (true);

-- Create new policies for projects table
CREATE POLICY "projects_auth_full_access" ON public.projects
    FOR ALL 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_anon_read_access" ON public.projects
    FOR SELECT 
    TO anon
    USING (true);

-- Verify the new policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('clients', 'projects')
ORDER BY tablename, policyname;
