import { type NextRequest, NextResponse } from "next/server"
import { messagesDb } from "@/lib/db"

export async function GET() {
  try {
    const messages = messagesDb.getAll()
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message = messagesDb.create(body)
    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}
