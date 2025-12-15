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
  BookOpen,
  MessageSquare,
  Clock,
  Loader2,
  UserPlus,
  TrendingUp,
} from "lucide-react";
import { teacherService } from "@/lib/api-services";
import type { User, DepartmentStats, PaginationInfo } from "@/lib/types";
import { useToast } from "@/hooks/use-toast-custom";
import { CreateStudentDialog } from "@/components/teacher/create-student-dialog";
import Link from "next/link";

export default function TeacherDashboard() {
  const [students, setStudents] = useState<User[]>([]);
  const [departmentStats, setDepartmentStats] =
    useState<DepartmentStats | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    fetchStudents();
    fetchDepartmentStats();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await teacherService.getAllStudents({
        page: 1,
        limit: 10,
        sortBy: "name",
        sortOrder: "asc",
      });
      if (response.success && response.data) {
        setStudents(response.data);
        setPagination(response.pagination);
      }
    } catch (error: any) {
      showError(error.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentStats = async () => {
    try {
      setStatsLoading(true);
      const response = await teacherService.getDepartmentStats();
      if (response.success && response.data) {
        setDepartmentStats(response.data);
      }
    } catch (error: any) {
      showError(error.message || "Failed to fetch department statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  // Calculate statistics from department stats API
  const teacherStats = [
    {
      title: "Total Students",
      value: statsLoading
        ? "..."
        : departmentStats?.totalStudents.toString() || "0",
      icon: Users,
      description: "Students in your department",
    },
    {
      title: "Department",
      value: statsLoading ? "..." : departmentStats?.department || "N/A",
      icon: BookOpen,
      description: "Your department",
    },
    {
      title: "Recent Enrollments",
      value: statsLoading
        ? "..."
        : departmentStats?.recentStudents.length.toString() || "0",
      icon: TrendingUp,
      description: "Latest 5 students",
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Teacher Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your students and courses
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {teacherStats.map((stat) => {
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
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Students</CardTitle>
              <CardDescription>
                {pagination
                  ? `Showing ${students.length} of ${pagination.totalStudents} students in your department`
                  : "View and manage your students"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : students.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No students found in your department
                  </p>
                ) : (
                  students.slice(0, 5).map((student) => (
                    <div
                      key={student._id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.email}
                        </p>
                        {student.dept && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {student.dept}{" "}
                            {student.studentId && `• ID: ${student.studentId}`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <Link href="/teacher/students">
                  <Button variant="outline" className="w-full">
                    View All Students
                    {pagination &&
                      pagination.totalStudents > 5 &&
                      ` (${pagination.totalStudents})`}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Students Section */}
          {departmentStats && departmentStats.recentStudents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Enrollments</CardTitle>
                <CardDescription>
                  Latest students added to your department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    departmentStats.recentStudents.map((student) => (
                      <div
                        key={student._id}
                        className="flex items-center justify-between p-2 border rounded hover:bg-accent/30 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                        {student.studentId && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {student.studentId}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => setCreateDialogOpen(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Student
            </Button>
            <Link href="/teacher/students" className="block">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View All Students
              </Button>
            </Link>
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
            >
              + Create Assignment
            </Button>
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
            >
              + View Submissions
            </Button>
          </CardContent>
        </Card>
      </div>

      <CreateStudentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          fetchStudents();
          fetchDepartmentStats();
        }}
      />
    </div>
  );
}
