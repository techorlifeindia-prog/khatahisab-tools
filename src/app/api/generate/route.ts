import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { action, prompt, tone, platform, businessName, location } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    let finalPrompt = "";

    if (action === 'reply') {
      finalPrompt = `You are a professional customer support representative for "${businessName}" located in ${location}. 
Write a ${tone} reply to the following customer review.
Keep it concise, polite, and relevant. Do not include placeholders like [Your Name].

Customer Review: "${prompt}"

Reply:`;
    } else if (action === 'post') {
      finalPrompt = `You are a social media manager for "${businessName}" located in ${location}.
Write an engaging social media post for ${platform} based on this topic: "${prompt}".
Include relevant emojis and 3-5 popular hashtags at the end. Make it exciting and professional.
Keep the length appropriate for ${platform}.

Social Media Post:`;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const result = await model.generateContent(finalPrompt);
    const responseText = result.response.text();

    return NextResponse.json({ result: responseText });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
