"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  FileText,
  Trash2,
  Sun,
  Moon,
  LogOut,
  UploadCloud,
  UploadCloudIcon,
  DownloadCloud,
  Download,
  CloudUpload,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "../ui/shadcn-io/dropzone";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ScrollArea } from "../ui/scroll-area";

interface Document {
  id: string;
  filename: string;
  type: "pdf" | "text";
  uploadDate: string;
  title?: string;
}

const SourcesPanel = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [urlContent, setUrlContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchDocuments = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/documents?userId=${user.uid}`);
      if (response.ok) {
        const { documents } = await response.json();
        setDocuments(documents);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user, loading]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const isUrl = (text: string) => {
    try {
      new URL(text.trim());
      return true;
    } catch {
      return false;
    }
  };

  const handleDrop = async (droppedFiles: File[]) => {
    if (droppedFiles.length === 0 || !user) return;

    setFiles(droppedFiles);
    setLoading(true);

    try {
      const file = droppedFiles[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.uid);
      formData.append("filename", file.name);

      // Determine file type
      let fileType: "pdf" | "text" | "csv";
      if (file.type === "application/pdf") {
        fileType = "pdf";
      } else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        fileType = "csv";
      } else {
        fileType = "text";
      }
      formData.append("type", fileType);

      const response = await fetch("/api/indexing", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        return;
      }

      const result = await response.json();
      console.log("File processed:", result);

      // Add to Firestore
      await addDoc(collection(db, "documents"), {
        userId: user.uid,
        filename: file.name,
        type: fileType,
        uploadDate: new Date().toISOString(),
      });
    } catch (error) {
      console.error(
        "Upload error:",
        error instanceof Error
          ? error.message.replace(/[\r\n]/g, " ")
          : "Unknown error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textContent.trim() || !user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();

      if (isUrl(textContent)) {
        formData.append("url", textContent.trim());
        formData.append("type", "single");
        formData.append("filename", new URL(textContent.trim()).hostname);
      } else {
        formData.append("text", textContent);
        formData.append("type", "text");
        formData.append("filename", "Text Document");
      }

      formData.append("userId", user.uid);

      const response = await fetch("/api/indexing", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      await addDoc(collection(db, "documents"), {
        userId: user.uid,
        filename: isUrl(textContent)
          ? new URL(textContent.trim()).hostname
          : "Text Document",
        type: isUrl(textContent) ? "website" : "text",
        uploadDate: new Date().toISOString(),
      });

      setTextContent("");
      setSuccess("Document processed successfully!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Add URL submit handler
  const handleUrlSubmit = async (crawlType: "single" | "crawl") => {
    if (!urlContent.trim() || !user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("url", urlContent);
      formData.append("type", crawlType);
      formData.append("userId", user.uid);
      formData.append("filename", new URL(urlContent).hostname);

      const response = await fetch("/api/indexing", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "URL processing failed");
      }

      await addDoc(collection(db, "documents"), {
        userId: user.uid,
        filename: new URL(urlContent).hostname,
        type: "website",
        uploadDate: new Date().toISOString(),
      });

      setUrlContent("");
      setSuccess("Website processed successfully!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: Error) => {
    console.error("Dropzone error:", error);
  };
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance">
            NoteVanta
          </div>
          <div className="flex items-center gap-3">
            <div
              className="cursor-pointer"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </div>
            {user && (
              <>
                <span className="font-medium">{user.displayName}</span>
                <LogOut className="h-6 w-6 cursor-pointer" onClick={logout} />
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <Tabs defaultValue="document">
          <TabsList className="w-full">
            <TabsTrigger value="document" className="cursor-pointer">
              Document
            </TabsTrigger>
            <TabsTrigger value="website" className="cursor-pointer">
              Website
            </TabsTrigger>
          </TabsList>
          <TabsContent value="document" className="py-3">
            <Card className="flex items-center justify-center">
              <CardContent className="w-full">
                <Dropzone
                  accept={{
                    "application/pdf": [".pdf"],
                    "text/plain": [".txt"],
                    "text/csv": [".csv"],
                  }}
                  maxFiles={1}
                  onDrop={handleDrop}
                  onError={handleError}
                  disabled={loading}
                  className="hover:border-primary mb-5 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 transition-colors"
                >
                  <DropzoneEmptyState className="text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <CloudUpload className="size-7" />
                      <div>
                        <p>
                          {loading
                            ? "Processing PDF..."
                            : "Drop PDF, text, or CSV files here"}
                        </p>
                        <p className="text-xs opacity-75">
                          Supports PDF, TXT, or CSV files (max 1 file)
                        </p>
                      </div>
                    </div>
                  </DropzoneEmptyState>
                  <DropzoneContent className="flex flex-col items-center" />
                </Dropzone>
                {error && (
                  <div className="mb-3 rounded border border-red-400 bg-red-100 p-2 text-red-700">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-3 rounded border border-green-400 bg-green-100 p-2 text-green-700">
                    {success}
                  </div>
                )}
                <Textarea
                  placeholder="Paste text documents or URLs here"
                  className="h-28 w-full resize-none rounded-md border p-2 text-sm"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
                <Button
                  variant="default"
                  className={`text-md relative mt-5 w-full ${
                    loading || !textContent.trim()
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                  onClick={handleTextSubmit}
                  disabled={loading || !textContent.trim()}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="website" className="py-3">
            <Card>
              <CardContent className="w-full">
                <input
                  type="url"
                  placeholder="Enter website URL"
                  value={urlContent}
                  onChange={(e) => setUrlContent(e.target.value)}
                  className="mb-3 w-full rounded border p-2"
                />
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    onClick={() => handleUrlSubmit("single")}
                    className="px-7"
                    disabled={!isUrl(urlContent) || loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Processing...
                      </div>
                    ) : (
                      "Single Page"
                    )}
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleUrlSubmit("crawl")}
                    className="px-7"
                    disabled={!isUrl(urlContent) || loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Processing...
                      </div>
                    ) : (
                      "Full Page"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <Card className="h-72">
            <CardHeader className="scroll-m-20 text-2xl font-bold tracking-tight first:mt-0">
              Source Lists
            </CardHeader>
            <CardContent className="-mt-5 h-48">
              <ScrollArea className="h-full">
                {documents.length === 0 ? (
                  <div className="text-muted-foreground py-8 text-center">
                    <FileText className="mx-auto mb-3 h-8 w-8 opacity-50" />
                    <p className="text-sm">No documents uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documents.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between rounded border p-2"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{document.filename}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              console.log("Deleting document:", {
                                id: document.id.replace(/[\r\n]/g, " "),
                                filename: document.filename.replace(
                                  /[\r\n]/g,
                                  " ",
                                ),
                              });

                              // Delete from Qdrant
                              const response = await fetch(
                                "/api/delete-document",
                                {
                                  method: "DELETE",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    documentId: document.id,
                                    userId: user?.uid,
                                    filename: document.filename,
                                  }),
                                },
                              );

                              if (!response.ok) {
                                const errorData = await response.json();
                                console.error(
                                  "Qdrant delete failed:",
                                  typeof errorData === "object"
                                    ? JSON.stringify(errorData).replace(
                                        /[\r\n]/g,
                                        " ",
                                      )
                                    : String(errorData).replace(/[\r\n]/g, " "),
                                );
                                throw new Error(
                                  errorData.error ||
                                    "Failed to delete from vector store",
                                );
                              }

                              console.log("Qdrant delete successful");

                              // Delete from Firebase
                              await deleteDoc(
                                doc(db, "documents", document.id),
                              );
                              console.log("Firebase delete successful");

                              fetchDocuments();
                            } catch (error) {
                              console.error(
                                "Delete error:",
                                error instanceof Error
                                  ? error.message.replace(/[\r\n]/g, " ")
                                  : "Unknown error",
                              );
                              alert(
                                `Failed to delete document: ${
                                  error instanceof Error
                                    ? error.message
                                    : "Unknown error"
                                }`,
                              );
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SourcesPanel;
