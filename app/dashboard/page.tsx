"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { supabaseHelpers } from "@/lib/supabase-helpers"
import { createClient } from "@/utils/supabase/client"
import { useProfile } from "@/contexts/ProfileContext"
import Link from "next/link"
import {
  Bell,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
  Users,
  BarChart3,
  FileText,
  Calendar,
  MessageSquare,
  Plus,
  LogOut,
  Upload,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  Edit,
  X,
  Save,
  Circle,
  PenTool,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Navigation items
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Clients",
      url: "/dashboard/clients",
      icon: Users,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: FileText,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      title: "Messages",
      url: "/dashboard/messages",
      icon: MessageSquare,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Support",
      url: "/dashboard/support",
      icon: Inbox,
    },
  ],
}

export default function DashboardPage() {
  const { profileData } = useProfile()
  const [clients, setClients] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [showTimelineModal, setShowTimelineModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [signatureText, setSignatureText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [mounted, setMounted] = useState(false)

  const handleLogout = async () => {
    await supabaseHelpers.logout()
  }

  useEffect(() => {
    setMounted(true)

    // Profile data is now loaded by ProfileContext

    // Load clients data
    const savedClients = localStorage.getItem("clients")
    if (savedClients) {
      try {
        setClients(JSON.parse(savedClients))
      } catch (error) {
        console.error("Failed to parse clients data:", error)
      }
    }

    // Load projects data
    const savedProjects = localStorage.getItem("projects")
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects))
      } catch (error) {
        console.error("Failed to parse projects data:", error)
      }
    }

    // Load documents data
    const savedDocuments = localStorage.getItem("documents")
    if (savedDocuments) {
      try {
        setDocuments(JSON.parse(savedDocuments))
      } catch (error) {
        console.error("Failed to parse documents data:", error)
      }
    }
  }, [])

  const [activeItem, setActiveItem] = useState("Dashboard")
  const [activePortalTab, setActivePortalTab] = useState("updates")
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showFullPortalModal, setShowFullPortalModal] = useState(false)
  const [showContractPreviewModal, setShowContractPreviewModal] = useState(false)
  const [showEditTimelineModal, setShowEditTimelineModal] = useState(false)
  const [isEditingTimeline, setIsEditingTimeline] = useState(false)
  const [signature, setSignature] = useState("")
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      name: string
      size: string
      uploadedAt: string
      isContract?: boolean
      analyzing?: boolean
    }>
  >([])
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [isSigningDocument, setIsSigningDocument] = useState(false)

  // Profile state management
  // const [profileData, setProfileData] = useState({
  //   name: "John Doe",
  //   email: "john@agency.com",
  //   profilePicture: null as string | null,
  // })

  // const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const [isLoading, setIsLoading] = useState(true)

  // useEffect(() => {
  //   const checkAuth = () => {
  //     const loginState = localStorage.getItem("loginState")
  //     if (!loginState) {
  //       window.location.href = "/login"
  //       return
  //     }

  //     try {
  //       const parsed = JSON.parse(loginState)
  //       if (parsed.isLoggedIn) {
  //         setIsAuthenticated(true)
  //       } else {
  //         window.location.href = "/login"
  //         return
  //       }
  //     } catch (error) {
  //       console.error("Failed to parse login state:", error)
  //       window.location.href = "/login"
  //       return
  //     }

  //     setIsLoading(false)
  //   }

  //   checkAuth()
  // }, [])

  // useEffect(() => {
  //   if (!isAuthenticated) return

  //   const savedProfile = localStorage.getItem("userProfile")
  //   if (savedProfile) {
  //     try {
  //       const parsed = JSON.parse(savedProfile)
  //       setProfileData(parsed)
  //     } catch (error) {
  //       console.error("Failed to parse saved profile:", error)
  //     }
  //   }

  //   const savedClients = localStorage.getItem("clients")
  //   if (savedClients) {
  //     try {
  //       const parsedClients = JSON.parse(savedClients)
  //       setClients(parsedClients)
  //     } catch (error) {
  //       console.error("Failed to parse saved clients:", error)
  //     }
  //   }

  //   const savedProjects = localStorage.getItem("projects")
  //   if (savedProjects) {
  //     try {
  //       const parsedProjects = JSON.parse(savedProjects)
  //       setProjects(parsedProjects)
  //     } catch (error) {
  //       console.error("Failed to parse saved projects:", error)
  //     }
  //   }

  //   const savedDocuments = localStorage.getItem("documents")
  //   if (savedDocuments) {
  //     try {
  //       const parsedDocuments = JSON.parse(savedDocuments)
  //       setUploadedFiles(parsedDocuments)
  //     } catch (error) {
  //       console.error("Failed to parse saved documents:", error)
  //     }
  //   }
  // }, [isAuthenticated])

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      localStorage.setItem("documents", JSON.stringify(uploadedFiles))
    }
  }, [uploadedFiles])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement> | File) => {
    let files: File[] = []

    if (event instanceof File) {
      files = [event]
    } else if (event.target && (event.target as HTMLInputElement).files) {
      const fileList = (event.target as HTMLInputElement).files
      if (fileList) {
        for (let i = 0; i < fileList.length; i++) {
          files.push(fileList[i])
        }
      }
    }

    if (files.length > 0) {
      for (const file of files) {
        // Add file with analyzing state
        const newFile = {
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          uploadedAt: "Just now",
          analyzing: true,
        }

        setUploadedFiles((prev) => {
          const updated = [...prev, newFile]
          localStorage.setItem("documents", JSON.stringify(updated))
          return updated
        })

        // Analyze if it's a contract
        const isContract = await analyzeDocument(file.name, file.type)

        // Update file with analysis result
        setUploadedFiles((prev) => {
          const updated = prev.map((f) =>
            f.name === file.name && f.analyzing ? { ...f, isContract, analyzing: false } : f,
          )
          localStorage.setItem("documents", JSON.stringify(updated))
          return updated
        })
      }

      // setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )

    if (validFiles.length > 0) {
      // Process files same as handleFileUpload
      validFiles.forEach((file) => {
        const newFile = {
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          uploadedAt: new Date().toLocaleString(),
          analyzing: true,
          isContract: undefined as boolean | undefined,
        }

        setUploadedFiles((prev) => [...prev, newFile])

        // Simulate analysis
        setTimeout(() => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.name === file.name
                ? {
                    ...f,
                    analyzing: false,
                    isContract:
                      file.name.toLowerCase().includes("contract") || file.name.toLowerCase().includes("agreement"),
                  }
                : f,
            ),
          )
        }, 2000)
      })
    }
  }

  const handleDownloadPDF = (fileName: string) => {
    // Simulate PDF download
    const link = document.createElement("a")
    link.href = "#"
    link.download = fileName
    link.click()
  }

  const handleSignDocument = async (fileName: string) => {
    setSelectedDocument(fileName)
    setIsSigningDocument(true)
    setShowSignatureModal(true)
  }

  const processSignatureWithGroq = async (documentName: string, signatureName: string) => {
    try {
      // Simulate Groq AI processing for document signing
      const response = await fetch("/api/sign-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document: documentName,
          signature: signatureName,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        // Update the document with signed status
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.name === documentName ? { ...file, name: `${file.name.replace(".pdf", "")}_SIGNED.pdf` } : file,
          ),
        )
        return true
      }
      return false
    } catch (error) {
      console.error("Signing failed:", error)
      return false
    }
  }

  const analyzeDocument = async (fileName: string, fileType: string) => {
    try {
      const response = await fetch("/api/analyze-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName,
          fileType,
        }),
      })

      if (response.ok) {
        const { isContract } = await response.json()
        return isContract
      }
      return false
    } catch (error) {
      console.error("Document analysis failed:", error)
      return false
    }
  }

  const handleSearch = (query: string) => {
    console.log("[v0] Searching for:", query)
    // Search functionality would filter through clients, projects, documents, etc.
    setShowSearchModal(false)
    setSearchQuery("")
  }

  const searchResults = {
    clients: clients.filter((client) => client.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
    projects: projects.filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
    documents: [
      { name: "Service Agreement", type: "Document", status: "Signed" },
      { name: "Project Brief", type: "Document", status: "Draft" },
    ]
      .filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 3),
  }

  // if (isLoading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="text-center">
  //         <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FC4503] border-t-transparent mx-auto mb-4"></div>
  //         <p className="text-muted-foreground">Loading...</p>
  //       </div>
  //     </div>
  //   )
  // }

  // if (!isAuthenticated) {
  //   return null
  // }

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
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive} onClick={() => setActiveItem(item.title)}>
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

          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
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
                      {mounted && profileData?.profilePicture ? (
                        <AvatarImage
                          src={profileData.profilePicture || "/placeholder.svg"}
                          alt={profileData?.name || ""}
                        />
                      ) : (
                        <AvatarImage src="/avatars/user.png" alt="User" />
                      )}
                      <AvatarFallback className="rounded-lg bg-[#FC4503] text-white">
                        {mounted && profileData?.name && profileData.name.trim()
                          ? profileData.name
                              .trim()
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {mounted && profileData?.name ? profileData.name : ""}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {mounted && profileData?.company ? profileData.company : "Beta"}
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
                  <DropdownMenuItem onClick={handleLogout}>
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
            <h1 className="text-lg font-semibold">Agency Dashboard</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <Badge className="bg-[#FC4503] text-white hover:bg-[#FC4503]/90">Beta</Badge>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent border-[#FC4503] text-[#FC4503] hover:bg-[#FC4503] hover:text-white"
              onClick={() => setShowSearchModal(true)}
            >
              <Search className="h-4 w-4" />
              Advanced Filters
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-[#FC4503] text-[#FC4503] hover:bg-[#FC4503] hover:text-white bg-transparent"
              onClick={() => setShowSearchModal(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="relative bg-transparent border-[#FC4503] text-[#FC4503] hover:bg-[#FC4503] hover:text-white"
              onClick={() => {
                alert("No new notifications")
              }}
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center justify-between">
                  Active Clients
                  <TrendingUp className="h-4 w-4 text-[#FC4503]" />
                </CardDescription>
                <CardTitle className="text-4xl">{clients.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {clients.length === 0
                    ? "Start adding clients"
                    : `${clients.length} active client${clients.length !== 1 ? "s" : ""}`}
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#FC4503]/10 to-transparent rounded-bl-full"></div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center justify-between">
                  Active Projects
                  <Target className="h-4 w-4 text-[#FC4503]" />
                </CardDescription>
                <CardTitle className="text-4xl">{projects.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {projects.length === 0
                    ? "Create your first project"
                    : `${projects.length} active project${projects.length !== 1 ? "s" : ""}`}
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#FC4503]/10 to-transparent rounded-bl-full"></div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center justify-between">
                  Monthly Revenue
                  <DollarSign className="h-4 w-4 text-[#FC4503]" />
                </CardDescription>
                <CardTitle className="text-4xl">$0</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Revenue will appear here</div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#FC4503]/10 to-transparent rounded-bl-full"></div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center justify-between">
                  AI Efficiency
                  <Zap className="h-4 w-4 text-[#FC4503]" />
                </CardDescription>
                <CardTitle className="text-4xl">0%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Efficiency tracking starts here</div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#FC4503]/10 to-transparent rounded-bl-full"></div>
              </CardContent>
            </Card>
          </div>

          {showBulkActions && (
            <Card className="border-[#FC4503] bg-[#FC4503]/5">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 text-[#FC4503]" /> {/* Placeholder for CheckSquare icon */}
                  <span className="text-sm font-medium">{selectedClients.length} clients selected</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Export Data
                  </Button>
                  <Button size="sm" variant="outline">
                    Send Update
                  </Button>
                  <Button size="sm" className="bg-[#FC4503] hover:bg-[#FC4503]/90">
                    Bulk Action
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Client Portal</CardTitle>
                <CardDescription>No active portals yet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No client portals created</p>
                  <p className="text-sm">Add your first client to get started</p>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Contracts & Documents</CardTitle>
                <CardDescription>Upload and manage contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No documents uploaded</p>
                  <p className="text-sm">Upload your first contract to get started</p>
                  <Button
                    size="sm"
                    className="mt-4 bg-[#FC4503] hover:bg-[#FC4503]/90"
                    onClick={() => document.getElementById("contract-upload")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                  <input
                    id="contract-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        // Handle file upload but don't save to localStorage for now
                        alert("Document upload functionality - files will be processed here")
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Project Timeline</CardTitle>
                  <CardDescription>
                    {projects.length === 0
                      ? "No active projects"
                      : `${projects.length} active project${projects.length !== 1 ? "s" : ""}`}
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => setShowEditTimelineModal(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No project timeline created</p>
                  <p className="text-sm">Create your first project to get started</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>

      {showSearchModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-20"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSearchModal(false)
              setSearchQuery("")
            }
          }}
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search clients, projects, documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      handleSearch(searchQuery)
                    }
                    if (e.key === "Escape") {
                      setShowSearchModal(false)
                      setSearchQuery("")
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC4503] focus:border-[#FC4503] text-lg"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => {
                    setShowSearchModal(false)
                    setSearchQuery("")
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {!searchQuery ? (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <button
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        onClick={() => {
                          setShowSearchModal(false)
                          setSearchQuery("")
                          window.location.href = "/dashboard/clients"
                        }}
                      >
                        <div className="w-8 h-8 bg-[#FC4503] rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">Add New Client</span>
                      </button>
                      <button
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        onClick={() => {
                          setShowSearchModal(false)
                          setSearchQuery("")
                          window.location.href = "/dashboard/projects"
                        }}
                      >
                        <div className="w-8 h-8 bg-[#FC4503] rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">Create New Project</span>
                      </button>
                      <button
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        onClick={() => {
                          setShowSearchModal(false)
                          setSearchQuery("")
                          // Trigger file upload
                          const input = document.createElement("input")
                          input.type = "file"
                          input.accept = ".pdf,.doc,.docx,.txt"
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) {
                              handleFileUpload(file)
                            }
                          }
                          input.click()
                        }}
                      >
                        <div className="w-8 h-8 bg-[#FC4503] rounded-lg flex items-center justify-center">
                          <Upload className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">Upload Document</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recent Activity
                    </h3>
                    <div className="space-y-2">
                      <div className="p-8 text-center">
                        <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No recent activity</p>
                        <p className="text-xs text-muted-foreground mt-1">Your recent actions will appear here</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {searchQuery && (
                    <>
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Clients
                        </h3>
                        <div className="space-y-2">
                          {searchResults.clients
                            .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((client, index) => (
                              <div
                                key={index}
                                className="p-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer"
                                onClick={() => handleSearch(client.name)}
                              >
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Users className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-medium">{client.name}</span>
                                  <p className="text-sm text-muted-foreground">
                                    {client.type} • {client.status}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Projects
                        </h3>
                        <div className="space-y-2">
                          {searchResults.projects
                            .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((project, index) => (
                              <div
                                key={index}
                                className="p-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer"
                                onClick={() => handleSearch(project.name)}
                              >
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-medium">{project.name}</span>
                                  <p className="text-sm text-muted-foreground">
                                    {project.type} • {project.status}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                          <PenTool className="h-4 w-4" />
                          Documents
                        </h3>
                        <div className="space-y-2">
                          {searchResults.documents
                            .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((document, index) => (
                              <div
                                key={index}
                                className="p-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer"
                                onClick={() => handleSearch(document.name)}
                              >
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <PenTool className="h-4 w-4 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-medium">{document.name}</span>
                                  <p className="text-sm text-muted-foreground">
                                    {document.type} • {document.status}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  )}

                  {searchQuery &&
                    !searchResults.clients.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
                    !searchResults.projects.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
                    !searchResults.documents.some((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase())) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No results found for "{searchQuery}"</p>
                        <p className="text-sm">Try searching for clients, projects, or documents</p>
                      </div>
                    )}
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Press <kbd className="px-2 py-1 bg-white rounded border">Enter</kbd> to search
                </span>
                <span>
                  Press <kbd className="px-2 py-1 bg-white rounded border">Esc</kbd> to close
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSignatureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {isSigningDocument ? "AI Document Signing" : "Digital Signature"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowSignatureModal(false)
                  setIsSigningDocument(false)
                  setSelectedDocument("")
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isSigningDocument && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Zap className="h-4 w-4 inline mr-1" />
                  Signing: <strong>{selectedDocument}</strong>
                </p>
                <p className="text-xs text-blue-600 mt-1">AI will process and stamp your signature on this document</p>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 min-h-[120px] flex items-center justify-center">
              {signature ? (
                <div className="text-2xl font-script text-[#FC4503]">{signature}</div>
              ) : (
                <p className="text-sm text-muted-foreground">Type your signature below</p>
              )}
            </div>
            <input
              type="text"
              placeholder="Type your full name"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-[#FC4503] hover:bg-[#FC4503]/90"
                onClick={async () => {
                  if (isSigningDocument && selectedDocument) {
                    const success = await processSignatureWithGroq(selectedDocument, signature)
                    if (success) {
                      setShowSignatureModal(false)
                      setSignature("")
                      setIsSigningDocument(false)
                      setSelectedDocument("")
                    }
                  } else {
                    setShowSignatureModal(false)
                    setSignature("")
                  }
                }}
                disabled={!signature}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSigningDocument ? "Sign with AI" : "Sign & Submit"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowSignatureModal(false)
                  setIsSigningDocument(false)
                  setSelectedDocument("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showFullPortalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">TechCorp Client Portal</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFullPortalModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-2 text-sm text-muted-foreground">client.trymarro.com</span>
              </div>
              <div className="bg-white rounded p-6 min-h-[400px]">
                <h2 className="text-2xl font-bold mb-4">Welcome to Your Project Portal</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">Project Progress</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-[#FC4503] h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground">75% Complete</p>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">Recent Updates</h3>
                    <p className="text-sm">Design mockups approved</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">Next Milestone</h3>
                    <p className="text-sm">Development Phase</p>
                    <p className="text-xs text-muted-foreground">Starting Jan 16</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTimelineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Project Timeline - TechCorp Website</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowTimelineModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-[#FC4503] rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="w-0.5 h-16 bg-[#FC4503] mt-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">Discovery Phase</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Completed
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Jan 1 - Jan 15, 2024 • 15 days</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Client requirements gathering</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Market research</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Technical specifications</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-[#FC4503] rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div className="w-0.5 h-16 bg-[#FC4503] mt-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">Development Phase</h4>
                    <span className="px-3 py-1 bg-[#FC4503] text-white text-xs font-medium rounded-full">
                      In Progress
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Jan 16 - Feb 15, 2024 • 31 days</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">UI/UX Design</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                      <Clock className="h-4 w-4 text-[#FC4503]" />
                      <span className="text-sm">Frontend Development</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                      <Clock className="h-4 w-4 text-[#FC4503]" />
                      <span className="text-sm">Backend Integration</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <Circle className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold">Testing & Launch</h4>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      Upcoming
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Feb 16 - Mar 1, 2024 • 14 days</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Circle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Quality assurance testing</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Circle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Client review & feedback</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Circle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Production deployment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <div className="text-sm text-muted-foreground">Total Duration: 60 days • Progress: 67% complete</div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowTimelineModal(false)}>
                  Close
                </Button>
                <Button
                  className="bg-[#FC4503] hover:bg-[#FC4503]/90"
                  onClick={() => {
                    setShowTimelineModal(false)
                    setShowEditTimelineModal(true)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Timeline
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  )
}
