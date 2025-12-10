"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, LogOut, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigationItems = [
  { label: "Admin", href: "/admin", section: "admin" },
  { label: "Users", href: "/admin/users", section: "admin" },
  { label: "Teacher", href: "/teacher", section: "teacher" },
  { label: "My Students", href: "/teacher/students", section: "teacher" },
  { label: "Student", href: "/student", section: "student" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">I</span>
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">InteliTalk</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/20"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/20">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex flex-col flex-1">
        <div className="flex items-center justify-between h-16 px-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">I</span>
            </div>
            <span className="font-bold">InteliTalk</span>
          </div>
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">I</span>
                  </div>
                  <span className="text-lg font-bold">InteliTalk</span>
                </div>
              </div>
              <nav className="p-4 space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>

      {/* Main Content - Desktop */}
      <div className="hidden md:flex flex-col flex-1">
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
