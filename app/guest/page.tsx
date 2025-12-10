'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorMessage } from '@/components/ui/error-message';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { guestService } from '@/lib/api-services';
import { useToast } from '@/hooks/use-toast-custom';

export default function GuestPage() {
  const [question, setQuestion] = useState('');
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      showError('Please enter a question');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await guestService.askQuestion(question);
      
      if (response.success && response.ans) {
        setAnswer(response.ans);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get answer. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-primary p-4">
                <MessageSquare className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">InteliTalk Guest Portal</h1>
            <p className="text-muted-foreground text-lg">
              Ask questions and get AI-powered answers instantly
            </p>
          </div>

          {/* Question Input Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>
                Enter your question below and our AI will provide you with an answer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <ErrorMessage message={error} />}
                
                <Textarea
                  placeholder="What would you like to know?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  className="resize-none"
                />
                
                <Button 
                  type="submit" 
                  disabled={isLoading || !question.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding Answer...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Ask Question
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Answer Card */}
          {(isLoading || answer) && (
            <Card>
              <CardHeader>
                <CardTitle>Answer</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed">{answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {!answer && !isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fast Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get instant AI-powered answers to your questions
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">No Account Needed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Use our guest portal without signing up
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Accurate Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Powered by advanced AI and RAG technology
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
