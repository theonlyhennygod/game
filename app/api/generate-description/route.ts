import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Generate a 2-sentence creative battle description for: ${topic}. Include RPG elements and dramatic language.`
      }],
      temperature: 0.7,
      max_tokens: 100
    });

    return NextResponse.json({ 
      description: completion.choices[0].message.content 
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Description generation failed' },
      { status: 500 }
    );
  }
} 