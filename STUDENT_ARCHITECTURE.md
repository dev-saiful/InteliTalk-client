# Student Module - Component Architecture

## File Structure

```
client/
├── app/(dashboard)/student/
│   ├── page.tsx                    # Main Dashboard with AI Chat
│   ├── layout.tsx                  # Student Layout
│   ├── profile/
│   │   └── page.tsx               # Profile View/Edit Page
│   ├── chats/
│   │   └── page.tsx               # All Conversations List
│   └── message/
│       └── [id]/
│           └── page.tsx           # Single Conversation Detail
│
├── components/student/
│   ├── chat-bubble.tsx            # Message Bubbles & Conversation Display
│   ├── chat-input.tsx             # Reusable Chat Input Component
│   └── chat-card.tsx              # Chat Preview Cards
│
├── components/ui/
│   └── avatar.tsx                 # Avatar Component (NEW)
│
└── lib/
    ├── api-services.ts            # Enhanced Student API Methods
    └── types.ts                   # TypeScript Type Definitions
```

## Component Hierarchy

### 1. Student Dashboard (`/student`)

```
StudentDashboard
├── Header (Welcome + Description)
├── Grid Layout
│   ├── Left Column (2/3)
│   │   ├── AI Chat Card
│   │   │   ├── Card Header
│   │   │   ├── Messages Area
│   │   │   │   ├── Empty State (Bot Icon + Text)
│   │   │   │   └── Conversation
│   │   │   │       ├── ChatBubble (User)
│   │   │   │       └── ChatBubble (AI)
│   │   │   └── ChatInput (with Send Button)
│   │   └── Learning Resources Card
│   │       └── Browse Button
│   └── Right Column (1/3)
│       ├── Quick Links Card
│       │   ├── My Conversations Button
│       │   └── My Profile Button
│       ├── Recent Conversations Card
│       │   ├── LoadingSpinner OR
│       │   ├── Empty State OR
│       │   └── Chat Previews (Clickable)
│       └── Stats Card
│           ├── Department
│           ├── Student ID
│           └── Total Chats
```

### 2. Profile Page (`/student/profile`)

```
StudentProfilePage
├── Header (Title + Description)
├── Grid Layout
│   ├── Profile Card (2/3)
│   │   ├── Card Header
│   │   │   ├── Title + Description
│   │   │   └── Edit/Save/Cancel Buttons
│   │   └── Card Content
│   │       ├── View Mode
│   │       │   ├── Name Field (with Icon)
│   │       │   ├── Email Field (with Icon)
│   │       │   ├── Student ID Field (with Icon)
│   │       │   └── Department Field (with Icon)
│   │       └── Edit Mode
│   │           ├── Name Input
│   │           ├── Email Input
│   │           ├── Student ID Input
│   │           └── Department Select
│   └── Sidebar (1/3)
│       ├── Quick Actions Card
│       │   ├── Dashboard Button
│       │   ├── Conversations Button
│       │   └── Change Password Button
│       └── Account Info Card
│           ├── Role
│           └── Status
```

### 3. Chat History Page (`/student/chats`)

```
StudentChatsPage
├── Header (Title + Description)
├── Search Card
│   ├── Search Input (with Icon)
│   └── Refresh Button
├── Stats Grid (3 columns)
│   ├── Total Conversations Card
│   ├── Search Results Card
│   └── Quick Action Card (New Chat)
└── Chat List
    ├── Empty State (Icon + Message + CTA) OR
    └── ChatCard (Multiple)
        ├── Card Header
        │   ├── Icon + Timestamp
        │   ├── Question (Truncated)
        │   └── Arrow Icon
        ├── Card Content
        │   └── Answer Preview (Truncated)
        └── Click Handler → Message Detail
```

### 4. Message Detail Page (`/student/message/[id]`)

```
MessagePage
├── Header
│   ├── Back Button
│   └── Title + Description
└── Content
    ├── Empty State (Icon + Message + Button) OR
    └── Chat Conversation List
        ├── ChatConversation (Multiple)
        │   ├── ChatBubble (User - Right)
        │   │   ├── Avatar
        │   │   ├── Message
        │   │   └── Timestamp
        │   └── ChatBubble (AI - Left)
        │       ├── Avatar
        │       └── Message
        └── Actions Card
            ├── Ask Another Question Button
            └── View All Chats Button
```

## Reusable Component Details

### ChatBubble Component

```typescript
<ChatBubble
  message="Question or answer text"
  isUser={true / false}
  timestamp="2024-01-15T10:30:00Z"
/>
```

**Renders:**

- Avatar (User icon or Bot icon)
- Message bubble (styled based on isUser)
- Timestamp (formatted)

### ChatConversation Component

```typescript
<ChatConversation
  question="What is AI?"
  answer="AI stands for..."
  timestamp="2024-01-15T10:30:00Z"
/>
```

**Renders:**

- ChatBubble for question (User)
- ChatBubble for answer (AI)
- Wrapped in Card

### ChatInput Component

```typescript
<ChatInput
  onSend={handleSend}
  disabled={loading}
  placeholder="Type your message..."
  multiline={false}
/>
```

**Features:**

- Input field (single or multi-line)
- Send button with loading state
- Enter key to send (Shift+Enter for new line in multiline)
- Auto-disabled when sending

### ChatCard Component

```typescript
<ChatCard
  id="chat123"
  question="What is machine learning?"
  answer="Machine learning is..."
  timestamp="2024-01-15T10:30:00Z"
  onClick={() => navigate(id)}
/>
```

**Renders:**

- Card with hover effect
- Question as title (truncated)
- Answer as preview (truncated)
- Timestamp with icon
- Click handler

### ChatList Component

```typescript
<ChatList chats={[...chatArray]} onChatClick={(id) => navigate(id)} />
```

**Renders:**

- Grid of ChatCard components
- Empty state if no chats
- Handles array mapping

## API Integration Flow

### 1. Ask Question Flow

```
User types question → Submit
  ↓
studentService.askQuestion(question)
  ↓
POST /student?question=<encoded>
  ↓
Response: { success: true, data: { answer: "..." } }
  ↓
Update conversation state
  ↓
Display answer in ChatBubble
  ↓
Refresh recent chats
```

### 2. View Profile Flow

```
Page Load → useEffect
  ↓
studentService.getStudentProfile(userId)
  ↓
GET /student/:id
  ↓
Response: { success: true, data: { ...userInfo } }
  ↓
Set profile state
  ↓
Display in view mode
```

### 3. Update Profile Flow

```
User clicks Edit → Edit mode
  ↓
User modifies fields
  ↓
User clicks Save
  ↓
Validate inputs
  ↓
studentService.updateStudentProfile(id, data)
  ↓
PUT /student/:id
  ↓
Response: { success: true, data: { ...updatedUser } }
  ↓
Update profile state
  ↓
Show success toast
  ↓
Switch to view mode
```

### 4. Load Chat History Flow

```
Page Load → useEffect
  ↓
studentService.getChats(userId)
  ↓
GET /student/message/:userId
  ↓
Response: { success: true, data: [...chats] }
  ↓
Set chats state
  ↓
Apply search filter if any
  ↓
Display ChatCard list
```

## State Management

### Dashboard Page State

```typescript
- question: string                    // Current question input
- conversation: Array<{               // Current session conversation
    question: string
    answer: string
    loading?: boolean
  }>
- loading: boolean                    // API call in progress
- recentChats: Chat[]                 // Last 5 chats from history
- loadingChats: boolean              // Loading recent chats
```

### Profile Page State

```typescript
- profile: User | null                // User profile data
- loading: boolean                    // Initial load
- isEditing: boolean                  // Edit mode toggle
- saving: boolean                     // Save in progress
- formData: UpdateUserData            // Form inputs
```

### Chats Page State

```typescript
- chats: Chat[]                       // All chats
- filteredChats: Chat[]               // Search-filtered chats
- loading: boolean                    // Initial load
- searchQuery: string                 // Search input
```

### Message Detail State

```typescript
- chatData: Chat[]                    // Single conversation data
- loading: boolean                    // Initial load
```

## Styling Conventions

### Colors

- Primary: User messages, CTAs
- Muted: AI messages, backgrounds
- Foreground: Main text
- Muted-foreground: Secondary text

### Spacing

- Page padding: `p-6 md:p-8`
- Card spacing: `space-y-4` or `space-y-6`
- Grid gaps: `gap-4` or `gap-6`

### Responsive Breakpoints

- Mobile: Default (1 column)
- Desktop: `lg:` prefix (grid layouts)

### Interactive States

- Hover: `hover:shadow-lg`, `hover:bg-muted`
- Disabled: `disabled:opacity-50`
- Loading: `animate-spin`

## Performance Optimizations

1. **Lazy Loading**: Components load on demand
2. **Debounced Search**: Search triggers after typing stops
3. **Pagination Ready**: Structure supports pagination
4. **Memoization**: Can add React.memo to prevent re-renders
5. **Optimistic Updates**: UI updates before API response

## Accessibility Features

1. **Semantic HTML**: Proper heading hierarchy
2. **Button Labels**: Clear action descriptions
3. **Loading States**: Visual feedback for all actions
4. **Error Messages**: User-friendly error handling
5. **Keyboard Navigation**: All interactive elements accessible

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design
