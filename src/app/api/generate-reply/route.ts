// [TL-GENERATE-REPLY-API-01: Generate Reply API]
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Request Body
    const { reviewText, rating, customerName, businessName } = await req.json();

    if (!rating) {
      return NextResponse.json({ error: "Rating is required" }, { status: 400 });
    }

    // 3. Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key is not configured." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 4. Create Prompt
    const prompt = `
      You are a professional customer service representative for a business named "${businessName || 'our business'}". 
      A customer named "${customerName || 'Customer'}" just left a ${rating}-star review on Google.
      
      Customer's Review Text: "${reviewText || '(No text provided, just a star rating)'}"
      
      Task: Write a professional, polite, and personalized reply to this Google Review on behalf of the business owner.
      Rules:
      - Keep it concise (2-4 sentences max).
      - If it's a 4 or 5-star review, express gratitude.
      - If it's a 1 to 3-star review, apologize for any inconvenience and offer to resolve the issue.
      - Do NOT include placeholders like [Your Name]. Just write the pure reply text.
      - Reply language: Write the reply in polite English, or if the review is clearly in Hindi, reply in polite Hindi/Hinglish.
    `;

    // 5. Generate Reply
    const result = await model.generateContent(prompt);
    const generatedReply = result.response.text().trim();

    return NextResponse.json({ reply: generatedReply });
  } catch (error: unknown) {
    console.error("Gemini AI Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate reply";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
