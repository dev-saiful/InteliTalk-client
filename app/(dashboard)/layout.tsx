"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authService } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setUserRole(user?.role || null);
  }, []);

  // Dynamic navigation based on role
  const getNavigationItems = () => {
    switch (userRole) {
      case "Admin":
        return [
          { label: "Dashboard", href: "/admin" },
          { label: "Users", href: "/admin/users" },
          { label: "Students", href: "/admin/students" },
          { label: "Teachers", href: "/admin/teachers" },
        ];
      case "Teacher":
        return [
          { label: "Dashboard", href: "/teacher" },
          { label: "Students", href: "/teacher/students" },
        ];
      case "Student":
        return [
          { label: "Dashboard", href: "/student" },
          { label: "Profile", href: "/student/profile" },
          { label: "Chats", href: "/student/chats" },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = async () => {
    try {
      await authService.logout();
      authService.removeUser();
    } catch (error) {
      console.error("Logout failed", error);
      authService.removeUser();
    } finally {
      router.push("/login");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">
                I
              </span>
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">
              InteliTalk
            </span>
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

        <div className="p-4 border-t border-sidebar-border">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/20"
          >
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
              <span className="text-primary-foreground font-bold text-sm">
                I
              </span>
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
                    <span className="text-primary-foreground font-bold text-sm">
                      I
                    </span>
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
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm hover:bg-muted"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
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
  );
}
