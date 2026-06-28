// [TL-POST-REPLY-API-01: Post Reply API]
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = token.accessToken as string;
    const { accountName, locationName, reviewId, replyText } = await req.json();

    if (!accountName || !locationName || !reviewId || !replyText) {
      return NextResponse.json({ error: "Missing required fields (accountName, locationName, reviewId, replyText)" }, { status: 400 });
    }

    // Google My Business API to reply to a review
    // PUT https://mybusiness.googleapis.com/v4/{accountName}/{locationName}/reviews/{reviewId}/reply
    
    const url = `https://mybusiness.googleapis.com/v4/${accountName}/${locationName}/reviews/${reviewId}/reply`;
    
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        comment: replyText
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "Failed to post reply to Google" }, { status: response.status });
    }

    return NextResponse.json({ success: true, data });

  } catch (error: unknown) {
    console.error("Post Reply Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to post reply";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
