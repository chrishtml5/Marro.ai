// Database types matching Supabase schema
export interface User {
  id: string
  email: string
  name: string
  company?: string
  plan: "free" | "pro" | "agency"
  profile_picture?: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  email: string
  company: string
  status: "active" | "inactive" | "pending"
  profile_picture?: string
  portal_url: string
  created_at: string
  updated_at: string
  // Additional properties for compatibility
  documents?: ClientDocument[]
}

export interface Project {
  id: string
  user_id: string
  client_id: string
  client_name: string
  name: string
  description?: string
  status: "planning" | "in-progress" | "review" | "completed"
  progress: number
  start_date: string
  end_date?: string
  budget?: number
  created_at: string
  updated_at: string
}

export interface ClientDocument {
  id: string
  user_id: string
  client_id?: string
  project_id?: string
  name: string
  size: number
  type: string
  url: string
  is_contract?: boolean
  analyzing?: boolean
  uploaded_at: string
}

export interface Timeline {
  id: string
  project_id: string
  created_at: string
  updated_at: string
  phases?: TimelinePhase[]
}

export interface TimelinePhase {
  id: string
  timeline_id: string
  name: string
  start_date: string
  end_date: string
  status: "pending" | "in-progress" | "completed"
  order_index: number
  created_at: string
  updated_at: string
  tasks?: TimelineTask[]
}

export interface TimelineTask {
  id: string
  phase_id: string
  name: string
  completed: boolean
  due_date: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  user_id: string
  client_id: string
  project_id?: string
  content: string
  type: "update" | "feedback" | "approval" | "question"
  status: "unread" | "read" | "responded"
  attachments?: string[]
  created_at: string
  updated_at: string
}

export interface Analytics {
  id: string
  user_id: string
  metric: string
  value: number
  period: "daily" | "weekly" | "monthly"
  date: string
  created_at: string
}

// Legacy types for backward compatibility (will be removed after migration)
export interface LegacyUser {
  id: string
  email: string
  name: string
  plan: "free" | "pro" | "agency"
  createdAt: Date
  updatedAt: Date
}

export interface LegacyClient {
  id: string
  userId: string
  name: string
  email: string
  company: string
  status: "active" | "inactive" | "pending"
  avatar?: string
  portalUrl: string
  createdAt: Date
  updatedAt: Date
}
