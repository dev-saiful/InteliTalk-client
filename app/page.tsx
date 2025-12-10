import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, MessageSquare, HelpCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-accent/5">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">I</span>
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
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">InteliTalk: AI Chatbot System for University Collaboration</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empower your university with an AI-powered chatbot for seamless communication, collaboration, and course management among students, teachers, and administrators.
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

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose InteliTalk?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
        {
          icon: Users,
          title: "Campus-wide Collaboration",
          description: "Connect students, faculty, and staff for streamlined communication and teamwork across departments."
        },
        {
          icon: BookOpen,
          title: "Academic Assistance",
          description: "Get instant help with course materials, schedules, and assignments through AI-powered chat."
        },
        {
          icon: MessageSquare,
          title: "24/7 Smart Chatbot",
          description: "Access reliable answers and support anytime for university-related queries and services."
        },
        {
          icon: HelpCircle,
          title: "Personalized Guidance",
          description: "Receive tailored recommendations and reminders for events, deadlines, and campus resources."
        },
          ].map((feature) => {
        const Icon = feature.icon
        return (
          <div
            key={feature.title}
            className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card transition"
          >
            <Icon className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
        <div className="rounded-lg bg-primary/10 border border-primary/20 p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the Future of University Communication</h2>
          <p className="text-muted-foreground mb-8">Sign in to InteliTalk and empower your campus with intelligent, AI-driven conversations.</p>
          <Link href="/login">
        <Button size="lg">Sign In to InteliTalk</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
