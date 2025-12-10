"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { adminService } from "@/lib/api-services"
import { useToast } from "@/hooks/use-toast-custom"
import { Loader2 } from "lucide-react"
import type { UserRole, Department } from "@/lib/types"

interface CreateUserDialogProps {
  onSuccess: () => void
}

const departments: Department[] = ['CSE', 'LAW', 'BANGLA', 'BBA', 'NAVAL', 'CIVIL', 'MECHANICAL', 'EEE']

export function CreateUserDialog({ onSuccess }: CreateUserDialogProps) {
  const [loading, setLoading] = useState(false)
  const { showSuccess, showError } = useToast()
  
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    dept: "" as Department,
    role: "Student" as UserRole,
  })

  const [teacherData, setTeacherData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    teacherId: "",
    dept: "" as Department,
    role: "Teacher" as UserRole,
  })

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (studentData.password !== studentData.confirmPassword) {
      showError("Passwords do not match")
      return
    }
    
    try {
      setLoading(true)
      const response = await adminService.createStudent(studentData)
      if (response.success) {
        showSuccess("Student created successfully")
        setStudentData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          studentId: "",
          dept: "" as Department,
          role: "Student" as UserRole,
        })
        onSuccess()
      }
    } catch (error: any) {
      showError(error.message || "Failed to create student")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    if (teacherData.password !== teacherData.confirmPassword) {
      showError("Passwords do not match")
      return
    }
    
    try {
      setLoading(true)
      const response = await adminService.createTeacher(teacherData)
      if (response.success) {
        showSuccess("Teacher created successfully")
        setTeacherData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          teacherId: "",
          dept: "" as Department,
          role: "Teacher" as UserRole,
        })
        onSuccess()
      }
    } catch (error: any) {
      showError(error.message || "Failed to create teacher")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
        <CardDescription>Add a new student or teacher to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="student">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="teacher">Teacher</TabsTrigger>
          </TabsList>
          
          <TabsContent value="student">
            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Name</Label>
                  <Input
                    id="student-name"
                    required
                    value={studentData.name}
                    onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    required
                    value={studentData.email}
                    onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-id">Student ID</Label>
                  <Input
                    id="student-id"
                    required
                    value={studentData.studentId}
                    onChange={(e) => setStudentData({ ...studentData, studentId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-dept">Department</Label>
                  <Select
                    value={studentData.dept}
                    onValueChange={(value) => setStudentData({ ...studentData, dept: value as Department })}
                  >
                    <SelectTrigger id="student-dept">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <Input
                    id="student-password"
                    type="password"
                    required
                    value={studentData.password}
                    onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-confirm-password">Confirm Password</Label>
                  <Input
                    id="student-confirm-password"
                    type="password"
                    required
                    value={studentData.confirmPassword}
                    onChange={(e) => setStudentData({ ...studentData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Student
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="teacher">
            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher-name">Name</Label>
                  <Input
                    id="teacher-name"
                    required
                    value={teacherData.name}
                    onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-email">Email</Label>
                  <Input
                    id="teacher-email"
                    type="email"
                    required
                    value={teacherData.email}
                    onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher-id">Teacher ID</Label>
                  <Input
                    id="teacher-id"
                    required
                    value={teacherData.teacherId}
                    onChange={(e) => setTeacherData({ ...teacherData, teacherId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-dept">Department</Label>
                  <Select
                    value={teacherData.dept}
                    onValueChange={(value) => setTeacherData({ ...teacherData, dept: value as Department })}
                  >
                    <SelectTrigger id="teacher-dept">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher-password">Password</Label>
                  <Input
                    id="teacher-password"
                    type="password"
                    required
                    value={teacherData.password}
                    onChange={(e) => setTeacherData({ ...teacherData, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-confirm-password">Confirm Password</Label>
                  <Input
                    id="teacher-confirm-password"
                    type="password"
                    required
                    value={teacherData.confirmPassword}
                    onChange={(e) => setTeacherData({ ...teacherData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Teacher
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
