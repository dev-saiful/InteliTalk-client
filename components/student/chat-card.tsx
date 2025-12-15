import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatCardProps {
  id: string;
  question: string;
  answer: string;
  timestamp?: string;
  onClick?: () => void;
}

export function ChatCard({
  id,
  question,
  answer,
  timestamp,
  onClick,
}: ChatCardProps) {
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <Card
      className="hover:shadow-lg transition-all cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                {formatDate(timestamp)}
              </CardDescription>
            </div>
            <CardTitle className="text-base group-hover:text-primary transition-colors">
              {truncateText(question, 80)}
            </CardTitle>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {truncateText(answer, 200)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface ChatListProps {
  chats: Array<{
    _id: string;
    question: string;
    answer: string;
    createdAt?: string;
  }>;
  onChatClick: (chatId: string) => void;
}

export function ChatList({ chats, onChatClick }: ChatListProps) {
  if (chats.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
        <p className="text-muted-foreground">
          Start a new conversation with the AI assistant
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {chats.map((chat) => (
        <ChatCard
          key={chat._id}
          id={chat._id}
          question={chat.question}
          answer={chat.answer}
          timestamp={chat.createdAt}
          onClick={() => onChatClick(chat._id)}
        />
      ))}
    </div>
  );
}
