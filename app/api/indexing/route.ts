import { NextRequest, NextResponse } from "next/server";

// Loader
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { compile } from "html-to-text";

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
    const userId = formData.get("userId") as string;
    const filename = formData.get("filename") as string;
    const url = formData.get("url") as string;

    if (!type || (!file && !textContent && !url) || !userId) {
      return NextResponse.json(
        {
          error:
            "Type, userId and either file or text content, or URL are required",
        },
        { status: 400 },
      );
    }

    let docs: Document[];

    if (url) {
      // Handle URL
      if (type === "single") {
        const loader = new CheerioWebBaseLoader(url);
        docs = await loader.load();
      } else {
        const compiledConvert = compile({ wordwrap: 130 });
        const loader = new RecursiveUrlLoader(url, {
          extractor: compiledConvert,
          excludeDirs: ["/api/", "/admin/"],
        });
        docs = await loader.load();
      }
    } else if (textContent) {
      // Handle text
      docs = [new Document({ pageContent: textContent })];
    } else if (file) {
      // Handle file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = path.join(process.cwd(), "temp", file.name);
      await writeFile(tempPath, buffer);

      let loader;
      if (type === "pdf") {
        loader = new PDFLoader(tempPath);
      } else if (type === "csv") {
        loader = new CSVLoader(tempPath);
      } else {
        loader = new TextLoader(tempPath);
      }

      docs = await loader.load();
      await unlink(tempPath);
    }

    // Split documents
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 400,
    });

    const splitDocs = await textSplitter.splitDocuments(docs);

    // Include userId in document metadata
    const docsWithMetadata = splitDocs.map((doc) => ({
      ...doc,
      metadata: { ...doc.metadata, userId, filename },
    }));

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });

    await QdrantVectorStore.fromDocuments(docsWithMetadata, embeddings, {
      url: process.env.QDRANT_URL,
      collectionName: `notevanta_${userId}`,
    });

    return NextResponse.json({
      success: true,
      chunks: docsWithMetadata.length,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
