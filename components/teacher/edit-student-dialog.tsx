"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { teacherService } from "@/lib/api-services";
import { useToast } from "@/hooks/use-toast-custom";
import { Loader2 } from "lucide-react";
import type { User, Department } from "@/lib/types";

interface EditStudentDialogProps {
  student: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function EditStudentDialog({
  student,
  open,
  onOpenChange,
  onSuccess,
}: EditStudentDialogProps) {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dept: "" as Department,
    studentId: "",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        dept: student.dept || ("" as Department),
        studentId: student.studentId || "",
      });
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!student) return;

    try {
      setLoading(true);
      const updateData = {
        name: formData.name,
        email: formData.email,
        dept: formData.dept,
        studentId: formData.studentId,
      };

      const response = await teacherService.updateStudent(
        student._id,
        updateData
      );
      if (response.success) {
        showSuccess("Student updated successfully");
        onOpenChange(false);
        onSuccess();
      }
    } catch (error: any) {
      showError(error.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>Update student information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-studentId">Student ID</Label>
                <Input
                  id="edit-studentId"
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-dept">Department</Label>
                <Select
                  value={formData.dept}
                  onValueChange={(value) =>
                    setFormData({ ...formData, dept: value as Department })
                  }
                >
                  <SelectTrigger id="edit-dept">
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
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
