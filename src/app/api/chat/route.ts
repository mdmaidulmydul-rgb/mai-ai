import { NextRequest, NextResponse } from "next/server"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

const SYSTEM_PROMPT = `You are MAI AI — an autonomous AI agent inspired by Manus AI. You can:
- Browse the web and research topics
- Write, review, and debug code in any language
- Plan and execute multi-step tasks
- Manage files and documents
- Analyze data and generate reports
- Answer questions across any domain

When given a task, always:
1. Break it down into clear steps
2. Execute each step methodically
3. Provide detailed, actionable results

Return your response in this JSON format:
{
  "response": "Your full response text here",
  "tasks": [
    {"id": 1, "label": "Step description", "status": "done", "detail": "What was done"},
    {"id": 2, "label": "Step description", "status": "done", "detail": "What was done"}
  ]
}

The tasks array should reflect the steps you took to answer. Keep task labels short (under 50 chars).
Always return valid JSON.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        response: "Groq API key not configured. Please add GROQ_API_KEY to your environment variables.",
        tasks: []
      })
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-10),
        ],
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: "json_object" },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Groq API error")
    }

    const content = data.choices[0]?.message?.content || "{}"

    try {
      const parsed = JSON.parse(content)
      return NextResponse.json({
        response: parsed.response || "Task completed.",
        tasks: parsed.tasks || [],
      })
    } catch {
      return NextResponse.json({
        response: content,
        tasks: [],
      })
    }
  } catch (error: any) {
    console.error("Groq error:", error)
    return NextResponse.json({
      response: `Error: ${error.message || "Something went wrong"}`,
      tasks: [],
    }, { status: 500 })
  }
}
