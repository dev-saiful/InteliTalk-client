# InteliTalk API Quick Reference

## Authentication Endpoints

| Method | Endpoint           | Description          | Auth Required |
| ------ | ------------------ | -------------------- | ------------- |
| POST   | `/login`           | User login           | No            |
| POST   | `/logout`          | User logout          | Yes           |
| POST   | `/change-password` | Change user password | Yes           |

## Admin Endpoints

| Method | Endpoint                    | Description            | Auth Required | Role  |
| ------ | --------------------------- | ---------------------- | ------------- | ----- |
| GET    | `/admin`                    | Get admin dashboard    | Yes           | Admin |
| GET    | `/admin/user`               | Get all users          | Yes           | Admin |
| GET    | `/admin/user/:id`           | Get user by ID         | Yes           | Admin |
| PUT    | `/admin/user/:id`           | Update user            | Yes           | Admin |
| DELETE | `/admin/user/:id`           | Delete user            | Yes           | Admin |
| POST   | `/admin/student-signup`     | Create student account | Yes           | Admin |
| POST   | `/admin/teacher-signup`     | Create teacher account | Yes           | Admin |
| POST   | `/admin/public/upload/pdf`  | Upload public PDF      | Yes           | Admin |
| POST   | `/admin/private/upload/pdf` | Upload private PDF     | Yes           | Admin |

## Teacher Endpoints

| Method | Endpoint                  | Description            | Auth Required | Role    |
| ------ | ------------------------- | ---------------------- | ------------- | ------- |
| GET    | `/teacher`                | Get teacher dashboard  | Yes           | Teacher |
| POST   | `/teacher/student-signup` | Create student account | Yes           | Teacher |
| GET    | `/teacher/students`       | Get all students       | Yes           | Teacher |
| GET    | `/teacher/student/:id`    | Get student by ID      | Yes           | Teacher |
| PUT    | `/teacher/student/:id`    | Update student         | Yes           | Teacher |
| DELETE | `/teacher/student/:id`    | Delete student         | Yes           | Teacher |

## Student Endpoints

| Method | Endpoint                   | Description            | Auth Required | Role    |
| ------ | -------------------------- | ---------------------- | ------------- | ------- |
| GET    | `/student`                 | Get student dashboard  | Yes           | Student |
| GET    | `/student?question=...`    | Ask question to AI     | Yes           | Student |
| GET    | `/student/message/:userId` | Get chat history       | Yes           | Student |
| GET    | `/student/:id`             | Get student profile    | Yes           | Student |
| PUT    | `/student/:id`             | Update student profile | Yes           | Student |

## Guest Endpoints

| Method | Endpoint              | Description        | Auth Required |
| ------ | --------------------- | ------------------ | ------------- |
| GET    | `/guest?question=...` | Ask question to AI | No            |

## Request/Response Examples

### Login

```typescript
// Request
POST /login
{
  "email": "admin@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "Admin",
    "dept": "CSE"
  }
}
```

### Create Student

```typescript
// Request
POST /admin/student-signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "studentId": "STU001",
  "dept": "CSE",
  "role": "Student"
}

// Response
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "_id": "student-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student",
    "dept": "CSE",
    "studentId": "STU001"
  }
}
```

### Ask Question (Student)

```typescript
// Request
GET /student?question=What%20is%20machine%20learning%3F

// Response
{
  "success": true,
  "ans": "Machine learning is a subset of artificial intelligence...",
  "chatSave": {
    "_id": "chat-id",
    "question": "What is machine learning?",
    "answer": "Machine learning is a subset of artificial intelligence...",
    "author": "user-id",
    "createdAt": "2025-12-10T..."
  }
}
```

### Get All Users

```typescript
// Request
GET /admin/user

// Response
{
  "success": true,
  "data": [
    {
      "_id": "user-id-1",
      "name": "User One",
      "email": "user1@example.com",
      "role": "Student",
      "dept": "CSE",
      "studentId": "STU001"
    },
    {
      "_id": "user-id-2",
      "name": "User Two",
      "email": "user2@example.com",
      "role": "Teacher",
      "dept": "EEE",
      "teacherId": "TCH001"
    }
  ]
}
```

## Error Responses

All error responses follow this structure:

```typescript
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "statusCode": 400
}
```

### Common Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |

## Usage in Client

### Using Services

```typescript
import {
  authService,
  adminService,
  teacherService,
  studentService,
  guestService,
} from "@/lib/api-services";

// Login
const response = await authService.login({ email, password });

// Get all users (admin)
const users = await adminService.getAllUsers();

// Create student (admin/teacher)
const student = await adminService.createStudent(studentData);

// Ask question (student)
const answer = await studentService.askQuestion(question);

// Ask question (guest)
const answer = await guestService.askQuestion(question);
```

### Error Handling

```typescript
try {
  const response = await adminService.getAllUsers();
  if (response.success && response.data) {
    setUsers(response.data);
  }
} catch (error: any) {
  console.error(error.message);
  showError(error.message || "Failed to fetch users");
}
```

## Environment Variables

```env
# Client (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1

# Server (.env)
PORT=5001
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
# ... other server variables
```

## Testing Tips

1. **Use Swagger UI**: Access at `http://localhost:5001/api-docs`
2. **Check Network Tab**: Monitor requests/responses in browser DevTools
3. **Enable CORS**: Ensure server has proper CORS configuration
4. **Cookie Authentication**: Cookies are automatically handled by the browser
5. **Error Messages**: Check console for detailed error information
