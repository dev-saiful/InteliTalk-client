"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { adminService } from "@/lib/api-services"
import { useToast } from "@/hooks/use-toast-custom"
import { Loader2 } from "lucide-react"
import type { User, Department, UserRole } from "@/lib/types"

interface EditUserDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const departments: Department[] = ['CSE', 'LAW', 'BANGLA', 'BBA', 'NAVAL', 'CIVIL', 'MECHANICAL', 'EEE']

export function EditUserDialog({ user, open, onOpenChange, onSuccess }: EditUserDialogProps) {
  const [loading, setLoading] = useState(false)
  const { showSuccess, showError } = useToast()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dept: "" as Department,
    studentId: "",
    teacherId: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        dept: user.dept || "" as Department,
        studentId: user.studentId || "",
        teacherId: user.teacherId || "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    try {
      setLoading(true)
      const updateData = {
        name: formData.name,
        email: formData.email,
        dept: formData.dept,
        ...(user.role === 'Student' && formData.studentId && { studentId: formData.studentId }),
        ...(user.role === 'Teacher' && formData.teacherId && { teacherId: formData.teacherId }),
      }
      
      const response = await adminService.updateUser(user._id, updateData)
      if (response.success) {
        showSuccess("User updated successfully")
        onOpenChange(false)
        onSuccess()
      }
    } catch (error: any) {
      showError(error.message || "Failed to update user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information. {user?.role && `Role: ${user.role}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-dept">Department</Label>
              <Select
                value={formData.dept}
                onValueChange={(value) => setFormData({ ...formData, dept: value as Department })}
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
            
            {user?.role === 'Student' && (
              <div className="grid gap-2">
                <Label htmlFor="edit-student-id">Student ID</Label>
                <Input
                  id="edit-student-id"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                />
              </div>
            )}
            
            {user?.role === 'Teacher' && (
              <div className="grid gap-2">
                <Label htmlFor="edit-teacher-id">Teacher ID</Label>
                <Input
                  id="edit-teacher-id"
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                />
              </div>
            )}
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
  )
}
