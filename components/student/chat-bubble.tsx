import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export function ChatBubble({ message, isUser, timestamp }: ChatBubbleProps) {
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={isUser ? "bg-primary" : "bg-muted"}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={`flex flex-col gap-1 max-w-[80%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-lg px-4 py-3 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap wrap-break-words">{message}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground px-2">
            {new Date(timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
}

interface ChatConversationProps {
  question: string;
  answer: string;
  timestamp?: string;
}

export function ChatConversation({
  question,
  answer,
  timestamp,
}: ChatConversationProps) {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6 space-y-4">
        <ChatBubble message={question} isUser={true} timestamp={timestamp} />
        <ChatBubble message={answer} isUser={false} />
      </CardContent>
    </Card>
  );
}
