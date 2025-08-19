import { NextRequest, NextResponse } from "next/server";

// Loader
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;
    const textContent = formData.get("text") as string;

    if (!type || (!file && !textContent)) {
      return NextResponse.json(
        { error: "Type and either file or text content are required" },
        { status: 400 }
      );
    }

    let docs: Document[];

    if (textContent) {
      // Handle direct text input
      docs = [new Document({ pageContent: textContent })];
    } else {
      // Handle file upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = path.join(process.cwd(), "temp", file.name);
      await writeFile(tempPath, buffer);

      // Choose loader based on file type
      const loader =
        type === "pdf" ? new PDFLoader(tempPath) : new TextLoader(tempPath);

      docs = await loader.load();
      await unlink(tempPath);
    }

    // Split documents
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 400,
    });

    const splitDocs = await textSplitter.splitDocuments(docs);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });

    await QdrantVectorStore.fromDocuments(splitDocs, embeddings, {
      url: process.env.QDRANT_URL,
      collectionName: "notevanta",
    });

    return NextResponse.json({
      success: true,
      chunks: splitDocs.length,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
