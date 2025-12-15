"use client";

import { useState, useEffect } from "react";
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
import { MessageSquare, Search, Clock, Trash2 } from "lucide-react";
import { studentService } from "@/lib/api-services";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast-custom";
import type { Chat } from "@/lib/types";

export default function StudentChatsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showError } = useToast();

  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user?._id) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = chats.filter(
        (chat) =>
          chat.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    } else {
      setFilteredChats(chats);
    }
  }, [searchQuery, chats]);

  const fetchChats = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const response = await studentService.getChats(user._id);
      if (response.success) {
        const chatData = response.data || response.chats || [];
        // Ensure it's an array and flatten if needed
        let chatArray: Chat[] = [];
        if (Array.isArray(chatData)) {
          chatArray = chatData.flat() as Chat[];
        }
        setChats(chatArray);
        setFilteredChats(chatArray);
      }
    } catch (error: any) {
      showError(error.message || "Failed to fetch chats");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Conversations</h1>
        <p className="text-muted-foreground mt-2">
          View your chat history with the AI assistant
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={fetchChats} variant="outline">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Conversations</CardDescription>
            <CardTitle className="text-3xl">{chats.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Search Results</CardDescription>
            <CardTitle className="text-3xl">{filteredChats.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Quick Action</CardDescription>
            <Button
              className="mt-2 w-full"
              onClick={() => router.push("/student")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </CardHeader>
        </Card>
      </div>

      {/* Chat List */}
      {filteredChats.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Start a new conversation with the AI assistant"}
              </p>
              {!searchQuery && (
                <Button onClick={() => router.push("/student")}>
                  Start Your First Chat
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredChats.map((chat, index) => (
            <Card
              key={chat._id || index}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/student/message/${chat._id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {formatDate(chat.createdAt)}
                      </CardDescription>
                    </div>
                    <CardTitle className="text-base mb-2">
                      {truncateText(chat.question, 80)}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Answer:{" "}
                    </span>
                    {truncateText(chat.answer, 200)}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/student/message/${chat._id}`);
                    }}
                  >
                    View Full Conversation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
