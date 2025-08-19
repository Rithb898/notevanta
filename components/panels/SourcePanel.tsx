"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { FileText, Trash2, Sun, Moon } from "lucide-react";
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

const SourcesPanel = () => {
  const { theme, setTheme } = useTheme();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [textContent, setTextContent] = useState("");

  const handleDrop = async (droppedFiles: File[]) => {
    if (droppedFiles.length === 0) return;

    setFiles(droppedFiles);
    setLoading(true);

    try {
      const file = droppedFiles[0];
      const formData = new FormData();
      formData.append("file", file);

      // Determine file type
      const fileType = file.type === "application/pdf" ? "pdf" : "text";
      formData.append("type", fileType);

      const response = await fetch("/api/indexing", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("PDF processed:", result);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textContent.trim()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", textContent);
      formData.append("type", "text");

      const response = await fetch("/api/indexing", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Text processed:", result);
      setTextContent("");
    } catch (error) {
      console.error("Text submit error:", error);
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
        <div className="flex justify-between items-center">
          <div className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance">
            NoteVanta
          </div>
          <div className="flex gap-2">
            <div
              className="cursor-pointer"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </div>
            <div className="cursor-pointer">
              <Trash2 />
            </div>
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
            <Card className="flex justify-center items-center">
              <CardContent className="w-full">
                <Dropzone
                  accept={{
                    "application/pdf": [".pdf"],
                    "text/plain": [".txt"],
                  }}
                  maxFiles={1}
                  onDrop={handleDrop}
                  onError={handleError}
                  disabled={loading}
                  className="border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors mb-5 cursor-pointer"
                >
                  <DropzoneEmptyState className="text-gray-500 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="size-7" />
                      <div>
                        <p>
                          {loading
                            ? "Processing PDF..."
                            : "Drop PDF or text files here"}
                        </p>
                        <p className="text-xs opacity-75">
                          Supports PDF and TXT files (max 1 file)
                        </p>
                      </div>
                    </div>
                  </DropzoneEmptyState>
                  <DropzoneContent className="flex flex-col items-center" />
                </Dropzone>
                <Textarea
                  placeholder="Paste text documents here"
                  className="w-full h-32 resize-none border rounded-md p-2 text-sm"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
                <Button
                  variant="default"
                  className="w-full mt-5 text-md cursor-pointer"
                  onClick={handleTextSubmit}
                  disabled={loading || !textContent.trim()}
                >
                  {loading ? "Processing..." : "Submit"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <Card>
            <CardHeader className="scroll-m-20 text-2xl font-bold tracking-tight first:mt-0">
              Source Lists
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No snippets added yet</p>
                <p className="text-xs mt-1">
                  Highlight text from sources to create snippets
                </p>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SourcesPanel;
