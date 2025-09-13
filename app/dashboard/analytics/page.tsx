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
  Settings,
  User2,
  Users,
  BarChart3,
  FileText,
  Calendar,
  MessageSquare,
  LogOut,
  TrendingUp,
  DollarSign,
  CheckCircle,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const navMain = [
  { title: "Dashboard", url: "/dashboard", icon: Home, isActive: false },
  { title: "Clients", url: "/dashboard/clients", icon: Users, isActive: false },
  { title: "Projects", url: "/dashboard/projects", icon: FileText, isActive: false },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3, isActive: true },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar, isActive: false },
  { title: "Messages", url: "/dashboard/messages", icon: MessageSquare, isActive: false, badge: "1" },
]

const navSecondary = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Support", url: "/dashboard/support", icon: User2 },
]

export default function AnalyticsPage() {
  const { profileData } = useProfile()
  const [clients, setClients] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    // Profile data is now loaded by ProfileContext

    const savedClients = localStorage.getItem("clients")
    if (savedClients) {
      setClients(JSON.parse(savedClients))
    }

    const savedProjects = localStorage.getItem("projects")
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  const handleLogout = async () => {
    await supabaseHelpers.logout()
  }

  const getInitials = (name: string) => {
    if (!name || !name.trim()) return "U"
    return name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const totalRevenue = projects.reduce((sum, project) => {
    let budget = 0
    if (typeof project.budget === "string") {
      budget = Number.parseFloat(project.budget.replace(/[^0-9.-]+/g, "") || "0")
    } else if (typeof project.budget === "number") {
      budget = project.budget
    }
    return sum + (project.status === "Completed" ? budget : budget * 0.5)
  }, 0)

  const completedProjects = projects.filter((p) => p.status === "Completed").length
  const activeProjects = projects.filter((p) => p.status === "In Progress").length
  const projectCompletionRate = projects.length > 0 ? (completedProjects / projects.length) * 100 : 0
  const clientSatisfactionRate = 95 // Placeholder - could be calculated from client feedback
  const avgProjectDuration = projects.length > 0 ? 45 : 0 // Placeholder calculation

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
                        {profileData?.name ? getInitials(profileData.name) : "U"}
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
            <h1 className="text-lg font-semibold">Analytics</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <Badge className="bg-[#FC4503] text-white hover:bg-[#FC4503]/90">Beta</Badge>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {clients.length > 0 || projects.length > 0 ? (
            <>
              {/* Key Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{clients.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {clients.length > 0 ? `${clients.length} total clients` : "No clients yet"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeProjects}</div>
                    <p className="text-xs text-muted-foreground">{completedProjects} completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{projectCompletionRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Project success rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Insights */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Performance</CardTitle>
                    <CardDescription>Current project status overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Project Completion</span>
                        <span>{projectCompletionRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={projectCompletionRate} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Client Satisfaction</span>
                        <span>{clientSatisfactionRate}%</span>
                      </div>
                      <Progress value={clientSatisfactionRate} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>On-Time Delivery</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest project and client updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects.slice(0, 3).map((project, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-[#FC4503] rounded-full"></div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{project.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Status: {project.status} • Client: {project.client}
                            </p>
                          </div>
                        </div>
                      ))}
                      {projects.length === 0 && <p className="text-sm text-muted-foreground">No recent activity</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No analytics data yet</h3>
              <p className="text-muted-foreground mb-4">
                Start adding clients and projects to see your performance analytics.
              </p>
              <Button className="bg-[#FC4503] hover:bg-[#FC4503]/90">View Getting Started Guide</Button>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
