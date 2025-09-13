import { createClient } from '@/utils/supabase/client'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import type { 
  User, 
  Client, 
  Project, 
  ClientDocument, 
  Timeline, 
  TimelinePhase, 
  TimelineTask,
  Message,
  Analytics 
} from './types'

// Client-side helpers
export const supabaseHelpers = {
  // User operations
  async getUser(): Promise<User | null> {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    
    const { data, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) return null
    return data
  },

  async updateUser(updates: Partial<User>): Promise<User | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async createUserProfile(profile: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .insert([{ ...profile, id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Client operations
  async getClients(): Promise<Client[]> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createClient(client: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('clients')
      .insert([{ ...client, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteClient(id: string): Promise<void> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },

  // Project operations
  async getProjects(): Promise<Project[]> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createProject(project: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...project, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteProject(id: string): Promise<void> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },

  // Timeline operations
  async getTimelines(): Promise<Timeline[]> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('timelines')
      .select(`
        *,
        phases:timeline_phases(
          *,
          tasks:timeline_tasks(*)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createTimeline(projectId: string, phases: Omit<TimelinePhase, 'id' | 'timeline_id' | 'created_at' | 'updated_at'>[]): Promise<Timeline> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Verify user owns the project
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!project) throw new Error('Project not found or access denied')
    
    // Create timeline
    const { data: timeline, error: timelineError } = await supabase
      .from('timelines')
      .insert([{ project_id: projectId }])
      .select()
      .single()

    if (timelineError) throw timelineError

    // Create phases
    const phasesWithTimelineId = phases.map((phase, index) => ({
      ...phase,
      timeline_id: timeline.id,
      order_index: index + 1
    }))

    const { data: createdPhases, error: phasesError } = await supabase
      .from('timeline_phases')
      .insert(phasesWithTimelineId)
      .select()

    if (phasesError) throw phasesError

    return { ...timeline, phases: createdPhases }
  },

  async updateTimelineTask(taskId: string, updates: Partial<TimelineTask>): Promise<TimelineTask> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('timeline_tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Document operations
  async getDocuments(): Promise<ClientDocument[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('uploaded_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createDocument(document: Omit<ClientDocument, 'id' | 'user_id' | 'uploaded_at'>): Promise<ClientDocument> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('documents')
      .insert([{ ...document, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Analytics operations
  async getAnalytics(): Promise<Analytics[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createAnalytics(analytics: Omit<Analytics, 'id' | 'user_id' | 'created_at'>): Promise<Analytics> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('analytics')
      .insert([{ ...analytics, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Logout helper
  async logout(): Promise<void> {
    const supabase = createClient()
    
    try {
      // Clear localStorage
      const keysToRemove = [
        'userProfile', 'profileData', 'clients', 'projects', 
        'timelines', 'documents', 'loginState'
      ]
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Redirect to login
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
      // Even if there's an error, redirect to login
      window.location.href = "/login"
    }
  }
}

// Server-side helpers
export const serverSupabaseHelpers = {
  async getUser(cookieStore: ReturnType<typeof cookies>): Promise<User | null> {
    const supabase = createServerClient(cookieStore)
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    
    const { data, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) return null
    return data
  },

  async getClients(cookieStore: ReturnType<typeof cookies>): Promise<Client[]> {
    const supabase = createServerClient(cookieStore)
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return []
    return data || []
  },

  async getClientByCompany(company: string, cookieStore: ReturnType<typeof cookies>): Promise<Client | null> {
    const supabase = createServerClient(cookieStore)
    const companySlug = company.toLowerCase().replace(/\s+/g, '-')
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .ilike('company', `%${companySlug.replace('-', ' ')}%`)
      .single()

    if (error) return null
    return data
  },

  async getProjectsForClient(clientId: string, cookieStore: ReturnType<typeof cookies>): Promise<Project[]> {
    const supabase = createServerClient(cookieStore)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) return []
    return data || []
  },

  async getTimelinesForProjects(projectIds: string[], cookieStore: ReturnType<typeof cookies>): Promise<Timeline[]> {
    const supabase = createServerClient(cookieStore)
    const { data, error } = await supabase
      .from('timelines')
      .select(`
        *,
        phases:timeline_phases(
          *,
          tasks:timeline_tasks(*)
        )
      `)
      .in('project_id', projectIds)

    if (error) return []
    return data || []
  }
}
