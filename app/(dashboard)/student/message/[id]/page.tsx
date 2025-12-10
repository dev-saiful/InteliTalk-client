"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { studentService } from "@/lib/api-services"
import { useToast } from "@/hooks/use-toast-custom"

export default function MessagePage({ params }: { params: { id: string } }) {
  const [chatData, setChatData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { showError } = useToast()

  useEffect(() => {
    fetchChat()
  }, [params.id])

  const fetchChat = async () => {
    try {
      setLoading(true)
      const response = await studentService.getChats(params.id)
      if (response.success) {
        setChatData(response.chats || response.data)
      }
    } catch (error: any) {
      showError(error.message || "Failed to fetch chat")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Chat History</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          {!chatData || (Array.isArray(chatData) && chatData.length === 0) ? (
            <p className="text-center text-muted-foreground py-8">No chat history found</p>
          ) : (
            <div className="space-y-4">
              {Array.isArray(chatData) ? (
                chatData.map((chat: any, index: number) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="mb-2">
                      <p className="font-semibold text-sm text-muted-foreground">Question:</p>
                      <p className="mt-1">{chat.question || chat.input}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground">Answer:</p>
                      <p className="mt-1 text-muted-foreground">{chat.answer || chat.output}</p>
                    </div>
                  </div>
                ))
              ) : (
                <pre className="text-sm overflow-auto">{JSON.stringify(chatData, null, 2)}</pre>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
