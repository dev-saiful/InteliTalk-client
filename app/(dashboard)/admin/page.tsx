"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Loader2,
  Upload,
  GraduationCap,
  UserCog,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { adminService } from "@/lib/api-services";
import { useToast } from "@/hooks/use-toast-custom";
import { UploadPdfDialog } from "@/components/admin/upload-pdf-dialog";
import type { User } from "@/lib/types";

export default function AdminDashboard() {
  const router = useRouter();
  const { showError } = useToast();
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalTeachers, setTotalTeachers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      if (response.success && response.data) {
        const users = response.data;
        setTotalUsers(users.length);
        setTotalStudents(
          users.filter((user: User) => user.role === "Student").length
        );
        setTotalTeachers(
          users.filter((user: User) => user.role === "Teacher").length
        );
      }
    } catch (error: any) {
      showError(error.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Users",
      value: loading ? "--" : totalUsers.toString(),
      icon: Users,
      description: "All users in system",
    },
    {
      title: "Total Students",
      value: loading ? "--" : totalStudents.toString(),
      icon: GraduationCap,
      description: "Registered students",
    },
    {
      title: "Total Teachers",
      value: loading ? "--" : totalTeachers.toString(),
      icon: UserCog,
      description: "Registered teachers",
    },
    {
      title: "PDF Documents",
      value: "--",
      icon: FileText,
      description: "Uploaded documents",
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Manage users and documents.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upload PDF Section */}
      {showUploadDialog && (
        <div className="mb-8">
          <UploadPdfDialog
            onSuccess={() => {
              setShowUploadDialog(false);
            }}
          />
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={() => router.push("/admin/users")}
          >
            <Users className="mr-2 h-4 w-4" />
            All Users
          </Button>
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={() => router.push("/admin/students")}
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Manage Students
          </Button>
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={() => router.push("/admin/teachers")}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Manage Teachers
          </Button>
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={() => setShowUploadDialog(!showUploadDialog)}
          >
            <Upload className="mr-2 h-4 w-4" />
            {showUploadDialog ? "Hide Upload" : "Upload PDF"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
