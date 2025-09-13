import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType } = await request.json()

    // Use Groq AI to analyze if the document is a contract
    const { text } = await generateText({
      model: groq("llama3-70b-8192", {
        apiKey: process.env.GROQ_API_KEY,
      }),
      prompt: `Analyze this document filename and type to determine if it's likely a contract or legal document that would require signing:

Filename: ${fileName}
File Type: ${fileType}

Based on the filename and type, is this likely a contract, agreement, legal document, or other document that would typically require a signature?

Consider these as contracts/signable documents:
- Contracts, agreements, terms of service
- Legal documents, NDAs, waivers
- Proposals with acceptance requirements
- Service agreements, employment contracts
- Purchase orders, invoices requiring approval

Consider these as NOT contracts/signable documents:
- Regular PDFs, presentations, reports
- Images, design files, mockups
- Documentation, manuals, guides
- Invoices for information only
- General business documents

Respond with only "CONTRACT" if it's likely a signable document, or "DOCUMENT" if it's a regular document.`,
    })

    const isContract = text.trim().toUpperCase().includes("CONTRACT")

    return NextResponse.json({
      isContract,
      analysis: isContract ? "Contract detected - signing available" : "Regular document - no signing needed",
    })
  } catch (error) {
    console.error("Document analysis error:", error)
    return NextResponse.json(
      {
        isContract: false,
        analysis: "Analysis failed - treating as regular document",
      },
      { status: 500 },
    )
  }
}
