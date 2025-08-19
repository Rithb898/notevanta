import { NextRequest } from "next/server";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant";

export async function POST(request: NextRequest) {
  const { messages, provider }: { messages: UIMessage[]; provider: string } =
    await request.json();

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
      collectionName: "notevanta",
    }
  );

  const vectoreRetriever = vectorStore.asRetriever({
    k: 3,
  });

  const relevantDocs = await vectoreRetriever.invoke(userQuery);

  const SYSTEM_PROMPT = `
        You are a helpfull AI Assistant who asnweres user query based on the available context
        retrieved from a PDF file along with page_contents and page number.

        You should only ans the user based on the following context and navigate the user
        to open the right page number to know more.

        Context:
        ${JSON.stringify(relevantDocs)}
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
