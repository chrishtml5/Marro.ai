-- CRITICAL SECURITY FIX: Proper Row Level Security
-- Run this to fix the data isolation issue

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

DROP POLICY IF EXISTS "Users can view own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can insert own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON public.clients;

DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;

DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON public.documents;

DROP POLICY IF EXISTS "Users can view own timelines" ON public.timelines;
DROP POLICY IF EXISTS "Users can insert own timelines" ON public.timelines;
DROP POLICY IF EXISTS "Users can update own timelines" ON public.timelines;
DROP POLICY IF EXISTS "Users can delete own timelines" ON public.timelines;

DROP POLICY IF EXISTS "Users can view own timeline phases" ON public.timeline_phases;
DROP POLICY IF EXISTS "Users can insert own timeline phases" ON public.timeline_phases;
DROP POLICY IF EXISTS "Users can update own timeline phases" ON public.timeline_phases;
DROP POLICY IF EXISTS "Users can delete own timeline phases" ON public.timeline_phases;

DROP POLICY IF EXISTS "Users can view own timeline tasks" ON public.timeline_tasks;
DROP POLICY IF EXISTS "Users can insert own timeline tasks" ON public.timeline_tasks;
DROP POLICY IF EXISTS "Users can update own timeline tasks" ON public.timeline_tasks;
DROP POLICY IF EXISTS "Users can delete own timeline tasks" ON public.timeline_tasks;

DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON public.messages;

DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics;
DROP POLICY IF EXISTS "Users can insert own analytics" ON public.analytics;
DROP POLICY IF EXISTS "Users can update own analytics" ON public.analytics;
DROP POLICY IF EXISTS "Users can delete own analytics" ON public.analytics;

-- Ensure RLS is enabled on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- FIXED Users policies
CREATE POLICY "Enable users to view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable users to update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable users to insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- FIXED Clients policies - CRITICAL: Must check user_id
CREATE POLICY "Enable users to view own clients only" ON public.clients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable users to insert own clients only" ON public.clients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable users to update own clients only" ON public.clients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable users to delete own clients only" ON public.clients
    FOR DELETE USING (auth.uid() = user_id);

-- FIXED Projects policies - CRITICAL: Must check user_id
CREATE POLICY "Enable users to view own projects only" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable users to insert own projects only" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable users to update own projects only" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable users to delete own projects only" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);

-- FIXED Documents policies - CRITICAL: Must check user_id
CREATE POLICY "Enable users to view own documents only" ON public.documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable users to insert own documents only" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable users to update own documents only" ON public.documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable users to delete own documents only" ON public.documents
    FOR DELETE USING (auth.uid() = user_id);

-- FIXED Timelines policies - Must check through project ownership
CREATE POLICY "Enable users to view own timelines only" ON public.timelines
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = timelines.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable users to insert own timelines only" ON public.timelines
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable users to update own timelines only" ON public.timelines
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = timelines.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable users to delete own timelines only" ON public.timelines
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = timelines.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- FIXED Timeline phases policies
CREATE POLICY "Enable users to view own timeline phases only" ON public.timeline_phases
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.timelines t
            JOIN public.projects p ON t.project_id = p.id
            WHERE t.id = timeline_phases.timeline_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable users to insert own timeline phases only" ON public.timeline_phases
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.timelines t
            JOIN public.projects p ON t.project_id = p.id
            WHERE t.id = timeline_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable users to update own timeline phases only" ON public.timeline_phases
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.timelines t
            JOIN public.projects p ON t.project_id = p.id
            WHERE t.id = timeline_phases.timeline_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable users to delete own timeline phases only" ON public.timeline_phases
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.timelines t
            JOIN public.projects p ON t.project_id = p.id
            WHERE t.id = timeline_phases.timeline_id 
            AND p.user_id = auth.uid()
        )
    );

-- FIXED Timeline tasks policies
CREATE POLICY "Enable users to view own timeline tasks only" ON public.timeline_tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.timeline_phases tp
            JOIN public.timelines t ON tp.timeline_id = t.id
            JOIN public.projects p ON t.project_id = p.id
            WHERE tp.id = timeline_tasks.phase_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable users to insert own timeline tasks only" ON public.timeline_tasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.timeline_phases tp
            JOIN public.timelines t ON tp.timeline_id = t.id
            JOIN public.projects p ON t.project_id = p.id
            WHERE tp.id = phase_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable users to update own timeline tasks only" ON public.timeline_tasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.timeline_phases tp
            JOIN public.timelines t ON tp.timeline_id = t.id
            JOIN public.projects p ON t.project_id = p.id
            WHERE tp.id = timeline_tasks.phase_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable users to delete own timeline tasks only" ON public.timeline_tasks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.timeline_phases tp
            JOIN public.timelines t ON tp.timeline_id = t.id
            JOIN public.projects p ON t.project_id = p.id
            WHERE tp.id = timeline_tasks.phase_id 
            AND p.user_id = auth.uid()
        )
    );

-- FIXED Messages policies - CRITICAL: Must check user_id
CREATE POLICY "Enable users to view own messages only" ON public.messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable users to insert own messages only" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable users to update own messages only" ON public.messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable users to delete own messages only" ON public.messages
    FOR DELETE USING (auth.uid() = user_id);

-- FIXED Analytics policies - CRITICAL: Must check user_id
CREATE POLICY "Enable users to view own analytics only" ON public.analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable users to insert own analytics only" ON public.analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable users to update own analytics only" ON public.analytics
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable users to delete own analytics only" ON public.analytics
    FOR DELETE USING (auth.uid() = user_id);

-- Test the policies work by checking what the current user can see
-- Run this after applying the policies to verify they work:
-- SELECT count(*) as my_clients FROM public.clients;
-- SELECT count(*) as my_projects FROM public.projects;
-- (These should only show YOUR data, not other users' data)
