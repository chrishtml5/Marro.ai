"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Calendar, FileText, Download, Eye, Clock, CheckCircle, AlertCircle, User, Building, Mail } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Client {
  id: string
  name: string
  email: string
  company: string
  status: string
  profilePicture?: string
  documents?: ClientDocument[]
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
  clientId: string
  clientName: string
  status: "planning" | "in-progress" | "review" | "completed"
  progress: number
  startDate: string
  budget: number
  createdAt: string
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

function ClientPortalContent() {
  const searchParams = useSearchParams()
  const clientId = searchParams.get("client") || ""

  const [client, setClient] = useState<Client | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [timelines, setTimelines] = useState<Timeline[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClientData()
  }, [clientId])

  const loadClientData = () => {
    const savedClients = localStorage.getItem("clients")
    const savedProjects = localStorage.getItem("projects")
    const savedTimelines = localStorage.getItem("timelines")

    if (savedClients) {
      const clients = JSON.parse(savedClients)
      const foundClient = clients.find((c: Client) => c.id === clientId)
      setClient(foundClient || null)
    }

    if (savedProjects) {
      const allProjects = JSON.parse(savedProjects)
      const clientProjects = allProjects.filter((p: Project) => p.clientId === clientId)
      setProjects(clientProjects)
    }

    if (savedTimelines) {
      setTimelines(JSON.parse(savedTimelines))
    }

    setLoading(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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

  const getPhaseStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-[#FC4503]" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FC4503] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Client Not Found</h1>
          <p className="text-muted-foreground">The requested client portal could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#FC4503] text-white">
                <Image
                  src="/images/marro-logo-black.png"
                  alt="Marro"
                  width={24}
                  height={24}
                  className="shrink-0 invert"
                  draggable={false}
                  style={{ userSelect: "none", WebkitUserDrag: "none" }}
                />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Client Portal</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {client.name}</p>
              </div>
            </div>
            <Badge className="bg-[#FC4503] text-white">
              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Client Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                {client.profilePicture ? (
                  <AvatarImage src={client.profilePicture || "/placeholder.svg"} alt={client.name} />
                ) : (
                  <AvatarFallback className="bg-[#FC4503] text-white text-xl">{client.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{client.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {client.company}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {projects.length} Active Projects
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid gap-6">
              {projects.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                    <p className="text-muted-foreground">Your projects will appear here once they're created.</p>
                  </CardContent>
                </Card>
              ) : (
                projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{project.name}</CardTitle>
                          <p className="text-muted-foreground mt-1">{project.description}</p>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Start Date:</span>
                          <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Budget:</span>
                          <p className="font-medium">${project.budget.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {client.documents && client.documents.length > 0 ? (
                  <div className="space-y-3">
                    {client.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                            <Eye className="h-4 w-4" />
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
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No documents available</p>
                    <p className="text-sm">Documents shared with you will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            {projects.map((project) => {
              const projectTimeline = timelines.find((t) => t.projectId === project.id)

              return (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {project.name} Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {projectTimeline ? (
                      <div className="space-y-6">
                        {projectTimeline.phases.map((phase, index) => (
                          <div key={phase.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-[#FC4503] text-white flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              {index < projectTimeline.phases.length - 1 && (
                                <div className="w-px h-16 bg-gray-200 mt-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-8">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{phase.name}</h4>
                                {getPhaseStatusIcon(phase.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {new Date(phase.startDate).toLocaleDateString()} -{" "}
                                {phase.endDate && !isNaN(new Date(phase.endDate).getTime()) 
                                  ? new Date(phase.endDate).toLocaleDateString()
                                  : "Ongoing"
                                }
                              </p>
                              <div className="space-y-2">
                                {phase.tasks.map((task) => (
                                  <div key={task.id} className="flex items-center gap-2 text-sm">
                                    <div
                                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                        task.completed ? "bg-green-500 border-green-500" : "border-gray-300"
                                      }`}
                                    >
                                      {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                                      {task.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-auto">
                                      Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No timeline available</p>
                        <p className="text-sm">Project timeline will be shared once created</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}

            {projects.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Timeline Available</h3>
                  <p className="text-muted-foreground">Project timelines will appear here once projects are created.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-muted-foreground">Loading client portal...</div>
        </div>
      </div>
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
