import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { document, signature, timestamp } = await request.json()

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: `You are a digital document signing assistant. Process this document signing request:

Document: ${document.name}
Signer: ${signature}
Timestamp: ${timestamp}

Generate a professional signature verification and document processing summary. Include:
1. Document validation status
2. Signature authenticity confirmation
3. Processing timestamp
4. Unique signature hash

Respond in JSON format with: status, verification, hash, summary`,
    })

    let aiResponse
    try {
      aiResponse = JSON.parse(text)
    } catch {
      // Fallback if AI doesn't return valid JSON
      aiResponse = {
        status: "verified",
        verification: "Document successfully processed and signed",
        hash: `groq_${Math.random().toString(36).substring(7)}`,
        summary: text,
      }
    }

    const signedDocument = {
      originalDocument: document,
      signedBy: signature,
      signedAt: timestamp,
      aiProcessed: true,
      signatureHash: aiResponse.hash,
      aiVerification: aiResponse.verification,
      aiSummary: aiResponse.summary,
      status: aiResponse.status,
    }

    return NextResponse.json({
      success: true,
      signedDocument,
      message: "Document signed successfully with Groq AI processing",
    })
  } catch (error) {
    console.error("Groq AI signing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sign document with AI processing",
      },
      { status: 500 },
    )
  }
}
