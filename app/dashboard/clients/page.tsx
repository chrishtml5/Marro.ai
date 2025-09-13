"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { supabaseHelpers } from "@/lib/supabase-helpers"
import { useProfile } from "@/contexts/ProfileContext"
import type { Client } from "@/lib/types"

import Image from "next/image"
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
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Upload,
  File,
  Download,
  Eye,
  Link as LinkIcon,
  RefreshCw,
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
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Navigation items
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
      isActive: true,
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

// Use the Client type from lib/types.ts and extend it for backward compatibility
interface ClientWithLegacy extends Client {
  // Legacy properties for backward compatibility
  portalUrl?: string
  profilePicture?: string
  createdAt?: Date
  updatedAt?: Date
  portalAccessCode?: string
  portalEnabled?: boolean
}

interface ClientDocument {
  id: string
  name: string
  size: number
  type: string
  uploaded_at: string
  url: string
  is_contract?: boolean
}

export default function ClientsPage() {
  const router = useRouter()
  const { profileData } = useProfile()
  const [clients, setClients] = useState<ClientWithLegacy[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientWithLegacy | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    status: "active",
    profilePicture: "",
  })
  const [selectedClient, setSelectedClient] = useState<ClientWithLegacy | null>(null)
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    // Profile data is now loaded by ProfileContext
    testSupabaseConnection()
    loadClientsFromSupabase()
  }, [])

  const testSupabaseConnection = async () => {
    console.log("Testing Supabase connection...")
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      console.log("Current user:", user)
      
      if (user) {
        // Test if we can query the clients table
        const { data, error } = await supabase
          .from('clients')
          .select('count')
          .limit(1)
        
        if (error) {
          console.error("Error querying clients table:", error)
        } else {
          console.log("Clients table accessible:", data)
        }
      }
    } catch (error) {
      console.error("Supabase connection test failed:", error)
    }
  }

  const loadClientsFromSupabase = async () => {
    console.log("Loading clients from Supabase...")
    try {
      // First check if user is authenticated
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error("User not authenticated when loading clients:", userError)
        return
      }
      
      console.log("User authenticated, loading clients for user ID:", user.id)
      
      // Try direct query to see what's in the database
      const { data: rawData, error: rawError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (rawError) {
        console.error("Raw query error:", rawError)
      } else {
        console.log("Raw query result:", rawData)
      }
      
      // Now try with helper function
      const clientsData = await supabaseHelpers.getClients()
      console.log("Helper function result:", clientsData)
      setClients(clientsData)
    } catch (error) {
      console.error("Error loading clients from Supabase:", error)
      // Fallback to localStorage for backward compatibility
      const savedClients = localStorage.getItem("clients")
      if (savedClients) {
        console.log("Falling back to localStorage clients:", JSON.parse(savedClients))
        setClients(JSON.parse(savedClients))
      } else {
        console.log("No clients found in localStorage either")
      }
    }
  }

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setFormData({ ...formData, profilePicture: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const generateAccessCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Starting client creation...")
    
    try {
      const clientData = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        status: formData.status as "active" | "inactive" | "pending",
        profile_picture: formData.profilePicture || undefined,
        portal_url: `trymarro.com/${formData.company.toLowerCase().replace(/\s+/g, "-")}`,
      }

      console.log("Client data to create:", clientData)
      
      const newClient = await supabaseHelpers.createClient(clientData)
      console.log("Client created successfully:", newClient)
      
      // Update state
      const updatedClients = [...clients, newClient]
      setClients(updatedClients)

      // Also save to localStorage as backup while debugging
      localStorage.setItem("clients", JSON.stringify(updatedClients))
      console.log("Also saved to localStorage as backup")

      setIsAddDialogOpen(false)
      setFormData({ name: "", email: "", company: "", status: "active", profilePicture: "" })
      
      alert("Client created successfully!")
    } catch (error) {
      console.error("Error creating client:", error)
      alert(`Failed to create client: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClient) return

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        status: formData.status as "active" | "inactive" | "pending",
        profile_picture: formData.profilePicture || undefined,
        portal_url: `trymarro.com/${formData.company.toLowerCase().replace(/\s+/g, "-")}`,
      }

      const updatedClient = await supabaseHelpers.updateClient(editingClient.id, updateData)
      setClients(clients.map((client) =>
        client.id === editingClient.id ? updatedClient : client
      ))

      setIsEditDialogOpen(false)
      setEditingClient(null)
      setFormData({ name: "", email: "", company: "", status: "active", profilePicture: "" })
    } catch (error) {
      console.error("Error updating client:", error)
      alert("Failed to update client. Please try again.")
    }
  }

  const handleDeleteClient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return
    
    try {
      await supabaseHelpers.deleteClient(id)
      setClients(clients.filter((client) => client.id !== id))
    } catch (error) {
      console.error("Error deleting client:", error)
      alert("Failed to delete client. Please try again.")
    }
  }

  const openEditDialog = (client: ClientWithLegacy) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      company: client.company,
      status: client.status,
      profilePicture: client.profile_picture || client.profilePicture || "",
    })
    setIsEditDialogOpen(true)
  }

  const getUserInitials = () => {
    if (profileData?.name && profileData.name.trim()) {
      return profileData.name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    }
    return "U"
  }

  const copyPortalLink = (client: ClientWithLegacy) => {
    const portalUrl = client.portal_url || client.portalUrl || `trymarro.com/${client.company.toLowerCase().replace(/\s+/g, "-")}`
    const accessCode = client.portalAccessCode || generateAccessCode()
    const fullUrl = `https://${portalUrl}?access=${accessCode}`
    navigator.clipboard.writeText(fullUrl)
    alert(`Portal link copied: ${fullUrl}`)
  }

  const togglePortalAccess = (clientId: string) => {
    // For now, just show an alert since this requires backend changes
    alert("Portal access toggle functionality coming soon!")
  }

  const regenerateAccessCode = (clientId: string) => {
    // For now, just show an alert since this requires backend changes
    alert("Access code regeneration functionality coming soon!")
  }

  const openDocumentDialog = (client: ClientWithLegacy) => {
    setSelectedClient(client)
    setIsDocumentDialogOpen(true)
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
    // Handle file drop functionality
    const files = e.dataTransfer.files
    if (files.length > 0) {
      alert("Document upload functionality coming soon!")
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDocumentUpload = (clientId: string, files: FileList | null) => {
    if (!files) return

    const updatedClients = clients.map((client) => {
      if (client.id === clientId) {
        const newDocuments = Array.from(files).map((file) => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          url: URL.createObjectURL(file),
          isContract: file.type === "application/pdf" && file.name.toLowerCase().includes("contract"),
        }))

        return {
          ...client,
          documents: [...(client.documents || []), ...newDocuments],
          updatedAt: new Date(),
        }
      }
      return client
    })

    // Document upload functionality coming soon with Supabase integration
    alert("Document upload functionality coming soon!")
  }

  const handleDocumentDelete = (clientId: string, documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return
    // Document deletion functionality coming soon with Supabase integration
    alert("Document deletion functionality coming soon!")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#FC4503] text-white">
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
                    <SidebarMenuButton asChild isActive={item.isActive}>
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
                  <DropdownMenuItem onClick={() => router.push("/dashboard/account")}>
                    <User2 className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await supabaseHelpers.logout()
                    }}
                  >
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
            <h1 className="text-lg font-semibold">Clients</h1>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search clients..."
                className="w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadClientsFromSupabase}
                className="hover:bg-[#FC4503]/10 hover:border-[#FC4503]"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#FC4503] hover:bg-[#FC4503]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddClient} className="space-y-4">
                  <div>
                    <Label htmlFor="profilePicture">Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        {formData.profilePicture ? (
                          <AvatarImage src={formData.profilePicture || "/placeholder.svg"} alt="Profile" />
                        ) : (
                          <AvatarFallback className="bg-[#FC4503] text-white">
                            <Upload className="h-6 w-6" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <Input
                          id="profilePicture"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("profilePicture")?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Photo
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[#FC4503] hover:bg-[#FC4503]/90">
                      Add Client
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Client Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Client</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditClient} className="space-y-4">
                  <div>
                    <Label htmlFor="editProfilePicture">Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        {formData.profilePicture ? (
                          <AvatarImage src={formData.profilePicture || "/placeholder.svg"} alt="Profile" />
                        ) : (
                          <AvatarFallback className="bg-[#FC4503] text-white">
                            <Upload className="h-6 w-6" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <Input
                          id="editProfilePicture"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("editProfilePicture")?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Photo
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="editName">Name</Label>
                    <Input
                      id="editName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editEmail">Email</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editCompany">Company</Label>
                    <Input
                      id="editCompany"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editStatus">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[#FC4503] hover:bg-[#FC4503]/90">
                      Update Client
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {clients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first client to get started with client management.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#FC4503] hover:bg-[#FC4503]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Client
                </Button>
              </div>
            ) : (
              filteredClients.map((client) => (
                <Card key={client.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        {(client.profile_picture || client.profilePicture) ? (
                          <AvatarImage src={(client.profile_picture || client.profilePicture) || "/placeholder.svg"} alt={client.name} />
                        ) : (
                          <AvatarFallback className="bg-[#FC4503] text-white">{client.name.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{client.name}</h3>
                        <p className="text-sm text-muted-foreground">{client.company}</p>
                        <p className="text-xs text-muted-foreground">{client.email}</p>
                        <p className="text-xs text-muted-foreground">{client.documents?.length || 0} documents</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge
                        className={
                          client.status === "active"
                            ? "bg-[#FC4503] text-white hover:bg-[#FC4503]/90"
                            : client.status === "pending"
                              ? "bg-yellow-500 text-white hover:bg-yellow-500/90"
                              : "bg-gray-500 text-white hover:bg-gray-500/90"
                        }
                      >
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyPortalLink(client)}
                        className="hover:bg-[#FC4503]/10 hover:border-[#FC4503]"
                        disabled={!(client.portalEnabled ?? true)}
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Portal {(client.portalEnabled ?? true) ? "Active" : "Disabled"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDocumentDialog(client)}
                        className="hover:bg-[#FC4503]/10 hover:border-[#FC4503]"
                      >
                        <File className="mr-2 h-4 w-4" />
                        Documents ({client.documents?.length || 0})
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(client)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => togglePortalAccess(client.id)}>
                            <User2 className="mr-2 h-4 w-4" />
                            {(client.portalEnabled ?? true) ? "Disable" : "Enable"} Portal
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => regenerateAccessCode(client.id)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Reset Access Code
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClient(client.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <File className="h-5 w-5" />
                  Documents for {selectedClient?.name}
                </DialogTitle>
              </DialogHeader>

              {selectedClient && (
                <div className="space-y-6">
                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver ? "border-[#FC4503] bg-[#FC4503]/5" : "border-gray-300 hover:border-[#FC4503]/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Upload Client Documents</h3>
                    <p className="text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      onChange={(e) => handleDocumentUpload(selectedClient.id, e.target.files)}
                      className="hidden"
                      id={`client-docs-${selectedClient.id}`}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById(`client-docs-${selectedClient.id}`)?.click()}
                      className="hover:bg-[#FC4503]/10 hover:border-[#FC4503]"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Files
                    </Button>
                  </div>

                  {/* Documents List */}
                  <div>
                    <h4 className="font-semibold mb-4">Uploaded Documents ({selectedClient.documents?.length || 0})</h4>

                    {selectedClient.documents && selectedClient.documents.length > 0 ? (
                      <div className="grid gap-3">
                        {selectedClient.documents.map((doc) => (
                          <Card key={doc.id}>
                            <CardContent className="flex items-center justify-between p-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-[#FC4503]/10">
                                  <File className="h-5 w-5 text-[#FC4503]" />
                                </div>
                                <div>
                                  <h5 className="font-medium">{doc.name}</h5>
                                  <p className="text-sm text-muted-foreground">
                                    {formatFileSize(doc.size)} • {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : 'Unknown date'}
                                  </p>
                                  {doc.is_contract && <Badge className="mt-1 bg-[#FC4503] text-white">Contract</Badge>}
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
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDocumentDelete(selectedClient.id, doc.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No documents uploaded yet</p>
                        <p className="text-sm">Upload documents to get started</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
