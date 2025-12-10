# InteliTalk - AI-Powered University Assistant

An intelligent education management platform with AI-powered chat assistance for students, comprehensive management tools for teachers and administrators.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Backend server running on `http://localhost:5001`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 🔑 Features

### 🎓 For Students

- AI-powered chat for academic questions
- View courses and assignments
- Track deadlines and grades
- Access learning materials
- Update profile

### 👨‍🏫 For Teachers

- Manage students
- Create assignments
- Grade submissions
- View student progress
- Register new students

### 👤 For Administrators

- Complete user management
- Create student and teacher accounts
- Upload educational PDFs
- System analytics
- User role management

### 🌐 For Guests

- Public Q&A portal
- No login required
- AI-powered instant answers

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod
- **State**: React Hooks + localStorage
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📁 Project Structure

```
client/
├── app/
│   ├── (auth)/              # Auth pages (login, change password)
│   ├── (dashboard)/         # Protected dashboards (admin, teacher, student)
│   └── guest/              # Public guest portal
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── ...                 # Custom components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, API client, services
└── public/                 # Static assets
```

## 🔐 Authentication

The app uses JWT-based authentication with role-based access control:

- **Admin**: Full system access
- **Teacher**: Student management
- **Student**: Courses, assignments, AI chat
- **Guest**: Public Q&A only

## 📝 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

## 📚 Documentation

- [SUMMARY.md](./SUMMARY.md) - Complete implementation summary
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Detailed implementation guide

## 🧪 Testing

1. Ensure backend is running
2. Login with valid credentials
3. Navigate through role-specific dashboards
4. Test guest portal without login

## 📞 Support

For detailed information:

- Check IMPLEMENTATION.md for API reference
- Review SUMMARY.md for feature list
- Check component source files for usage examples

---

Built with Next.js and ❤️
