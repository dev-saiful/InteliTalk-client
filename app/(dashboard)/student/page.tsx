"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  BookOpen,
  MessageSquare,
  User,
  Send,
  Loader2,
  History,
  Bot,
} from "lucide-react";
import { studentService } from "@/lib/api-services";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast-custom";
import type { Chat } from "@/lib/types";

export default function StudentDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<
    Array<{ question: string; answer: string; loading?: boolean }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchRecentChats();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchRecentChats = async () => {
    if (!user?._id) return;

    try {
      setLoadingChats(true);
      const response = await studentService.getChats(user._id);
      if (response.success) {
        const chatData = response.data || response.chats || [];
        const chatArray = Array.isArray(chatData) ? chatData.flat() : [];
        setRecentChats(chatArray.slice(0, 5)); // Get last 5 chats
      }
    } catch (error) {
      // Silent fail for recent chats
    } finally {
      setLoadingChats(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      showError("Please enter a question");
      return;
    }

    const currentQuestion = question.trim();
    setQuestion("");

    // Add question to conversation with loading state
    setConversation((prev) => [
      ...prev,
      { question: currentQuestion, answer: "", loading: true },
    ]);

    try {
      setLoading(true);
      const response = await studentService.askQuestion(currentQuestion);

      // Update the last message with the answer
      setConversation((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          question: currentQuestion,
          answer:
            response.data?.answer ||
            "I couldn't generate an answer. Please try again.",
          loading: false,
        };
        return updated;
      });

      showSuccess("Answer received");

      // Refresh recent chats
      fetchRecentChats();
    } catch (error: any) {
      // Update with error message
      setConversation((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          question: currentQuestion,
          answer: "Sorry, I encountered an error. Please try again.",
          loading: false,
        };
        return updated;
      });
      showError(error.message || "Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {user?.name || "Student"}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Ask questions and get instant AI-powered answers
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* AI Chat Assistant */}
          <Card className="h-[calc(100vh-12rem)] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Chat Assistant
              </CardTitle>
              <CardDescription>
                Ask questions and get instant answers powered by AI
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden p-6 pt-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {conversation.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Bot className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Start a Conversation
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                      Ask me anything about your courses, subjects, or any topic
                      you need help with.
                    </p>
                  </div>
                ) : (
                  <>
                    {conversation.map((msg, index) => (
                      <div key={index} className="space-y-3">
                        {/* Question */}
                        <div className="flex justify-end">
                          <div className="bg-primary text-primary-foreground rounded-lg px-4 py-3 max-w-[85%]">
                            <p className="text-sm whitespace-pre-wrap break-word">
                              {msg.question}
                            </p>
                          </div>
                        </div>
                        {/* Answer */}
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg px-4 py-3 max-w-[85%]">
                            {msg.loading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <p className="text-sm">Thinking...</p>
                              </div>
                            ) : (
                              <p className="text-sm whitespace-pre-wrap break-word">
                                {msg.answer}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleAskQuestion}
                className="flex gap-2 pt-4 border-t"
              >
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  disabled={loading}
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit" disabled={loading || !question.trim()}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Access frequently used features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push("/student/chats")}
              >
                <History className="mr-2 h-4 w-4" />
                My Conversations
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push("/student/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Button>
            </CardContent>
          </Card>

          {/* Recent Chats */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>Your latest questions</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingChats ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : recentChats.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No conversations yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentChats.map((chat, index) => (
                    <div
                      key={chat._id || index}
                      className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                      onClick={() =>
                        router.push(`/student/message/${chat._id}`)
                      }
                    >
                      <p className="text-sm font-medium line-clamp-2">
                        {truncateText(chat.question)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(chat.createdAt || "").toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={() => router.push("/student/chats")}
                  >
                    View All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">{user?.dept || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Student ID:</span>
                <span className="font-medium">{user?.studentId || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Chats:</span>
                <span className="font-medium">{recentChats.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
