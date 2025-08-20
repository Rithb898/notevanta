import { NextRequest, NextResponse } from "next/server";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

export async function DELETE(request: NextRequest) {
  try {
    const { documentId, userId, filename } = await request.json();

    console.log("Delete request:", { documentId, userId, filename });

    if (!documentId || !userId || !filename) {
      return NextResponse.json(
        { error: "Document ID, userId, and filename are required" },
        { status: 400 },
      );
    }

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });

    const collectionName = `notevanta_${userId}`;
    console.log("Using collection:", collectionName);

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName,
      },
    );

    console.log("Deleting documents with filename:", filename);

    await vectorStore.delete({
      filter: {
        must: [
          {
            key: "filename",
            match: {
              value: filename,
            },
          },
        ],
      },
    });

    console.log("Document deleted successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete document",
      },
      { status: 500 },
    );
  }
}
