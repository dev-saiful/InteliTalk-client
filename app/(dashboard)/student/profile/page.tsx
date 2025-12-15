"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  User,
  Loader2,
  Mail,
  BookOpen,
  Hash,
  Edit2,
  X,
  Check,
} from "lucide-react";
import { studentService } from "@/lib/api-services";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast-custom";
import type { User as UserType, UpdateUserData } from "@/lib/types";

export default function StudentProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const [profile, setProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<UpdateUserData>({
    name: "",
    email: "",
    dept: "CSE",
    studentId: "",
  });

  useEffect(() => {
    if (user?._id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const response = await studentService.getStudentProfile(user._id);
      if (response.success) {
        const profileData = response.data || response.user;
        if (profileData) {
          setProfile(profileData);
          setFormData({
            name: profileData.name,
            email: profileData.email,
            dept: profileData.dept,
            studentId: profileData.studentId || "",
          });
        }
      }
    } catch (error: any) {
      showError(error.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?._id) return;

    try {
      setSaving(true);
      const response = await studentService.updateStudentProfile(
        user._id,
        formData
      );
      if (response.success) {
        showSuccess("Profile updated successfully");
        const updatedProfile = response.data || response.user;
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
        setIsEditing(false);
      }
    } catch (error: any) {
      showError(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        dept: profile.dept,
        studentId: profile.studentId || "",
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 md:p-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Profile not found
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your profile information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Your personal details and student information
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving} size="sm">
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    disabled={saving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData({ ...formData, studentId: e.target.value })
                    }
                    placeholder="Enter your student ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dept">Department</Label>
                  <select
                    id="dept"
                    value={formData.dept}
                    onChange={(e) =>
                      setFormData({ ...formData, dept: e.target.value as any })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="CSE">Computer Science & Engineering</option>
                    <option value="LAW">Law</option>
                    <option value="BANGLA">Bangla</option>
                    <option value="BBA">Business Administration</option>
                    <option value="NAVAL">Naval Architecture</option>
                    <option value="CIVIL">Civil Engineering</option>
                    <option value="MECHANICAL">Mechanical Engineering</option>
                    <option value="EEE">
                      Electrical & Electronic Engineering
                    </option>
                  </select>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </p>
                    <p className="text-base font-semibold mt-1">
                      {profile.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </p>
                    <p className="text-base font-semibold mt-1">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Student ID
                    </p>
                    <p className="text-base font-semibold mt-1">
                      {profile.studentId || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Department
                    </p>
                    <p className="text-base font-semibold mt-1">
                      {profile.dept}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push("/student")}
              >
                Dashboard
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push("/student/chats")}
              >
                My Conversations
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push("/change-password")}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium">{profile.role}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
