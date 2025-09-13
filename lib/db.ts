interface Client {
  id: string
  userId: string
  name: string
  email: string
  company: string
  status: string
  portalUrl: string
  createdAt: Date
  updatedAt: Date
}

interface Project {
  id: string
  userId: string
  clientId: string
  name: string
  description: string
  status: string
  progress: number
  startDate: Date
  budget: number
  createdAt: Date
  updatedAt: Date
}

interface Message {
  id: string
  userId: string
  clientId: string
  projectId: string
  content: string
  type: string
  status: string
  createdAt: Date
  updatedAt: Date
}

const clients: Client[] = [
  {
    id: "1",
    userId: "user1",
    name: "Sarah Johnson",
    email: "sarah@techstartup.com",
    company: "TechStartup Inc",
    status: "active",
    portalUrl: "client.trymarro.com/techstartup",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    userId: "user1",
    name: "Michael Chen",
    email: "michael@designco.com",
    company: "DesignCo",
    status: "active",
    portalUrl: "client.trymarro.com/designco",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: "3",
    userId: "user1",
    name: "Emily Rodriguez",
    email: "emily@retailplus.com",
    company: "RetailPlus",
    status: "pending",
    portalUrl: "client.trymarro.com/retailplus",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
]

const projects: Project[] = [
  {
    id: "1",
    userId: "user1",
    clientId: "1",
    name: "Website Redesign",
    description: "Complete website overhaul with modern design",
    status: "in-progress",
    progress: 75,
    startDate: new Date("2024-01-15"),
    budget: 15000,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "2",
    userId: "user1",
    clientId: "2",
    name: "Brand Identity",
    description: "Logo design and brand guidelines",
    status: "review",
    progress: 90,
    startDate: new Date("2024-02-01"),
    budget: 8000,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "3",
    userId: "user1",
    clientId: "3",
    name: "E-commerce Platform",
    description: "Custom e-commerce solution",
    status: "planning",
    progress: 25,
    startDate: new Date("2024-02-15"),
    budget: 25000,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-12"),
  },
]

const messages: Message[] = [
  {
    id: "1",
    userId: "user1",
    clientId: "1",
    projectId: "1",
    content: "Design mockups are ready for review",
    type: "update",
    status: "read",
    createdAt: new Date("2024-02-15T14:30:00"),
    updatedAt: new Date("2024-02-15T14:30:00"),
  },
  {
    id: "2",
    userId: "user1",
    clientId: "2",
    projectId: "2",
    content: "Looks great! Just one small change needed",
    type: "feedback",
    status: "responded",
    createdAt: new Date("2024-02-15T16:45:00"),
    updatedAt: new Date("2024-02-15T17:00:00"),
  },
]

// CRUD operations for clients
export const clientsDb = {
  getAll: () => clients,
  getById: (id: string) => clients.find((c) => c.id === id),
  create: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    clients.push(newClient)
    return newClient
  },
  update: (id: string, updates: Partial<Client>) => {
    const index = clients.findIndex((c) => c.id === id)
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updates, updatedAt: new Date() }
      return clients[index]
    }
    return null
  },
  delete: (id: string) => {
    const index = clients.findIndex((c) => c.id === id)
    if (index !== -1) {
      clients.splice(index, 1)
      return true
    }
    return false
  },
}

// CRUD operations for projects
export const projectsDb = {
  getAll: () => projects,
  getById: (id: string) => projects.find((p) => p.id === id),
  getByClientId: (clientId: string) => projects.filter((p) => p.clientId === clientId),
  create: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    projects.push(newProject)
    return newProject
  },
  update: (id: string, updates: Partial<Project>) => {
    const index = projects.findIndex((p) => p.id === id)
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates, updatedAt: new Date() }
      return projects[index]
    }
    return null
  },
  delete: (id: string) => {
    const index = projects.findIndex((p) => p.id === id)
    if (index !== -1) {
      projects.splice(index, 1)
      return true
    }
    return false
  },
}

// CRUD operations for messages
export const messagesDb = {
  getAll: () => messages,
  getById: (id: string) => messages.find((m) => m.id === id),
  getByClientId: (clientId: string) => messages.filter((m) => m.clientId === clientId),
  create: (message: Omit<Message, "id" | "createdAt" | "updatedAt">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    messages.push(newMessage)
    return newMessage
  },
  update: (id: string, updates: Partial<Message>) => {
    const index = messages.findIndex((m) => m.id === id)
    if (index !== -1) {
      messages[index] = { ...messages[index], ...updates, updatedAt: new Date() }
      return messages[index]
    }
    return null
  },
  delete: (id: string) => {
    const index = messages.findIndex((m) => m.id === id)
    if (index !== -1) {
      messages.splice(index, 1)
      return true
    }
    return false
  },
}
