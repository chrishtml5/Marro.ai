import { type NextRequest, NextResponse } from "next/server"
import { clientsDb } from "@/lib/db"

export async function GET() {
  try {
    const clients = clientsDb.getAll()
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = clientsDb.create(body)
    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}
