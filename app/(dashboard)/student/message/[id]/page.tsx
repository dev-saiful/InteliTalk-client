"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ChatConversation } from "@/components/student/chat-bubble";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { studentService } from "@/lib/api-services";
import { useToast } from "@/hooks/use-toast-custom";
import type { Chat } from "@/lib/types";
import { use } from "react";

export default function MessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [chatData, setChatData] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    fetchChat();
  }, [resolvedParams.id]);

  const fetchChat = async () => {
    try {
      setLoading(true);
      const response = await studentService.getChats(resolvedParams.id);
      if (response.success) {
        const data = response.data || response.chats || [];
        const chatArray = Array.isArray(data) ? data : [];
        setChatData(chatArray);
      }
    } catch (error: any) {
      showError(error.message || "Failed to fetch chat");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chat History</h1>
          <p className="text-muted-foreground mt-1">
            View your conversation details
          </p>
        </div>
      </div>

      {/* Content */}
      {chatData.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No chat history found
              </h3>
              <p className="text-muted-foreground mb-6">
                This conversation doesn't have any messages yet
              </p>
              <Button onClick={() => router.push("/student")}>
                Start New Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {chatData.map((chat, index) => (
            <ChatConversation
              key={chat._id || index}
              question={chat.question}
              answer={chat.answer}
              timestamp={chat.createdAt}
            />
          ))}

          {/* Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Continue Learning</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button
                onClick={() => router.push("/student")}
                className="flex-1"
              >
                Ask Another Question
              </Button>
              <Button
                onClick={() => router.push("/student/chats")}
                variant="outline"
                className="flex-1"
              >
                View All Chats
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
