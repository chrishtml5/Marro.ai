import { type NextRequest, NextResponse } from "next/server"
import { clientsDb } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = clientsDb.getById(params.id)
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }
    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const client = clientsDb.update(params.id, body)
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }
    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = clientsDb.delete(params.id)
    if (!success) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Client deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}
