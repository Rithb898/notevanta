"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  Download,
  LoaderIcon,
  Send,
  History,
  User,
  Trash2,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useAuth } from "@/hooks/useAuth";
import { useMessageLimit } from "@/hooks/useMessageLimit";
import { useChatHistory } from "@/hooks/useChatHistory";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

// Loading component
const LoadingSpinner = () => (
  <div className="flex h-full items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <LoaderIcon className="text-primary h-8 w-8 animate-spin" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Auth error component
const AuthError = () => (
  <div className="flex h-full items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <User className="text-muted-foreground h-8 w-8" />
      <div className="text-center">
        <h3 className="text-lg font-semibold">Authentication Required</h3>
        <p className="text-muted-foreground">Please log in to continue</p>
      </div>
    </div>
  </div>
);

const ChatPanel = () => {
  const [model, setModel] = useState("openai");
  const { user, loading } = useAuth();
  const {
    messageCount,
    dailyLimit,
    canSendMessage,
    loading: limitLoading,
    refreshCount,
    incrementMessageCount,
  } = useMessageLimit(user?.uid || null);
  const {
    chatHistory,
    loading: historyLoading,
    saveChat,
    createNewChat,
    updateCurrentChat,
    loadChat,
    startNewChat,
    deleteChat,
    currentChatId,
  } = useChatHistory(user?.uid || null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    console.log("User in ChatPanel:", user);
  }, [user]);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  // Auto-save logic
  useEffect(() => {
    console.log(
      "Messages changed:",
      messages.length,
      "Current chat ID:",
      currentChatId,
    );
    if (messages.length === 1 && !currentChatId && user) {
      // First message - create new chat
      console.log("Creating new chat with first message");
      createNewChat(messages);
    } else if (messages.length > 1 && currentChatId && user) {
      // Subsequent messages - update existing chat
      console.log("Updating existing chat");
      updateCurrentChat(messages);
    }
  }, [messages.length, currentChatId, user]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && status === "ready" && user && canSendMessage) {
        incrementMessageCount();
        sendMessage(
          { text: input },
          { body: { provider: model, userId: user.uid } },
        );
        setInput("");
        setShouldScroll(true);
      }
    }
  };

  const handleClick = () => {
    if (input.trim() && status === "ready" && user && canSendMessage) {
      incrementMessageCount();
      sendMessage(
        { text: input },
        { body: { provider: model, userId: user.uid } },
      );
      setInput("");
      setShouldScroll(true);
    }
  };

  const handleStop = () => {
    if (status === "streaming") {
      stop();
    }
  };

  const downloadChat = () => {
    if (messages.length === 0) return;

    const chatContent = messages
      .map((message) => {
        const text =
          message.parts.find((part) => part.type === "text")?.text || "";
        return `${message.role === "user" ? "You" : "AI"}: ${text}`;
      })
      .join("\n\n");

    const blob = new Blob([chatContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setShouldScroll(false);
    }
  }, [messages, shouldScroll]);

  // Handle loading state
  if (loading) {
    return (
      <Card className="flex h-full flex-col">
        <CardContent className="flex-1">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  // Handle authentication error
  if (!user) {
    return (
      <Card className="flex h-full flex-col">
        <CardContent className="flex-1">
          <AuthError />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-3">
            <div className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
              {currentChatId
                ? chatHistory.find((chat) => chat.id === currentChatId)
                    ?.title || "AI Chat Assistant"
                : "AI Chat Assistant"}
            </div>
            {user && !limitLoading && (
              <div className="text-muted-foreground mt-1 text-sm">
                Messages today: {messageCount}/{dailyLimit}
                {!canSendMessage && (
                  <span className="ml-2 text-red-500">Limit reached</span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="openai" onValueChange={setModel}>
              <SelectTrigger className="w-32 text-base font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={downloadChat}
              disabled={messages.length === 0}
            >
              <Download className="size-6" />
            </Button>
            <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="cursor-pointer">
                  <History className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Chat History</SheetTitle>
                  <SheetDescription>
                    Your previous conversations
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="px-3">
                    {historyLoading ? (
                      <div className="py-8 text-center">
                        <LoaderIcon className="mx-auto h-6 w-6 animate-spin" />
                      </div>
                    ) : chatHistory.length === 0 ? (
                      <div className="text-muted-foreground py-12 text-center">
                        <History className="mx-auto mb-3 h-12 w-12 opacity-30" />
                        <p className="text-sm">No chat history yet</p>
                        <p className="mt-1 text-xs opacity-70">
                          Start a conversation to see it here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {chatHistory.map((chat) => (
                          <div
                            key={chat.id}
                            className="hover:bg-muted/50 group cursor-pointer rounded-lg border p-4 transition-colors"
                            onClick={() => {
                              const chatMessages = loadChat(chat);
                              setMessages(chatMessages);
                              setIsHistoryOpen(false);
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <h4 className="mb-1 truncate text-sm leading-5 font-medium">
                                  {chat.title}
                                </h4>
                                <p className="text-muted-foreground text-xs">
                                  {new Date(
                                    chat.updatedAt || chat.createdAt,
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-muted-foreground mt-1 text-xs opacity-60">
                                  {chat.messages?.length || 0} messages
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteChat(chat.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="mt-4 border-t px-3 pt-4">
                  <Button
                    onClick={() => {
                      startNewChat();
                      setMessages([]);
                      setIsHistoryOpen(false);
                    }}
                    className="w-full"
                    variant="outline"
                  >
                    New Chat
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center py-60 text-center">
                <div className="max-w-md">
                  <h3 className="mb-2 text-lg font-semibold">
                    Welcome to NoteVanta AI Assistant
                  </h3>
                  <p className="text-muted-foreground">
                    I'm here to help you with your questions and tasks. You can
                    choose between OpenAI and Gemini models using the dropdown
                    menu above.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
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
                    } max-w-[80%] rounded-lg p-3 break-words`}
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
                                    className || "",
                                  );
                                  const isInline = !match;

                                  // Sanitize language to prevent injection
                                  const allowedLanguages = [
                                    "javascript",
                                    "typescript",
                                    "python",
                                    "java",
                                    "html",
                                    "css",
                                    "json",
                                    "xml",
                                    "sql",
                                    "bash",
                                    "shell",
                                  ];
                                  const language =
                                    match &&
                                    allowedLanguages.includes(
                                      match[1].toLowerCase(),
                                    )
                                      ? match[1]
                                      : "text";

                                  return !isInline ? (
                                    <SyntaxHighlighter
                                      style={oneDark}
                                      language={language}
                                      PreTag="div"
                                      className="rounded-md"
                                      {...props}
                                    >
                                      {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                  ) : (
                                    <code
                                      className="bg-muted-foreground/20 rounded px-1 py-0.5 text-sm"
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
                        ) : null,
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {status === "streaming" && (
              <div className="flex justify-start">
                <div className="bg-muted max-w-[80%] rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground text-sm">
                      AI is typing...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col">
        {!canSendMessage && user && (
          <div className="border-primary bg-muted mb-3 w-full rounded-lg border p-3 text-center">
            <p className="text-primary font-medium">
              Daily message limit reached!
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Premium features coming soon! Stay tuned for unlimited messages.
            </p>
          </div>
        )}
        <div className="flex w-full gap-2">
          <Textarea
            ref={inputRef}
            placeholder={
              !canSendMessage
                ? "Daily limit reached - upgrade for more messages"
                : "Type your message..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="max-h-[120px] min-h-[40px] flex-1 resize-none"
            disabled={status === "streaming" || !user || !canSendMessage}
          />
          {status === "streaming" ? (
            <Button onClick={handleStop} variant="outline" size="sm">
              Stop
            </Button>
          ) : (
            <Button
              onClick={handleClick}
              disabled={!input.trim() || !user || !canSendMessage}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatPanel;
