"use client"

import React, { memo, useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useProfile } from "@/contexts/ProfileContext"
import { supabaseHelpers } from "@/lib/supabase-helpers"
import {
  Bell,
  ChevronUp,
  Home,
  Inbox,
  Settings,
  User2,
  Users,
  BarChart3,
  FileText,
  Calendar,
  MessageSquare,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const navMain: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Clients", url: "/dashboard/clients", icon: Users },
  { title: "Projects", url: "/dashboard/projects", icon: FileText },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
]

const navSecondary: NavItem[] = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Support", url: "/dashboard/support", icon: Inbox },
]

const DashboardSidebar = memo(() => {
  const { profileData } = useProfile()
  const pathname = usePathname()

  const handleLogout = useCallback(async () => {
    await supabaseHelpers.logout()
  }, [])

  const getUserInitials = useCallback(() => {
    if (profileData?.name && profileData.name.trim()) {
      return profileData.name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    }
    return "U"
  }, [profileData?.name])

  // Memoize navigation items with active state
  const mainNavItems = useMemo(() => 
    navMain.map(item => ({
      ...item,
      isActive: pathname === item.url
    })), [pathname]
  )

  const secondaryNavItems = useMemo(() => 
    navSecondary.map(item => ({
      ...item,
      isActive: pathname === item.url
    })), [pathname]
  )

  return (
    <Sidebar collapsible="offcanvas" className="lg:collapsible-icon">
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
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link 
                      href={item.url} 
                      className="flex items-center gap-2"
                      prefetch={true}
                    >
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
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link 
                      href={item.url} 
                      className="flex items-center gap-2"
                      prefetch={true}
                    >
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
                  <Avatar className="h-8 w-8 rounded-md">
                    {profileData?.profilePicture ? (
                      <AvatarImage src={profileData.profilePicture || "/placeholder.svg"} alt="User" />
                    ) : (
                      <AvatarImage src="/avatars/user.png" alt="User" />
                    )}
                    <AvatarFallback className="rounded-md bg-[#FC4503] text-white">
                      {getUserInitials()}
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
  )
})

DashboardSidebar.displayName = "DashboardSidebar"

export { DashboardSidebar }
