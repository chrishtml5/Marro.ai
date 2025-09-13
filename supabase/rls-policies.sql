-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Clients policies
CREATE POLICY "Users can view own clients" ON public.clients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" ON public.clients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON public.clients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON public.clients
    FOR DELETE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can view own documents" ON public.documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON public.documents
    FOR DELETE USING (auth.uid() = user_id);

-- Timelines policies
CREATE POLICY "Users can view own timelines" ON public.timelines
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = timelines.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own timelines" ON public.timelines
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own timelines" ON public.timelines
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = timelines.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own timelines" ON public.timelines
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = timelines.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Timeline phases policies
CREATE POLICY "Users can view own timeline phases" ON public.timeline_phases
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.timelines t
            JOIN public.projects p ON t.project_id = p.id
            WHERE t.id = timeline_phases.timeline_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own timeline phases" ON public.timeline_phases
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.timelines t
            JOIN public.projects p ON t.project_id = p.id
            WHERE t.id = timeline_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own timeline phases" ON public.timeline_phases
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.timelines t
            JOIN public.projects p ON t.project_id = p.id
            WHERE t.id = timeline_phases.timeline_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own timeline phases" ON public.timeline_phases
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.timelines t
            JOIN public.projects p ON t.project_id = p.id
            WHERE t.id = timeline_phases.timeline_id 
            AND p.user_id = auth.uid()
        )
    );

-- Timeline tasks policies
CREATE POLICY "Users can view own timeline tasks" ON public.timeline_tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.timeline_phases tp
            JOIN public.timelines t ON tp.timeline_id = t.id
            JOIN public.projects p ON t.project_id = p.id
            WHERE tp.id = timeline_tasks.phase_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own timeline tasks" ON public.timeline_tasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.timeline_phases tp
            JOIN public.timelines t ON tp.timeline_id = t.id
            JOIN public.projects p ON t.project_id = p.id
            WHERE tp.id = phase_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own timeline tasks" ON public.timeline_tasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.timeline_phases tp
            JOIN public.timelines t ON tp.timeline_id = t.id
            JOIN public.projects p ON t.project_id = p.id
            WHERE tp.id = timeline_tasks.phase_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own timeline tasks" ON public.timeline_tasks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.timeline_phases tp
            JOIN public.timelines t ON tp.timeline_id = t.id
            JOIN public.projects p ON t.project_id = p.id
            WHERE tp.id = timeline_tasks.phase_id 
            AND p.user_id = auth.uid()
        )
    );

-- Messages policies
CREATE POLICY "Users can view own messages" ON public.messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages" ON public.messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON public.messages
    FOR DELETE USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON public.analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON public.analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics" ON public.analytics
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analytics" ON public.analytics
    FOR DELETE USING (auth.uid() = user_id);
