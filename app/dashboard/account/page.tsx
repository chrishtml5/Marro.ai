"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { supabaseHelpers } from "@/lib/supabase-helpers"
import { createClient } from "@/utils/supabase/client"
import { useProfile } from "@/contexts/ProfileContext"

import Image from "next/image"
import Link from "next/link"
import {
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
  CreditCard,
  Download,
  Edit,
  Save,
  ArrowLeft,
  Crown,
  Upload,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
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

export default function AccountPage() {
  const { refreshProfile } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [profilePicture, setProfilePicture] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Load user profile from Supabase
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true)
        setError("")
        
        let user = await supabaseHelpers.getUser()
        
        // If no user profile exists in database, create one from auth user
        if (!user) {
          console.log("No user profile found, creating from auth user...")
          const supabase = createClient()
          const { data: { user: authUser } } = await supabase.auth.getUser()
          
          if (authUser) {
            const userName = authUser.user_metadata?.full_name || 
                           authUser.user_metadata?.name || 
                           authUser.email?.split('@')[0] || 
                           "User"
            
            try {
              user = await supabaseHelpers.createUserProfile({
                email: authUser.email || "",
                name: userName,
                plan: "free",
              })
              console.log("User profile created successfully")
            } catch (createError) {
              console.error("Error creating user profile:", createError)
              setError("Failed to create user profile")
              return
            }
          }
        }
        
        if (user) {
          // Parse the full name into first and last name
          const nameParts = (user.name || "").split(' ')
          const firstName = nameParts[0] || ''
          const lastName = nameParts.slice(1).join(' ') || ''
          
          setFirstName(firstName)
          setLastName(lastName)
          setEmail(user.email)
          setCompany(user.company || "") // Load company from database
          setProfilePicture(user.profile_picture || "")
        } else {
          setError("Failed to load user profile")
        }
      } catch (err) {
        console.error("Error loading user profile:", err)
        setError("Failed to load user profile")
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [])

  const handleLogout = async () => {
    await supabaseHelpers.logout()
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError("")

    try {
      // Update user profile in Supabase
      const fullName = `${firstName} ${lastName}`.trim()
      await supabaseHelpers.updateUser({
        name: fullName,
        email: email,
        company: company || undefined,
        profile_picture: profilePicture || undefined,
      })

      // Refresh the profile context to update all dashboard pages
      await refreshProfile()
      
      setIsEditing(false)
    } catch (err) {
      console.error("Error saving profile:", err)
      setError("Failed to save profile changes")
    } finally {
      setIsSaving(false)
    }
  }

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                        {(item as any).badge && (
                          <Badge variant="secondary" className="ml-auto bg-[#FC4503] text-white hover:bg-[#FC4503]/90">
                            {(item as any).badge}
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
                      <AvatarImage src={profilePicture || "/placeholder.svg"} alt="User" />
                      <AvatarFallback className="rounded-lg bg-[#FC4503] text-white">
                        {firstName.charAt(0)}
                        {lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {firstName} {lastName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">Beta</span>
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
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <Badge className="bg-[#FC4503] text-white hover:bg-[#FC4503]/90">Beta</Badge>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h1 className="text-2xl font-bold">Account</h1>
            <p className="text-muted-foreground">Manage your profile and subscription details</p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User2 className="h-5 w-5 text-[#FC4503]" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FC4503] mr-2"></div>
                      Saving...
                    </>
                  ) : isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Loading profile...</div>
                  </div>
                ) : (
                  <>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profilePicture || "/placeholder.svg"} alt="Profile" />
                      <AvatarFallback className="bg-[#FC4503] text-white text-xl">
                        {firstName.charAt(0)}
                        {lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer">
                        <label htmlFor="profile-upload" className="cursor-pointer">
                          <Upload className="h-6 w-6 text-white" />
                          <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePictureUpload}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
                </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-[#FC4503]" />
                  Subscription
                </CardTitle>
                <CardDescription>Manage your Beta subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-[#FC4503]/5 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#FC4503] rounded-lg flex items-center justify-center">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Beta</h3>
                      <p className="text-sm text-muted-foreground">$119/month • Billed annually</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-[#FC4503]">∞</div>
                    <p className="text-sm text-muted-foreground">Client Portals</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-[#FC4503]">✓</div>
                    <p className="text-sm text-muted-foreground">White-label</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-[#FC4503]">24/7</div>
                    <p className="text-sm text-muted-foreground">Support</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Change Plan
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#FC4503]" />
                  Billing & Invoices
                </CardTitle>
                <CardDescription>View your billing history and download invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Next billing date</p>
                    <p className="text-sm text-muted-foreground">February 15, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$119.00</p>
                    <p className="text-sm text-muted-foreground">Beta</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Recent Invoices</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="text-sm font-medium">Invoice #2024-001</p>
                        <p className="text-xs text-muted-foreground">January 15, 2024</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">$119.00</span>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="text-sm font-medium">Invoice #2023-012</p>
                        <p className="text-xs text-muted-foreground">December 15, 2023</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">$119.00</span>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
