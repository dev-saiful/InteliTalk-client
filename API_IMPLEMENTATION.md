# InteliTalk Client - Real API Implementation

## Overview

This document provides a comprehensive overview of the real API integration implemented in the InteliTalk client application.

## API Configuration

### Base URL

- **Environment Variable**: `NEXT_PUBLIC_API_URL`
- **Default**: `http://localhost:5001/api/v1`
- **Configuration File**: `.env.local`

### API Client (`lib/api-client.ts`)

The API client handles all HTTP requests with:

- **Authentication**: Cookie-based authentication with `credentials: 'include'`
- **Error Handling**: Centralized error handling with proper error types
- **Type Safety**: Full TypeScript support with generic types
- **Methods**: GET, POST, PUT, DELETE, and multipart/form-data upload

## API Services (`lib/api-services.ts`)

### 1. Authentication Service (`authService`)

#### Login

- **Endpoint**: `POST /login`
- **Parameters**: `{ email: string, password: string }`
- **Returns**: User data with token

#### Logout

- **Endpoint**: `POST /logout`
- **Parameters**: None
- **Returns**: Success message

#### Change Password

- **Endpoint**: `POST /change-password`
- **Parameters**: `{ password: string, newPassword: string }`
- **Returns**: Success message

### 2. Admin Service (`adminService`)

#### Get Dashboard

- **Endpoint**: `GET /admin`
- **Returns**: Dashboard data

#### Get All Users

- **Endpoint**: `GET /admin/user`
- **Returns**: Array of all users

#### Get User by ID

- **Endpoint**: `GET /admin/user/:id`
- **Parameters**: User ID
- **Returns**: User data

#### Update User

- **Endpoint**: `PUT /admin/user/:id`
- **Parameters**: User ID, update data
- **Returns**: Updated user data

#### Delete User

- **Endpoint**: `DELETE /admin/user/:id`
- **Parameters**: User ID
- **Returns**: Success message

#### Create Student

- **Endpoint**: `POST /admin/student-signup`
- **Parameters**: Student signup data
- **Returns**: Created student data

#### Create Teacher

- **Endpoint**: `POST /admin/teacher-signup`
- **Parameters**: Teacher signup data
- **Returns**: Created teacher data

#### Upload Public PDF

- **Endpoint**: `POST /admin/public/upload/pdf`
- **Parameters**: PDF file (FormData)
- **Returns**: Upload response with file details

#### Upload Private PDF

- **Endpoint**: `POST /admin/private/upload/pdf`
- **Parameters**: PDF file (FormData)
- **Returns**: Upload response with file details

### 3. Teacher Service (`teacherService`)

#### Get Dashboard

- **Endpoint**: `GET /teacher`
- **Returns**: Dashboard data

#### Create Student

- **Endpoint**: `POST /teacher/student-signup`
- **Parameters**: Student signup data
- **Returns**: Created student data

#### Get All Students

- **Endpoint**: `GET /teacher/students`
- **Returns**: Array of all students

#### Get Student by ID

- **Endpoint**: `GET /teacher/student/:id`
- **Parameters**: Student ID
- **Returns**: Student data

#### Update Student

- **Endpoint**: `PUT /teacher/student/:id`
- **Parameters**: Student ID, update data
- **Returns**: Updated student data

#### Delete Student

- **Endpoint**: `DELETE /teacher/student/:id`
- **Parameters**: Student ID
- **Returns**: Success message

### 4. Student Service (`studentService`)

#### Get Dashboard

- **Endpoint**: `GET /student`
- **Returns**: Dashboard data

#### Ask Question

- **Endpoint**: `GET /student?question=...`
- **Parameters**: Question string (URL encoded)
- **Returns**: AI-generated answer

#### Get Chats

- **Endpoint**: `GET /student/message/:userId`
- **Parameters**: User ID
- **Returns**: Array of chat history

#### Get Student Profile

- **Endpoint**: `GET /student/:id`
- **Parameters**: Student ID
- **Returns**: Student profile data

#### Update Student Profile

- **Endpoint**: `PUT /student/:id`
- **Parameters**: Student ID, update data
- **Returns**: Updated student data

### 5. Guest Service (`guestService`)

#### Ask Question

- **Endpoint**: `GET /guest?question=...`
- **Parameters**: Question string (URL encoded)
- **Returns**: AI-generated answer

## Pages Using Real API

### Authentication Pages

#### Login Page (`app/(auth)/login/page.tsx`)

- ✅ Uses `authService.login()`
- ✅ Handles authentication and role-based redirection
- ✅ Stores user data in localStorage
- ✅ Displays error messages

#### Change Password Page (`app/(auth)/change-password/page.tsx`)

- ✅ Uses `authService.changePassword()`
- ✅ Form validation with password confirmation
- ✅ Success/error toast notifications

### Admin Pages

#### Admin Dashboard (`app/(dashboard)/admin/page.tsx`)

- ✅ Uses `adminService.getAllUsers()` to get total user count
- ✅ Displays real-time statistics
- ✅ Loading states

#### Users Management Page (`app/(dashboard)/admin/users/page.tsx`)

- ✅ Uses `adminService.getAllUsers()`
- ✅ Uses `adminService.deleteUser()`
- ✅ Create user dialog with student/teacher creation
- ✅ Search and filter functionality
- ✅ Real-time data updates

#### Create User Dialog (`components/admin/create-user-dialog.tsx`)

- ✅ Uses `adminService.createStudent()`
- ✅ Uses `adminService.createTeacher()`
- ✅ Tabbed interface for student/teacher
- ✅ Form validation
- ✅ Type-safe with proper TypeScript types

### Teacher Pages

#### Teacher Dashboard (`app/(dashboard)/teacher/page.tsx`)

- ✅ Uses `teacherService.getAllStudents()`
- ✅ Displays student statistics
- ✅ Quick access to student management

#### Teacher Students Page (`app/(dashboard)/teacher/students/page.tsx`)

- ✅ Uses `teacherService.getAllStudents()`
- ✅ Uses `teacherService.deleteStudent()`
- ✅ Search and filter functionality
- ✅ Student list with details

### Student Pages

#### Student Dashboard (`app/(dashboard)/student/page.tsx`)

- ✅ UI ready for chat integration
- ✅ Quick links to features

#### Student Messages Page (`app/(dashboard)/student/message/[id]/page.tsx`)

- ✅ Uses `studentService.getChats()`
- ✅ Displays chat history
- ✅ Question and answer formatting

### Guest Page

#### Guest Chat Page (`app/guest/page.tsx`)

- ✅ Uses `guestService.askQuestion()`
- ✅ Real-time AI responses
- ✅ User-friendly interface
- ✅ Loading states

## Authentication System

### Auth Hook (`hooks/use-auth.ts`)

- ✅ Manages user state
- ✅ Handles login/logout
- ✅ Role-based routing
- ✅ localStorage persistence
- ✅ Authentication checks

### Auth Utilities (`lib/auth.ts`)

- ✅ User storage management
- ✅ Role checking
- ✅ Authentication status

## Type Safety

All API calls are fully typed using TypeScript interfaces defined in `lib/types.ts`:

- `User`: User data structure
- `Chat`: Chat message structure
- `LoginCredentials`: Login form data
- `SignupData`: User creation data
- `ChangePasswordData`: Password change data
- `UpdateUserData`: User update data
- `UploadResponse`: File upload response
- `ApiResponse<T>`: Generic API response wrapper
- `ApiError`: Error response structure

## Error Handling

All API calls include proper error handling with:

- Try-catch blocks
- User-friendly error messages
- Toast notifications
- Loading states
- Form validation

## Features Implemented

✅ **Authentication**

- Login with email/password
- Logout
- Change password
- Role-based access control

✅ **Admin Features**

- User management (CRUD)
- Student creation
- Teacher creation
- Dashboard statistics
- PDF upload (UI ready)

✅ **Teacher Features**

- Student management
- Student creation
- View student details
- Dashboard with statistics

✅ **Student Features**

- Chat with AI
- View chat history
- Profile management (ready)

✅ **Guest Features**

- Ask questions to AI
- Get instant answers

## Testing Checklist

Before testing, ensure:

1. ✅ Server is running on `http://localhost:5001`
2. ✅ Environment variable is set in `.env.local`
3. ✅ MongoDB is connected
4. ✅ Redis is running (for queue processing)
5. ✅ ChromaDB is configured
6. ✅ API keys are set in server `.env`

## Next Steps

To test the implementation:

1. **Start the server:**

   ```bash
   cd server
   npm run dev
   ```

2. **Start the client:**

   ```bash
   cd client
   npm run dev
   ```

3. **Test the features:**
   - Login with existing credentials
   - Test admin user management
   - Test teacher student management
   - Test student chat functionality
   - Test guest chat

## Notes

- All API calls use cookie-based authentication
- CORS is configured in the server
- File uploads use FormData for multipart requests
- All responses follow the standard `ApiResponse<T>` structure
- Error messages are user-friendly and informative
- Loading states are implemented throughout the UI
