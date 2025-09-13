"use client"
import { useState, useEffect, Suspense } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, FileText, Calendar, Download, Eye, CheckCircle, Clock, AlertCircle, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface Client {
  id: string
  name: string
  email: string
  company: string
  status: string
  portalUrl: string
  profilePicture?: string
  documents?: ClientDocument[]
  portalAccessCode?: string
  portalEnabled?: boolean
  createdAt: Date
  updatedAt: Date
}

interface ClientDocument {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  url: string
  isContract?: boolean
}

interface Project {
  id: string
  name: string
  description: string
  status: string
  progress: number
  budget: string
  startDate: string
  endDate: string
  clientId: string
  timeline?: TimelinePhase[]
  createdAt: Date
  updatedAt: Date
}

interface TimelinePhase {
  id: string
  name: string
  startDate: string
  endDate: string
  status: string
  tasks: TimelineTask[]
}

interface TimelineTask {
  id: string
  name: string
  completed: boolean
  dueDate: string
}

function ClientPortalContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const companySlug = params.company as string
  const accessCode = searchParams.get("access")

  const [client, setClient] = useState<Client | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [timelines, setTimelines] = useState<any[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Always allow access, removed authentication barriers
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClientData()
  }, [companySlug, accessCode])

  const loadClientData = async () => {
    try {
      // Try to load from Supabase first
      await loadFromSupabase()
    } catch (error) {
      console.error("Error loading from Supabase:", error)
      // Fallback to localStorage
      loadFromLocalStorage()
    }
  }

  const loadFromSupabase = async () => {
    try {
      // For now, we'll need to get all clients since we don't have user context in the portal
      // In a production app, you'd want to implement proper portal authentication
      const response = await fetch('/api/clients')
      if (response.ok) {
        const clients: Client[] = await response.json()
        const foundClient = clients.find((c) => c.company.toLowerCase().replace(/\s+/g, "-") === companySlug)

        if (foundClient) {
          setClient(foundClient)
          setIsAuthenticated(true)

          // Load projects for this client
          const projectsResponse = await fetch(`/api/projects?client_id=${foundClient.id}`)
          if (projectsResponse.ok) {
            const clientProjects: Project[] = await projectsResponse.json()
            setProjects(clientProjects)
            
            // Load timelines
            await loadTimelines(clientProjects)
          }
        } else {
          setIsAuthenticated(false)
        }
      }
    } catch (error) {
      console.error("Supabase loading failed:", error)
      throw error
    }
  }

  const loadTimelines = async (clientProjects: Project[]) => {
    // For now, create default timelines for projects
    // In production, you'd load these from Supabase timelines table
    const timelinesData = clientProjects.map(project => {
      const startDate = new Date((project as any).start_date || project.startDate || Date.now())
      return {
        id: `timeline-${project.id}`,
        projectId: project.id,
        phases: [
          {
            id: `phase-1-${project.id}`,
            name: "Discovery",
            startDate: startDate.toISOString(),
            endDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: "completed",
            tasks: [
              { id: `task-1-1-${project.id}`, name: "Requirements gathering", completed: true, dueDate: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() },
              { id: `task-1-2-${project.id}`, name: "Stakeholder interviews", completed: true, dueDate: new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString() },
              { id: `task-1-3-${project.id}`, name: "Technical analysis", completed: true, dueDate: new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString() }
            ]
          },
          {
            id: `phase-2-${project.id}`,
            name: "Development",
            startDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            status: project.status === "completed" ? "completed" : "in-progress",
            tasks: [
              { id: `task-2-1-${project.id}`, name: "Frontend development", completed: project.status === "completed", dueDate: new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString() },
              { id: `task-2-2-${project.id}`, name: "Backend development", completed: project.status === "completed", dueDate: new Date(startDate.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString() },
              { id: `task-2-3-${project.id}`, name: "Integration", completed: false, dueDate: new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString() }
            ]
          },
          {
            id: `phase-3-${project.id}`,
            name: "Testing",
            startDate: new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString(),
            status: project.status === "completed" ? "completed" : "pending",
            tasks: [
              { id: `task-3-1-${project.id}`, name: "Unit testing", completed: false, dueDate: new Date(startDate.getTime() + 24 * 24 * 60 * 60 * 1000).toISOString() },
              { id: `task-3-2-${project.id}`, name: "User acceptance testing", completed: false, dueDate: new Date(startDate.getTime() + 26 * 24 * 60 * 60 * 1000).toISOString() },
              { id: `task-3-3-${project.id}`, name: "Bug fixes", completed: false, dueDate: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString() }
            ]
          },
          {
            id: `phase-4-${project.id}`,
            name: "Launch",
            startDate: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString(),
            status: project.status === "completed" ? "completed" : "pending",
            tasks: [
              { id: `task-4-1-${project.id}`, name: "Production deployment", completed: project.status === "completed", dueDate: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() },
              { id: `task-4-2-${project.id}`, name: "Go-live", completed: project.status === "completed", dueDate: new Date(startDate.getTime() + 32 * 24 * 60 * 1000).toISOString() },
              { id: `task-4-3-${project.id}`, name: "Post-launch monitoring", completed: false, dueDate: new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString() }
            ]
          }
        ]
      }
    })
    setTimelines(timelinesData)
  }

  const loadFromLocalStorage = () => {
    try {
      const savedClients = localStorage.getItem("clients")
      const savedProjects = localStorage.getItem("projects")
      const savedTimelines = localStorage.getItem("timelines")

      if (savedClients) {
        const clients: Client[] = JSON.parse(savedClients)
        const foundClient = clients.find((c) => c.company.toLowerCase().replace(/\s+/g, "-") === companySlug)

        if (foundClient) {
          setClient(foundClient)
          setIsAuthenticated(true)

          if (savedProjects) {
            const allProjects: Project[] = JSON.parse(savedProjects)
            const clientProjects = allProjects.filter((p) => p.clientId === foundClient.id)
            setProjects(clientProjects)

            // Load existing timelines or create default ones
            loadTimelines(clientProjects)
          } else {
            setIsAuthenticated(false)
          }
        }
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Error loading client data:", error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-[#FC4503]"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FC4503] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-[#FC4503] text-white">
                <Image
                  src="/images/marro-logo-black.png"
                  alt="Marro"
                  width={32}
                  height={32}
                  className="shrink-0 invert"
                />
              </div>
            </div>
            <CardTitle className="text-2xl">Client Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">The requested client portal could not be found.</p>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="flex aspect-square size-8 sm:size-10 items-center justify-center rounded-lg bg-[#FC4503] text-white flex-shrink-0">
                <Image
                  src="/images/marro-logo-black.png"
                  alt="Marro"
                  width={20}
                  height={20}
                  className="shrink-0 invert sm:w-6 sm:h-6"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold truncate">Client Portal</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Welcome, {client.name}</p>
              </div>
            </div>
            <Badge className="bg-[#FC4503] text-white text-xs sm:text-sm flex-shrink-0">{client.company}</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 sm:py-2.5">Overview</TabsTrigger>
            <TabsTrigger value="projects" className="text-xs sm:text-sm py-2 sm:py-2.5">Projects</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs sm:text-sm py-2 sm:py-2.5">Documents</TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs sm:text-sm py-2 sm:py-2.5">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {client.profilePicture ? (
                      <AvatarImage src={client.profilePicture || "/placeholder.svg"} alt={client.name} />
                    ) : (
                      <AvatarFallback className="bg-[#FC4503] text-white text-lg">
                        {client.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{client.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{client.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{client.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(client.status) + " text-white"}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#FC4503]" />
                    <div>
                      <p className="text-2xl font-bold">{projects.length}</p>
                      <p className="text-sm text-muted-foreground">Active Projects</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#FC4503]" />
                    <div>
                      <p className="text-2xl font-bold">{client.documents?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Documents</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{projects.filter((p) => p.status === "completed").length}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            {projects.length > 0 ? (
              <div className="grid gap-6">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{project.name}</CardTitle>
                        <Badge className={getStatusColor(project.status) + " text-white"}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Budget</p>
                          <p className="font-medium">{project.budget}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Start Date</p>
                          <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">End Date</p>
                          <p className="font-medium">
                            {project.endDate && !isNaN(new Date(project.endDate).getTime()) 
                              ? new Date(project.endDate).toLocaleDateString()
                              : project.status === "completed" ? "Completed" : "TBD"
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <p className="font-medium">{project.progress}%</p>
                        </div>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                  <p className="text-muted-foreground">Your projects will appear here once they're created.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            {client.documents && client.documents.length > 0 ? (
              <div className="grid gap-4">
                {client.documents.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#FC4503]/10">
                          <FileText className="h-5 w-5 text-[#FC4503]" />
                        </div>
                        <div>
                          <h5 className="font-medium">{doc.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                          {doc.isContract && <Badge className="mt-1 bg-[#FC4503] text-white">Contract</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.open(doc.url, "_blank")}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement("a")
                            link.href = doc.url
                            link.download = doc.name
                            link.click()
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Documents Yet</h3>
                  <p className="text-muted-foreground">Your project documents will appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            {projects.length > 0 && timelines.length > 0 ? (
              <div className="space-y-6">
                {projects.map((project) => {
                  const projectTimeline = timelines.find((t) => t.projectId === project.id)
                  
                  if (!projectTimeline) return null
                  
                  return (
                    <Card key={project.id}>
                      <CardHeader>
                        <CardTitle>{project.name} Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                            {projectTimeline.phases.map((phase: any, index: number) => (
                            <div key={phase.id} className="relative">
                              {index < projectTimeline.phases.length - 1 && (
                                <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-200"></div>
                              )}
                              <div className="flex items-start gap-4">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    phase.status === "completed"
                                      ? "bg-green-500"
                                      : phase.status === "in-progress"
                                        ? "bg-[#FC4503]"
                                        : "bg-gray-300"
                                  }`}
                                >
                                  {phase.status === "completed" ? (
                                    <CheckCircle className="h-4 w-4 text-white" />
                                  ) : phase.status === "in-progress" ? (
                                    <Clock className="h-4 w-4 text-white" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4 text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold">{phase.name}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {new Date(phase.startDate).toLocaleDateString()} -{" "}
                                    {phase.endDate && !isNaN(new Date(phase.endDate).getTime()) 
                                      ? new Date(phase.endDate).toLocaleDateString()
                                      : "Ongoing"
                                    }
                                  </p>
                                  {phase.tasks.length > 0 && (
                                    <div className="space-y-1">
                                      {phase.tasks.map((task: any) => (
                                        <div key={task.id} className="flex items-center gap-2 text-sm">
                                          <div
                                            className={`w-2 h-2 rounded-full ${
                                              task.completed ? "bg-green-500" : "bg-gray-300"
                                            }`}
                                          ></div>
                                          <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                                            {task.name}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Timeline Available</h3>
                  <p className="text-muted-foreground">Project timelines will appear here once they're created.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="text-muted-foreground">Loading client portal...</div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default function ClientPortalPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ClientPortalContent />
    </Suspense>
  )
}
