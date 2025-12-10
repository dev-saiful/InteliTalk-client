"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, MessageSquare, HelpCircle } from "lucide-react"

export default function StudentDashboard() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome to Your Dashboard</h1>
        <p className="text-muted-foreground mt-2">Access your learning resources and AI assistant</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Chat Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Chat Assistant
              </CardTitle>
              <CardDescription>Ask questions and get instant answers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Use our AI-powered chat assistant to get help with your coursework, ask questions about topics,
                and receive personalized learning support.
              </p>
              <Button className="w-full">
                Start New Conversation
              </Button>
            </CardContent>
          </Card>

          {/* Learning Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Resources
              </CardTitle>
              <CardDescription>Access course materials and documents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Browse and search through uploaded course materials, textbooks, and learning resources
                provided by your instructors.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access frequently used features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              My Conversations
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
