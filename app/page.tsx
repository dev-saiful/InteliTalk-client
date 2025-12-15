"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Users,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { authService } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case "Admin":
          router.push("/admin");
          break;
        case "Teacher":
          router.push("/teacher");
          break;
        case "Student":
          router.push("/student");
          break;
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-accent/5">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                I
              </span>
            </div>
            <span className="text-lg font-bold">InteliTalk</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/guest">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            InteliTalk: AI Chatbot System for University Collaboration
          </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empower your university with an AI-powered chatbot for seamless
            communication and collaboration among students, teachers, and
            administrators in the campus environment.
            </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/login">
              <Button size="lg">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/guest">
              <Button size="lg" variant="outline">
                Try Guest Mode
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Key Features
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need for effective university communication
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">PDF Upload for Chat</h3>
            <p className="text-muted-foreground">
              Upload PDF documents to enable the chatbot to answer questions
              from your files.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
            <p className="text-muted-foreground">
              Customized experiences for admins, teachers, and students.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Chatbot</h3>
            <p className="text-muted-foreground">
              Get instant answers to questions about courses and university
              policies.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-muted-foreground">
              Always available to help with queries and support needs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
