import { NextRequest } from "next/server";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  const {
    messages,
    provider,
    userId,
  }: { messages: UIMessage[]; provider: string; userId: string } =
    await request.json();

  // Check message limit directly
  const today = new Date().toISOString().split('T')[0];
  const docRef = doc(db, "messageUsage", `${userId}_${today}`);
  const docSnap = await getDoc(docRef);
  const messageCount = docSnap.exists() ? docSnap.data().count || 0 : 0;
  
  if (messageCount >= 10) {
    return new Response(
      JSON.stringify({ error: "Daily message limit reached" }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Get the latest user message text
  const lastUserMessage = messages[messages.length - 1];
  const userQuery =
    lastUserMessage?.parts?.[0]?.type === "text"
      ? lastUserMessage.parts[0].text
      : "";

  // console.log(userQuery);

  // console.log(JSON.stringify(messages));

  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: process.env.QDRANT_URL,
      collectionName: `notevanta_${userId}`,
    },
  );

  const vectoreRetriever = vectorStore.asRetriever({
    k: 3,
  });

  const relevantDocs = await vectoreRetriever.invoke(userQuery);

  // console.log(relevantDocs)

  const SYSTEM_PROMPT = `
        You are NoteVanta AI, an intelligent document assistant that helps users understand and interact with their uploaded content.

        You have access to content from various file types including PDFs, text files, CSV files, and websites. Your role is to:
        - Answer questions accurately based on the provided context
        - Provide specific references to source material when available (page numbers for PDFs, sections for documents)
        - Summarize information clearly and concisely
        - Help users navigate to relevant sections of their documents
        - Admit when information is not available in the provided context

        Available Context:
        ${JSON.stringify(relevantDocs)}

        Instructions:
        - Base your responses solely on the provided context
        - When referencing PDFs, include page numbers if available
        - For websites, mention the source URL when relevant
        - For CSV data, help interpret and analyze the information
        - If the context doesn't contain enough information to answer a question, say so clearly
        - Be conversational but professional in your responses
        `;

  const model =
    provider === "openai"
      ? groq("openai/gpt-oss-120b")
      : google("gemini-2.5-flash-lite");

  const result = streamText({
    model,
    messages: convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
  });

  return result.toUIMessageStreamResponse();
}
