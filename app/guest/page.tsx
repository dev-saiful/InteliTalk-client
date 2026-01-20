"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Send, Loader2, MessageSquare, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { guestService } from "@/lib/api-services";
import { useToast } from "@/hooks/use-toast-custom";

interface ChatMessage {
  id: string;
  type: "question" | "answer";
  content: string;
  timestamp: number;
  isError?: boolean;
}

export default function GuestPage() {
  const [question, setQuestion] = useState("");
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("guestChatMessages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (err) {
        console.error("Failed to parse saved messages:", err);
      }
    }
  }, []);

  // Clear localStorage on page unload (refresh/close browser)
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("guestChatMessages");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Clear localStorage when navigating away (back button, etc.)
  useEffect(() => {
    return () => {
      // Small delay to ensure navigation has started
      setTimeout(() => {
        localStorage.removeItem("guestChatMessages");
      }, 100);
    };
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("guestChatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  // Smooth scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      showError("Please enter a question");
      return;
    }

    const questionText = question.trim();

    // Add question to messages
    const questionMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "question",
      content: questionText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, questionMessage]);
    setQuestion(""); // Clear the form immediately
    setIsLoading(true);

    try {
      const response = await guestService.askQuestion(questionText);

      if (response.success && response.ans) {
        // Add answer to messages
        const answerMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "answer",
          content: response.ans,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, answerMessage]);
      }
    } catch (err: any) {
      const errorMessage =
        err.message ||
        "I'm having trouble connecting right now. Please try again in a moment.";

      // Add friendly error message to chat
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "answer",
        content: `Sorry, ${errorMessage} 😔`,
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 shadow"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        <div
          className="max-w-5xl mx-auto flex flex-col"
          style={{ height: "calc(100vh - 3rem)" }}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-3">
              <div className="rounded-full bg-primary p-3">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-1">InteliTalk Guest Portal</h1>
            <p className="text-muted-foreground text-sm">
              Ask questions and get AI-powered answers instantly
            </p>
          </div>

          {/* Chat Messages Container */}
          <Card className="flex-1 flex flex-col overflow-hidden mb-3 min-h-0 shadow-lg">
            <CardContent
              ref={chatContainerRef}
              className="flex-1 p-6 space-y-6 min-h-0 bg-linear-to-b from-background to-muted/20 scrollbar-hide"
              style={{
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {messages.length === 0 && !isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground space-y-4">
                    <div className="rounded-full bg-primary/10 p-6 w-fit mx-auto">
                      <MessageSquare className="h-16 w-16 text-primary/40" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-foreground mb-2">
                        Start a Conversation
                      </p>
                      <p className="text-sm">
                        Ask me anything and I'll help you find answers
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 animate-in slide-in-from-bottom-4 duration-300 ${
                    message.type === "question"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.type === "answer" && (
                    <div className="shrink-0 mt-1">
                      <div className="rounded-full bg-linear-to-br from-primary to-primary/80 p-2.5 shadow-md">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col max-w-[75%] gap-1">
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        message.type === "question"
                          ? "bg-linear-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-sm"
                          : message.isError
                          ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100 rounded-tl-sm"
                          : "bg-card border border-border/50 rounded-tl-sm"
                      }`}
                    >
                      {message.type === "question" ? (
                        <p className="whitespace-pre-wrap wrap-words text-sm leading-relaxed">
                          {message.content}
                        </p>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-pre:my-2 prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-muted prose-pre:p-3 prose-pre:rounded-lg">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-[10px] text-muted-foreground/70 px-2 ${
                        message.type === "question" ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {message.type === "question" && (
                    <div className="shrink-0 mt-1">
                      <div className="rounded-full bg-linear-to-br from-secondary to-secondary/80 p-2.5 shadow-md">
                        <User className="h-5 w-5 text-secondary-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start animate-in slide-in-from-bottom-4 duration-300">
                  <div className="shrink-0 mt-1">
                    <div className="rounded-full bg-linear-to-br from-primary to-primary/80 p-2.5 shadow-md">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="rounded-2xl rounded-tl-sm px-5 py-4 bg-card border border-border/50 shadow-sm">
                    <LoadingSpinner />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>
          </Card>

          {/* Question Input Card */}
          <Card className="shrink-0 shadow-lg border-2">
            <CardContent className="pt-3 pb-3">
              <form onSubmit={handleSubmit} className="space-y-1.5">
                <div className="flex gap-2 items-end">
                  <Textarea
                    placeholder="Type your question here..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={isLoading}
                    rows={1}
                    className="resize-none flex-1 min-h-[44px] max-h-[120px] border-2 focus-visible:ring-2 focus-visible:ring-primary/20 py-2.5"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !question.trim()}
                    size="icon"
                    className="h-[44px] w-[44px] shrink-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1 pl-0.5">
                  <span className="font-medium">💡</span> Enter to send •
                  Shift+Enter for new line
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
