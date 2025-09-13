"use client"

import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Users, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Home, Users2, FolderOpen, BarChart3, CalendarIcon, MessageSquare, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const events: any[] = []

const upcomingEvents: any[] = []

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Clients", url: "/dashboard/clients", icon: Users2 },
  { title: "Projects", url: "/dashboard/projects", icon: FolderOpen },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Calendar", url: "/dashboard/calendar", icon: CalendarIcon },
  { title: "Messages", url: "/dashboard/messages", icon: MessageSquare },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Support", url: "/dashboard/support", icon: HelpCircle },
]

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showEventModal, setShowEventModal] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    client: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    description: "",
  })
  const pathname = usePathname()

  const handleCreateEvent = () => {
    console.log("[v0] Creating new event:", newEvent)
    setShowEventModal(false)
    setNewEvent({
      title: "",
      client: "",
      date: "",
      time: "",
      duration: "",
      location: "",
      description: "",
    })
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-[#FC4503] text-white"
      case "review":
        return "bg-gray-100 text-gray-800"
      case "strategy":
        return "bg-gray-200 text-gray-900"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r">
          <SidebarContent>
            <div className="p-6">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="font-semibold text-lg">Marro</span>
              </Link>
            </div>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url}>
                        <Link href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <div className="flex-1 space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
                <p className="text-muted-foreground">Manage your meetings, deadlines, and events</p>
              </div>
              <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
                <DialogTrigger asChild>
                  <Button className="bg-[#FC4503] hover:bg-[#FC4503]/90">
                    <Plus className="mr-2 h-4 w-4" />
                    New Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>Schedule a new meeting, deadline, or event.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Client meeting, project review..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="client">Client</Label>
                      <Select onValueChange={(value) => setNewEvent({ ...newEvent, client: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="techcorp">TechCorp Solutions</SelectItem>
                          <SelectItem value="retailplus">RetailPlus Inc</SelectItem>
                          <SelectItem value="startupx">StartupX</SelectItem>
                          <SelectItem value="megacorp">MegaCorp</SelectItem>
                          <SelectItem value="internal">Internal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Select onValueChange={(value) => setNewEvent({ ...newEvent, duration: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30m">30 minutes</SelectItem>
                            <SelectItem value="1h">1 hour</SelectItem>
                            <SelectItem value="1.5h">1.5 hours</SelectItem>
                            <SelectItem value="2h">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                          placeholder="Office, Virtual, etc."
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        placeholder="Meeting agenda, notes..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowEventModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateEvent} className="bg-[#FC4503] hover:bg-[#FC4503]/90">
                      Create Event
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Calendar View */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        December 2024
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Today's Events</h3>
                        <Badge variant="secondary" className="bg-[#FC4503] text-white">
                          {events.length} events
                        </Badge>
                      </div>
                      {events.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No events scheduled for today</p>
                          <p className="text-sm">Click "New Event" to get started</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {events.map((event) => (
                            <div
                              key={event.id}
                              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex-shrink-0">
                                <div className="w-3 h-3 rounded-full bg-[#FC4503]"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium truncate">{event.title}</h4>
                                  <Badge variant="secondary" className={getEventTypeColor(event.type)}>
                                    {event.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {event.time} ({event.duration})
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {event.client}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {event.location}
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Events Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Your next scheduled meetings and deadlines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingEvents.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">No upcoming events</p>
                      </div>
                    ) : (
                      upcomingEvents.map((event, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-[#FC4503] flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{event.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.date} at {event.time}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">This Week</span>
                      <span className="font-semibold">0 meetings</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Next Week</span>
                      <span className="font-semibold">0 meetings</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Hours</span>
                      <span className="font-semibold">0h</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
