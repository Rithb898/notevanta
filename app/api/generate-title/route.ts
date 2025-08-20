import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: Array<{ role: string; parts: Array<{ text: string }> }> } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 },
      );
    }

    const firstUserMessage =
      messages.find((msg) => msg.role === "user")?.parts?.[0]?.text || "";

    const { text } = await generateText({
      model: google("gemini-2.5-flash-lite"),
      prompt: `Generate a short, descriptive title (max 50 characters) for this conversation based on the user's first message: "${firstUserMessage}". Only return the title, nothing else.`,
    });

    return NextResponse.json({ title: text.trim() });
  } catch (error) {
    console.error("Title generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate title" },
      { status: 500 },
    );
  }
}
