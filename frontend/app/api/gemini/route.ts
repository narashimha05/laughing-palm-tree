// File: /app/api/gemini/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Define types
type MessagePart = {
  text: string;
};

type Message = {
  role: string;
  parts: MessagePart[];
};

type RequestBody = {
  messages: Message[];
  systemPrompt?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { messages, systemPrompt } = body;
    
    // Gemini API endpoint
    const apiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Ensure at least one message is present
    if (!messages.length) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    // Inject system prompt into the first user message
    const modifiedMessages = messages.map((msg, index) => {
      if (index === 0 && systemPrompt) {
        return {
          role: msg.role,
          parts: [{ text: `${systemPrompt}\n\n${msg.parts[0]?.text || ""}` }],
        };
      }
      return msg;
    });

    // Prepare the request payload
    const payload = {
      contents: modifiedMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: msg.parts,
      })),
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
    };

    // Make request to Gemini API
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from Gemini API', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to listen. How can I help?";

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error('Error in Gemini API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
