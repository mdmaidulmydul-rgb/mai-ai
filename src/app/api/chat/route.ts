import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        response: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.',
        tasks: []
      })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(-10), // Last 10 messages for context
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content || '{}'
    
    try {
      const parsed = JSON.parse(content)
      return NextResponse.json({
        response: parsed.response || 'Task completed.',
        tasks: parsed.tasks || [],
      })
    } catch {
      return NextResponse.json({
        response: content,
        tasks: [],
      })
    }
  } catch (error: any) {
    console.error('OpenAI error:', error)
    return NextResponse.json({
      response: `Error: ${error.message || 'Something went wrong'}`,
      tasks: [],
    }, { status: 500 })
  }
}
