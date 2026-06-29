import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { name, mobile, subject, message } = await req.json();

    if (!name || !mobile || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("khatahisab");
    
    // Save to the "contact_messages" collection
    await db.collection("contact_messages").insertOne({
      name,
      mobile,
      subject,
      message,
      createdAt: new Date(),
      status: "unread"
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
