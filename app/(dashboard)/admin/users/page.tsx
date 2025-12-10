"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2, Loader2, UserPlus } from "lucide-react"
import { adminService } from "@/lib/api-services"
import type { User } from "@/lib/types"
import { useToast } from "@/hooks/use-toast-custom"
import { CreateUserDialog } from "@/components/admin/create-user-dialog"
import { EditUserDialog } from "@/components/admin/edit-user-dialog"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAllUsers()
      if (response.success && response.data) {
        setUsers(response.data)
      }
    } catch (error: any) {
      showError(error.message || "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    
    try {
      const response = await adminService.deleteUser(id)
      if (response.success) {
        showSuccess("User deleted successfully")
        fetchUsers()
      }
    } catch (error: any) {
      showError(error.message || "Failed to delete user")
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setShowEditDialog(true)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      Student: "bg-blue-100 text-blue-800",
      Teacher: "bg-purple-100 text-purple-800",
      Admin: "bg-red-100 text-red-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-2">Manage all users in the system</p>
      </div>

      {showCreateDialog && (
        <div className="mb-6">
          <CreateUserDialog onSuccess={() => {
            setShowCreateDialog(false)
            fetchUsers()
          }} />
        </div>
      )}

      <EditUserDialog
        user={editingUser}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={fetchUsers}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Total: {users.length} users</CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(!showCreateDialog)}>
              <UserPlus className="mr-2 h-4 w-4" />
              {showCreateDialog ? "Hide Form" : "Add New User"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
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
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{user.dept || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(user)}
                          title="Edit user"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(user._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
