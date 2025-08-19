"use client";
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Download, LoaderIcon, Send, Settings } from "lucide-react";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

const ChatPanel = () => {
  const [model, setModel] = useState("openai");
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        provider: model,
      },
    }),
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && status === "ready") {
        sendMessage({ text: input });
        setInput("");
        setShouldScroll(true);
      }
    }
  };

  const handleClick = () => {
    if (input.trim() && status === "ready") {
      sendMessage({ text: input });
      setInput("");
      setShouldScroll(true);
    }
  };

  useEffect(() => {
    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setShouldScroll(false);
    }
  }, [messages, shouldScroll]);

  useEffect(() => {
    if (status === "ready") {
      inputRef.current?.focus();
    }
  }, [status]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance">
            New Conversetion
          </div>
          <div className="flex gap-2 items-center">
            <Select defaultValue="gemini" onValueChange={setModel}>
              <SelectTrigger className="w-32 text-base font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  } p-3 rounded-lg max-w-[80%] break-words`}
                >
                  <div className="text-sm">
                    {message.parts.map((part, index) =>
                      part.type === "text" ? (
                        message.role === "user" ? (
                          <span key={index}>{part.text}</span>
                        ) : (
                          <ReactMarkdown
                            key={index}
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({
                                node,
                                className,
                                children,
                                ...props
                              }: any) {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                const isInline = !match;
                                return !isInline ? (
                                  <SyntaxHighlighter
                                    style={oneDark}
                                    language={match[1]}
                                    PreTag="div"
                                    className="rounded-md"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code
                                    className="bg-muted-foreground/20 px-1 py-0.5 rounded text-sm"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {part.text}
                          </ReactMarkdown>
                        )
                      ) : null
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <Separator />
      <CardFooter className="mt-auto flex flex-col">
        <div className="flex w-full gap-2 items-end">
          <Textarea
            ref={inputRef}
            placeholder="Type your message here..."
            className="h-20 no-scrollbar flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status !== "ready"}
          />

          {status === "submitted" || status === "streaming" ? (
            <Button size="icon" className="h-10 w-10 rounded-full bg-primary">
              <LoaderIcon className="animate-spin" />
            </Button>
          ) : (
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-primary"
              onClick={handleClick}
              disabled={status !== "ready"}
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>

        <p className="text-muted-foreground text-center text-xs pb-4 w-full mt-2 -mb-7">
          ⌨️ Enter to send • Shift+Enter for new line
        </p>
      </CardFooter>
    </Card>
  );
};

export default ChatPanel;
