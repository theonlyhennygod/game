import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, count = 1 } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: "Prompt must be under 1000 characters" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OpenAI API Key');
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: Math.min(count, 4),
      size: "1024x1024",
      quality: "hd"
    });

    if (!response.data || response.data.length === 0) {
      console.error('No images generated', response);
      return NextResponse.json(
        { error: "Image generation failed - no results" },
        { status: 500 }
      );
    }

    const imageUrls = response.data
      .map(img => img.url)
      .filter((url): url is string => !!url);

    return NextResponse.json({ imageUrls }, {
      headers: {
        'Cache-Control': 'public, max-age=3600' // 1 hour cache
      }
    });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Image generation failed' },
      { status: 500 }
    );
  }
} 