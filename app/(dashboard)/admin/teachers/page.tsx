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
import { CreateTeacherDialog } from "@/components/admin/create-teacher-dialog";
import { EditUserDialog } from "@/components/admin/edit-user-dialog";

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      if (response.success && response.data) {
        // Filter only teachers
        const teacherUsers = response.data.filter(
          (user: User) => user.role === "Teacher"
        );
        setTeachers(teacherUsers);
      }
    } catch (error: any) {
      showError(error.message || "Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;

    try {
      const response = await adminService.deleteUser(id);
      if (response.success) {
        showSuccess("Teacher deleted successfully");
        fetchTeachers();
      }
    } catch (error: any) {
      showError(error.message || "Failed to delete teacher");
    }
  };

  const handleEdit = (teacher: User) => {
    setEditingTeacher(teacher);
    setShowEditDialog(true);
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.dept?.toLowerCase().includes(searchTerm.toLowerCase())
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
          Teacher Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage all teachers in the system
        </p>
      </div>

      {showCreateDialog && (
        <div className="mb-6">
          <CreateTeacherDialog
            onSuccess={() => {
              setShowCreateDialog(false);
              fetchTeachers();
            }}
          />
        </div>
      )}

      <EditUserDialog
        user={editingTeacher}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={fetchTeachers}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Teachers</CardTitle>
              <CardDescription>
                Total: {teachers.length} teachers
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(!showCreateDialog)}>
              <UserPlus className="mr-2 h-4 w-4" />
              {showCreateDialog ? "Hide Form" : "Add New Teacher"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, teacher ID, or department..."
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
                  <TableHead>Teacher ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No teachers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher._id}>
                      <TableCell className="font-medium">
                        {teacher.name}
                      </TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{teacher.teacherId}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{teacher.dept}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(teacher)}
                            title="Edit teacher"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(teacher._id)}
                            title="Delete teacher"
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
