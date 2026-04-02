import { NextResponse } from 'next/server'

export async function POST(req) {
  const { apiKey } = await req.json()
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    return NextResponse.json({ valid: false })
  }
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    })
    return NextResponse.json({ valid: res.ok })
  } catch {
    return NextResponse.json({ valid: false })
  }
}
