# InteliTalk Client - Implementation Guide

## Completed Implementation

### ✅ Core Infrastructure

1. **API Client** (`lib/api-client.ts`)

   - Centralized HTTP client with error handling
   - Support for GET, POST, PUT, DELETE, and file uploads
   - Cookie-based authentication
   - Type-safe responses

2. **Type Definitions** (`lib/types.ts`)

   - User, Chat, Department, Role types
   - API request/response interfaces

3. **Authentication Services** (`lib/auth.ts`)

   - Login/logout functionality
   - Password change
   - Local storage user management
   - Role-based access control

4. **API Services** (`lib/api-services.ts`)

   - Admin services (user management, PDF uploads)
   - Teacher services (student management)
   - Student services (chat, profile)
   - Guest services (Q&A)

5. **Custom Hooks**

   - `useAuth` - Authentication state and operations
   - `useToast` - Toast notifications using Sonner

6. **UI Components**

   - Loading spinner
   - Error message
   - Toast/Toaster
   - App header with user menu

7. **Authentication Pages**

   - Login page with form validation
   - Change password page
   - Auth layout

8. **Guest Portal**
   - AI-powered Q&A interface
   - Real-time question submission
   - Clean, responsive UI

## Implementation Needed

### 🔨 Admin Dashboard (`/admin`)

#### Pages to Create:

1. **Dashboard Page** (`app/(dashboard)/admin/page.tsx`)

   ```tsx
   - Overview statistics
   - Recent activities
   - Quick actions (create student, teacher, upload PDF)
   ```

2. **Users Management** (`app/(dashboard)/admin/users/page.tsx`)

   ```tsx
   - User list table with search/filter
   - View/Edit/Delete functionality
   - Role badges and status indicators
   ```

3. **Students Management** (`app/(dashboard)/admin/students/page.tsx`)

   ```tsx
   - Student list with department filter
   - Create new student form (modal/drawer)
   - Edit student details
   - Delete students
   ```

4. **Teachers Management** (`app/(dashboard)/admin/teachers/page.tsx`)

   ```tsx
   - Teacher list with department filter
   - Create new teacher form
   - Edit teacher details
   - Delete teachers
   ```

5. **PDF Upload** (component in admin dashboard)
   ```tsx
   - Public PDF upload (guest collection)
   - Private PDF upload (student collection)
   - Upload progress indicator
   - File validation
   ```

### 🔨 Teacher Dashboard (`/teacher`)

#### Pages to Create:

1. **Dashboard Page** (`app/(dashboard)/teacher/page.tsx`)

   ```tsx
   - Overview of students
   - Recent activities
   - Quick access to students
   ```

2. **Students Management** (`app/(dashboard)/teacher/students/page.tsx`)

   ```tsx
   - View all students
   - Register new student
   - Edit student information
   - View student details
   ```

3. **Assignments** (`app/(dashboard)/teacher/assignments/page.tsx`)

   ```tsx
   - Create assignments
   - View submissions
   - Grade assignments
   ```

4. **Grades** (`app/(dashboard)/teacher/grades/page.tsx`)
   ```tsx
   - View and manage grades
   - Export grade reports
   ```

### 🔨 Student Dashboard (`/student`)

#### Pages to Create:

1. **Dashboard Page** (`app/(dashboard)/student/page.tsx`)

   ```tsx
   - AI Chat interface (primary feature)
   - Quick access to courses and assignments
   - Recent chat history
   ```

2. **Chat/Messages** (`app/(dashboard)/student/messages/page.tsx`)

   ```tsx
   - Full chat history
   - Search through past conversations
   - Export chat logs
   ```

3. **Individual Chat** (`app/(dashboard)/student/message/[id]/page.tsx`)

   ```tsx
   - View specific chat conversation
   - Continue conversation
   ```

4. **Courses** (`app/(dashboard)/student/courses/page.tsx`)

   ```tsx
   - Enrolled courses list
   - Course materials
   ```

5. **Assignments** (`app/(dashboard)/student/assignments/page.tsx`)

   ```tsx
   - View assignments
   - Submit assignments
   - Track grades
   ```

6. **Profile** (`app/(dashboard)/student/profile/page.tsx`)
   ```tsx
   - View and edit profile
   - Update personal information
   ```

### 🔨 Shared Components to Create

1. **User Table** (`components/users/user-table.tsx`)

   ```tsx
   - Reusable data table
   - Sorting, filtering, pagination
   - Actions column
   ```

2. **User Form** (`components/users/user-form.tsx`)

   ```tsx
   - Create/Edit user form
   - Field validation
   - Department dropdown
   - Role selection
   ```

3. **File Upload** (`components/upload/file-upload.tsx`)

   ```tsx
   - Drag & drop PDF upload
   - Progress indicator
   - File size validation
   ```

4. **Chat Interface** (`components/chat/chat-interface.tsx`)

   ```tsx
   - Message list
   - Input field
   - Send button
   - Loading states
   ```

5. **Stats Card** (`components/dashboard/stats-card.tsx`)
   ```tsx
   - Icon
   - Title
   - Value
   - Trend indicator
   ```

### 🔨 Error and Loading States

Create these files in each route:

- `loading.tsx` - Loading skeleton/spinner
- `error.tsx` - Error boundary with retry

Example structure:

```tsx
// app/(dashboard)/admin/users/loading.tsx
export default function Loading() {
  return <div>Loading users...</div>;
}

// app/(dashboard)/admin/users/error.tsx
("use client");
export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### 🔨 Protected Routes

Update `components/auth-guard.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { LoadingPage } from "@/components/ui/loading-spinner";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "Admin" | "Teacher" | "Student";
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [user, isLoading, requiredRole, router]);

  if (isLoading) {
    return <LoadingPage message="Checking authentication..." />;
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
```

### 🔨 Dashboard Layouts

Update each dashboard layout to include AuthGuard:

```tsx
// app/(dashboard)/admin/layout.tsx
import { AuthGuard } from "@/components/auth-guard";
import { AppHeader } from "@/components/app-header";

export default function AdminLayout({ children }) {
  return (
    <AuthGuard requiredRole="Admin">
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container py-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
```

## Dependencies

All required dependencies are already in `package.json`. Key packages:

- `react-hook-form` + `zod` - Form validation
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `@radix-ui/*` - UI components
- `next` - Framework

## Environment Variables

Already created `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

## API Endpoints Reference

### Authentication

- POST `/login` - Login user
- POST `/logout` - Logout user
- POST `/change-password` - Change password (authenticated)

### Admin

- GET `/admin/user` - Get all users
- GET `/admin/user/:id` - Get user by ID
- PUT `/admin/user/:id` - Update user
- DELETE `/admin/user/:id` - Delete user
- POST `/admin/student-signup` - Create student
- POST `/admin/teacher-signup` - Create teacher
- POST `/admin/public/upload/pdf` - Upload public PDF
- POST `/admin/private/upload/pdf` - Upload private PDF

### Teacher

- GET `/teacher/students` - Get all students
- GET `/teacher/student/:id` - Get student by ID
- PUT `/teacher/student/:id` - Update student
- DELETE `/teacher/student/:id` - Delete student
- POST `/teacher/student-signup` - Create student

### Student

- GET `/student?question=...` - Ask question (AI chat)
- GET `/student/message/:id` - Get chat history
- GET `/student/:id` - Get student profile
- PUT `/student/:id` - Update profile

### Guest

- GET `/guest?question=...` - Ask question (public AI chat)

## Next Steps

1. ✅ Core infrastructure (COMPLETED)
2. ✅ Authentication pages (COMPLETED)
3. ✅ Guest portal (COMPLETED)
4. 🔲 Update AuthGuard component
5. 🔲 Create dashboard layouts with AuthGuard
6. 🔲 Implement Admin dashboard and features
7. 🔲 Implement Teacher dashboard and features
8. 🔲 Implement Student dashboard and features
9. 🔲 Add loading and error states
10. 🔲 Test all functionality
11. 🔲 Add responsive design improvements
12. 🔲 Add accessibility features

## Development Server

```bash
cd client
npm run dev
```

Visit `http://localhost:3000`

## Testing

Test with backend running on `http://localhost:5001`

Make sure server is configured with CORS for `http://localhost:3000`
