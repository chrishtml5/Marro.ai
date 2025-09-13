import { type NextRequest, NextResponse } from "next/server"
import { projectsDb } from "@/lib/db"

export async function GET() {
  try {
    const projects = projectsDb.getAll()
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const project = projectsDb.create(body)
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
