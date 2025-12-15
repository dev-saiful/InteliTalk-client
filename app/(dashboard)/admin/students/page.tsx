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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, Loader2, UserPlus } from "lucide-react";
import { adminService } from "@/lib/api-services";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast-custom";
import { CreateStudentDialog } from "@/components/admin/create-student-dialog";
import { EditUserDialog } from "@/components/admin/edit-user-dialog";

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      if (response.success && response.data) {
        // Filter only students
        const studentUsers = response.data.filter(
          (user: User) => user.role === "Student"
        );
        setStudents(studentUsers);
      }
    } catch (error: any) {
      showError(error.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const response = await adminService.deleteUser(id);
      if (response.success) {
        showSuccess("Student deleted successfully");
        fetchStudents();
      }
    } catch (error: any) {
      showError(error.message || "Failed to delete student");
    }
  };

  const handleEdit = (student: User) => {
    setEditingStudent(student);
    setShowEditDialog(true);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.dept?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Student Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage all students in the system
        </p>
      </div>

      {showCreateDialog && (
        <div className="mb-6">
          <CreateStudentDialog
            onSuccess={() => {
              setShowCreateDialog(false);
              fetchStudents();
            }}
          />
        </div>
      )}

      <EditUserDialog
        user={editingStudent}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={fetchStudents}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Students</CardTitle>
              <CardDescription>
                Total: {students.length} students
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(!showCreateDialog)}>
              <UserPlus className="mr-2 h-4 w-4" />
              {showCreateDialog ? "Hide Form" : "Add New Student"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, student ID, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.studentId}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{student.dept}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(student)}
                            title="Edit student"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(student._id)}
                            title="Delete student"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
