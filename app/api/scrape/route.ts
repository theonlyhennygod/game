import { NextResponse } from 'next/server'
import { AI21 } from 'ai21'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    if (!process.env.AI21_API_KEY) {
      return NextResponse.json(
        { error: 'AI21_API_KEY not configured' },
        { status: 500 }
      )
    }

    const client = new AI21({
      apiKey: process.env.AI21_API_KEY
    })

    // Step 1: Get webpage content
    const response = await fetch(url)
    const html = await response.text()
    
    // Step 2: Extract main content (simplified example)
    const textContent = html
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .substring(0, 10000) // Limit content length

    // Step 3: Generate battle topic using AI21
    const aiResponse = await client.chat.completions.create({
      model: 'jamba-large',
      messages: [{
        role: 'user',
        content: `Summarize this in 3-5 words: ${textContent}`
      }],
      max_tokens: 20 // Limit response length
    })

    // Add validation for the response
    const summary = aiResponse.choices[0].message.content
      .replace(/["']/g, '') // Remove quotes
      .split(/\s+/)
      .slice(0, 5)
      .join(' ');

    return NextResponse.json({ topic: summary });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Scraping failed' },
      { status: 500 }
    )
  }
} 