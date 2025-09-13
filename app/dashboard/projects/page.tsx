"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { supabaseHelpers } from "@/lib/supabase-helpers"
import { useProfile } from "@/contexts/ProfileContext"

import Image from "next/image"
import Link from "next/link"
import {
  Bell,
  ChevronUp,
  Home,
  Search,
  Settings,
  User2,
  Users,
  BarChart3,
  FileText,
  Plus,
  LogOut,
  Calendar,
  MessageSquare,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Project {
  id: string
  name: string
  description: string
  clientId: string
  clientName: string
  status: "planning" | "in-progress" | "review" | "completed"
  progress: number
  startDate: string
  budget: number
  createdAt: string
}

interface Client {
  id: string
  name: string
  company: string
  profilePicture?: string
}

interface Timeline {
  id: string
  projectId: string
  phases: TimelinePhase[]
}

interface TimelinePhase {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "pending" | "in-progress" | "completed"
  tasks: TimelineTask[]
}

interface TimelineTask {
  id: string
  name: string
  completed: boolean
  dueDate: string
}

const navMain = [
  { title: "Dashboard", url: "/dashboard", icon: Home, isActive: false },
  { title: "Clients", url: "/dashboard/clients", icon: Users, isActive: false },
  { title: "Projects", url: "/dashboard/projects", icon: FileText, isActive: true },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3, isActive: false },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar, isActive: false },
  { title: "Messages", url: "/dashboard/messages", icon: MessageSquare, isActive: false, badge: "1" },
]

const navSecondary = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Support", url: "/dashboard/support", icon: User2 },
]

export default function ProjectsPage() {
  const { profileData } = useProfile()
  const router = useRouter()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [timelines, setTimelines] = useState<Timeline[]>([])
  const [currentTimeline, setCurrentTimeline] = useState<Timeline | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientId: "",
    status: "planning" as const,
    budget: "",
    startDate: "",
  })

  useEffect(() => {
    // Profile data is now loaded by ProfileContext

    const savedProjects = localStorage.getItem("projects")
    const savedTimelines = localStorage.getItem("timelines")
    
    let projectsData: Project[] = []
    let timelinesData: Timeline[] = []
    
    if (savedProjects) {
      projectsData = JSON.parse(savedProjects)
      setProjects(projectsData)
    }

    if (savedTimelines) {
      timelinesData = JSON.parse(savedTimelines)
      setTimelines(timelinesData)
    }

    // Auto-create timelines for existing projects that don't have them
    if (projectsData.length > 0) {
      const projectsNeedingTimelines = projectsData.filter(project => 
        !timelinesData.some(timeline => timeline.projectId === project.id)
      )
      
      if (projectsNeedingTimelines.length > 0) {
        const newTimelines = projectsNeedingTimelines.map(project => {
          const startDate = new Date(project.startDate || Date.now())
          return {
            id: `timeline-${project.id}`,
            projectId: project.id,
            phases: [
              {
                id: "1",
                name: "Discovery & Planning",
                startDate: startDate.toISOString().split("T")[0],
                endDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                status: project.status === "planning" ? "in-progress" : "completed",
                tasks: [
                  {
                    id: "1",
                    name: "Client requirements gathering",
                    completed: project.status !== "planning",
                    dueDate: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                  },
                  {
                    id: "2",
                    name: "Project scope definition", 
                    completed: project.status !== "planning",
                    dueDate: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                  },
                ],
              },
              {
                id: "2",
                name: "Development",
                startDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                endDate: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                status: project.status === "in-progress" ? "in-progress" : project.status === "planning" ? "pending" : "completed",
                tasks: [
                  {
                    id: "4",
                    name: "Core development",
                    completed: project.status === "completed",
                    dueDate: new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                  },
                  {
                    id: "5",
                    name: "Feature implementation",
                    completed: project.status === "completed",
                    dueDate: new Date(startDate.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                  },
                ],
              },
              {
                id: "3",
                name: "Testing & Review",
                startDate: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                endDate: new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                status: project.status === "review" ? "in-progress" : project.status === "completed" ? "completed" : "pending",
                tasks: [
                  {
                    id: "7",
                    name: "Quality assurance testing",
                    completed: project.status === "completed",
                    dueDate: new Date(startDate.getTime() + 32 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                  },
                  {
                    id: "8",
                    name: "Client review & feedback",
                    completed: project.status === "completed",
                    dueDate: new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                  },
                ],
              },
              {
                id: "4",
                name: "Launch & Delivery",
                startDate: new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                endDate: new Date(startDate.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                status: project.status === "completed" ? "completed" : "pending",
                tasks: [
                  {
                    id: "9",
                    name: "Final deployment",
                    completed: project.status === "completed",
                    dueDate: new Date(startDate.getTime() + 38 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                  },
                  {
                    id: "10",
                    name: "Documentation & handover",
                    completed: project.status === "completed",
                    dueDate: new Date(startDate.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                  },
                ],
              },
            ],
          } as Timeline
        })
        
        const updatedTimelines = [...timelinesData, ...newTimelines]
        setTimelines(updatedTimelines)
        localStorage.setItem("timelines", JSON.stringify(updatedTimelines))
      }
    }

    const savedClients = localStorage.getItem("clients")
    if (savedClients) {
      setClients(JSON.parse(savedClients))
    }
  }, [])

  const handleAddProject = () => {
    if (!formData.name.trim() || !formData.clientId) return

    const selectedClient = clients.find((c) => c.id === formData.clientId)
    const projectId = Date.now().toString()
    const newProject: Project = {
      id: projectId,
      name: formData.name,
      description: formData.description,
      clientId: formData.clientId,
      clientName: selectedClient?.name || "Unknown Client",
      status: formData.status,
      progress:
        formData.status === "planning"
          ? 0
          : formData.status === "in-progress"
            ? 50
            : formData.status === "review"
              ? 80
              : 100,
      startDate: formData.startDate,
      budget: Number.parseFloat(formData.budget) || 0,
      createdAt: new Date().toISOString(),
    }

    // Auto-create timeline for the new project
    const startDate = new Date(formData.startDate || Date.now())
    const newTimeline: Timeline = {
      id: (Date.now() + 1).toString(),
      projectId: projectId,
      phases: [
        {
          id: "1",
          name: "Discovery & Planning",
          startDate: startDate.toISOString().split("T")[0],
          endDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: formData.status === "planning" ? "in-progress" : "completed",
          tasks: [
            {
              id: "1",
              name: "Client requirements gathering",
              completed: formData.status !== "planning",
              dueDate: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            },
            {
              id: "2",
              name: "Project scope definition",
              completed: formData.status !== "planning",
              dueDate: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            },
          ],
        },
        {
          id: "2",
          name: "Development",
          startDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: (formData.status as string) === "in-progress" ? "in-progress" : (formData.status as string) === "planning" ? "pending" : "completed",
          tasks: [
            {
              id: "4",
              name: "Core development",
              completed: (formData.status as string) === "completed",
              dueDate: new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            },
            {
              id: "5",
              name: "Feature implementation",
              completed: (formData.status as string) === "completed",
              dueDate: new Date(startDate.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            },
          ],
        },
        {
          id: "3",
          name: "Testing & Review",
          startDate: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: (formData.status as string) === "review" ? "in-progress" : (formData.status as string) === "completed" ? "completed" : "pending",
          tasks: [
            {
              id: "7",
              name: "Quality assurance testing",
              completed: (formData.status as string) === "completed",
              dueDate: new Date(startDate.getTime() + 32 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            },
            {
              id: "8",
              name: "Client review & feedback",
              completed: (formData.status as string) === "completed",
              dueDate: new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            },
          ],
        },
        {
          id: "4",
          name: "Launch & Delivery",
          startDate: new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date(startDate.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: (formData.status as string) === "completed" ? "completed" : "pending",
          tasks: [
            {
              id: "9",
              name: "Final deployment",
              completed: (formData.status as string) === "completed",
              dueDate: new Date(startDate.getTime() + 38 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            },
            {
              id: "10",
              name: "Documentation & handover",
              completed: (formData.status as string) === "completed",
              dueDate: new Date(startDate.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            },
          ],
        },
      ],
    }

    const updatedProjects = [...projects, newProject]
    const updatedTimelines = [...timelines, newTimeline]
    
    setProjects(updatedProjects)
    setTimelines(updatedTimelines)
    localStorage.setItem("projects", JSON.stringify(updatedProjects))
    localStorage.setItem("timelines", JSON.stringify(updatedTimelines))

    setFormData({
      name: "",
      description: "",
      clientId: "",
      status: "planning",
      budget: "",
      startDate: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId)
    setProjects(updatedProjects)
    localStorage.setItem("projects", JSON.stringify(updatedProjects))
  }

  const handleOpenTimeline = (projectId: string) => {
    setSelectedProjectId(projectId)
    const existingTimeline = timelines.find((t) => t.projectId === projectId)

    if (existingTimeline) {
      setCurrentTimeline(existingTimeline)
    } else {
      const newTimeline: Timeline = {
        id: Date.now().toString(),
        projectId,
        phases: [
          {
            id: "1",
            name: "Discovery & Planning",
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "pending",
            tasks: [
              {
                id: "1",
                name: "Client requirements gathering",
                completed: false,
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              },
              {
                id: "2",
                name: "Project scope definition",
                completed: false,
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              },
            ],
          },
          {
            id: "2",
            name: "Development",
            startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "pending",
            tasks: [
              {
                id: "3",
                name: "Core functionality implementation",
                completed: false,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              },
              {
                id: "4",
                name: "UI/UX implementation",
                completed: false,
                dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              },
            ],
          },
          {
            id: "3",
            name: "Testing & Launch",
            startDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "pending",
            tasks: [
              {
                id: "5",
                name: "Quality assurance testing",
                completed: false,
                dueDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              },
              {
                id: "6",
                name: "Client review and feedback",
                completed: false,
                dueDate: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              },
              {
                id: "7",
                name: "Final deployment",
                completed: false,
                dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              },
            ],
          },
        ],
      }
      setCurrentTimeline(newTimeline)
    }
    setIsTimelineDialogOpen(true)
  }

  const handleSaveTimeline = () => {
    if (!currentTimeline) return

    const updatedTimelines = timelines.filter((t) => t.projectId !== currentTimeline.projectId)
    updatedTimelines.push(currentTimeline)

    setTimelines(updatedTimelines)
    localStorage.setItem("timelines", JSON.stringify(updatedTimelines))
    setIsTimelineDialogOpen(false)
  }

  const handleAddPhase = () => {
    if (!currentTimeline) return

    const newPhase: TimelinePhase = {
      id: Date.now().toString(),
      name: "New Phase",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "pending",
      tasks: [],
    }

    setCurrentTimeline({
      ...currentTimeline,
      phases: [...currentTimeline.phases, newPhase],
    })
  }

  const handleAddTask = (phaseId: string) => {
    if (!currentTimeline) return

    const newTask: TimelineTask = {
      id: Date.now().toString(),
      name: "New Task",
      completed: false,
      dueDate: new Date().toISOString().split("T")[0],
    }

    setCurrentTimeline({
      ...currentTimeline,
      phases: currentTimeline.phases.map((phase) =>
        phase.id === phaseId ? { ...phase, tasks: [...phase.tasks, newTask] } : phase,
      ),
    })
  }

  const updatePhase = (phaseId: string, updates: Partial<TimelinePhase>) => {
    if (!currentTimeline) return

    setCurrentTimeline({
      ...currentTimeline,
      phases: currentTimeline.phases.map((phase) => (phase.id === phaseId ? { ...phase, ...updates } : phase)),
    })
  }

  const updateTask = (phaseId: string, taskId: string, updates: Partial<TimelineTask>) => {
    if (!currentTimeline) return

    setCurrentTimeline({
      ...currentTimeline,
      phases: currentTimeline.phases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              tasks: phase.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
            }
          : phase,
      ),
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-[#FC4503]/10 text-[#FC4503]"
      case "review":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "in-progress":
        return "bg-[#FC4503]/10 text-[#FC4503]"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-[#FC4503] text-white">
                    <Image
                      src="/images/marro-logo-black.png"
                      alt="Marro"
                      width={24}
                      height={24}
                      className="shrink-0 invert"
                      draggable={false}
                      style={{ userSelect: "none", WebkitUserDrag: "none" } as React.CSSProperties}
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Marro</span>
                    <span className="truncate text-xs text-muted-foreground">Beta</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto bg-[#FC4503] text-white hover:bg-[#FC4503]/90">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      {profileData?.profilePicture ? (
                        <AvatarImage src={profileData.profilePicture || "/placeholder.svg"} alt="User" />
                      ) : (
                        <AvatarImage src="/avatars/user.png" alt="User" />
                      )}
                      <AvatarFallback className="rounded-lg bg-[#FC4503] text-white">
                        {profileData?.name ? profileData.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{profileData?.name || ""}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {profileData?.company || "Beta"}
                      </span>
                    </div>
                    <ChevronUp className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/account" className="flex items-center">
                      <User2 className="mr-2 h-4 w-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={async () => {
                    await supabaseHelpers.logout()
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-sidebar-border" />
            <h1 className="text-lg font-semibold">Projects</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <Badge className="bg-[#FC4503] text-white hover:bg-[#FC4503]/90">Beta</Badge>
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first project to get started with project management.
              </p>
              <Button className="bg-[#FC4503] hover:bg-[#FC4503]/90" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Project
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Button className="bg-[#FC4503] hover:bg-[#FC4503]/90" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">Client: {project.clientName}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDeleteProject(project.id)} className="text-red-600">
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{project.description}</p>

                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>

                      <Progress value={project.progress} className="h-2" />

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                        <span>Budget: ${project.budget.toLocaleString()}</span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 border-[#FC4503] text-[#FC4503] hover:bg-[#FC4503] hover:text-white bg-transparent"
                        onClick={() => handleOpenTimeline(project.id)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Manage Timeline
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </SidebarInset>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#FC4503] hover:bg-[#FC4503]/90"
              onClick={handleAddProject}
              disabled={!formData.name.trim() || !formData.clientId}
            >
              Create Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTimelineDialogOpen} onOpenChange={setIsTimelineDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Timeline</DialogTitle>
          </DialogHeader>

          {currentTimeline && (
            <div className="space-y-6 py-4">
              {currentTimeline.phases.map((phase, phaseIndex) => (
                <div key={phase.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#FC4503] text-white flex items-center justify-center text-sm font-medium">
                        {phaseIndex + 1}
                      </div>
                      <Input
                        value={phase.name}
                        onChange={(e) => updatePhase(phase.id, { name: e.target.value })}
                        className="font-medium"
                      />
                    </div>
                    <Badge className={getPhaseStatusColor(phase.status)}>
                      {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={phase.startDate}
                        onChange={(e) => updatePhase(phase.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={phase.endDate}
                        onChange={(e) => updatePhase(phase.id, { endDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={phase.status}
                        onValueChange={(value: any) => updatePhase(phase.id, { status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Tasks</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTask(phase.id)}
                        className="text-[#FC4503] border-[#FC4503] hover:bg-[#FC4503] hover:text-white"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add Task
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {phase.tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-2 p-2 border rounded">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => updateTask(phase.id, task.id, { completed: e.target.checked })}
                            className="rounded"
                          />
                          <Input
                            value={task.name}
                            onChange={(e) => updateTask(phase.id, task.id, { name: e.target.value })}
                            className="flex-1"
                          />
                          <Input
                            type="date"
                            value={task.dueDate}
                            onChange={(e) => updateTask(phase.id, task.id, { dueDate: e.target.value })}
                            className="w-40"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={handleAddPhase}
                className="w-full border-[#FC4503] text-[#FC4503] hover:bg-[#FC4503] hover:text-white bg-transparent"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Phase
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsTimelineDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#FC4503] hover:bg-[#FC4503]/90" onClick={handleSaveTimeline}>
              Save Timeline
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
