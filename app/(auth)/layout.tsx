"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/lib/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip redirect logic for change-password page (authenticated users need access)
    if (pathname === "/change-password") {
      return;
    }

    // Check if user is already logged in
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
        default:
          router.push("/");
      }
    }
  }, [router, pathname]);

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
