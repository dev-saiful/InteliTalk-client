"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminService } from "@/lib/api-services";
import { useToast } from "@/hooks/use-toast-custom";
import { Loader2 } from "lucide-react";
import type { UserRole, Department } from "@/lib/types";

interface CreateStudentDialogProps {
  onSuccess: () => void;
}

const departments: Department[] = [
  "CSE",
  "LAW",
  "BANGLA",
  "BBA",
  "NAVAL",
  "CIVIL",
  "MECHANICAL",
  "EEE",
];

export function CreateStudentDialog({ onSuccess }: CreateStudentDialogProps) {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    dept: "" as Department,
    role: "Student" as UserRole,
  });

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studentData.password !== studentData.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await adminService.createStudent(studentData);
      if (response.success) {
        showSuccess("Student created successfully");
        setStudentData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          studentId: "",
          dept: "" as Department,
          role: "Student" as UserRole,
        });
        onSuccess();
      }
    } catch (error: any) {
      showError(error.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Student</CardTitle>
        <CardDescription>Add a new student to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student-name">Name</Label>
              <Input
                id="student-name"
                required
                value={studentData.name}
                onChange={(e) =>
                  setStudentData({ ...studentData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-email">Email</Label>
              <Input
                id="student-email"
                type="email"
                required
                value={studentData.email}
                onChange={(e) =>
                  setStudentData({ ...studentData, email: e.target.value })
                }
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
                onChange={(e) =>
                  setStudentData({ ...studentData, studentId: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-dept">Department</Label>
              <Select
                value={studentData.dept}
                onValueChange={(value) =>
                  setStudentData({ ...studentData, dept: value as Department })
                }
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
                onChange={(e) =>
                  setStudentData({ ...studentData, password: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-confirm-password">Confirm Password</Label>
              <Input
                id="student-confirm-password"
                type="password"
                required
                value={studentData.confirmPassword}
                onChange={(e) =>
                  setStudentData({
                    ...studentData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Student
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
