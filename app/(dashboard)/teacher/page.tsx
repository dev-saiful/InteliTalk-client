"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, MessageSquare, Clock, Loader2 } from "lucide-react"
import { teacherService } from "@/lib/api-services"
import type { User } from "@/lib/types"
import { useToast } from "@/hooks/use-toast-custom"
import Link from "next/link"

export default function TeacherDashboard() {
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { showError } = useToast()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await teacherService.getAllStudents()
      if (response.success && response.data) {
        setStudents(response.data)
      }
    } catch (error: any) {
      showError(error.message || "Failed to fetch students")
    } finally {
      setLoading(false)
    }
  }

  const teacherStats = [
    { title: "My Students", value: loading ? "..." : students.length.toString(), icon: Users },
    { title: "Courses", value: "8", icon: BookOpen },
    { title: "Messages", value: "12", icon: MessageSquare },
    { title: "Pending Tasks", value: "5", icon: Clock },
  ]

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your students and courses</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {teacherStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Students</CardTitle>
              <CardDescription>View and manage your students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : students.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No students found</p>
                ) : (
                  students.slice(0, 3).map((student) => (
                    <div key={student._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  ))
                )}
                <Link href="/teacher/students">
                  <Button variant="outline" className="w-full">
                    View All Students
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              + Create Assignment
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              + View Submissions
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              + Grade Students
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              + Send Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
