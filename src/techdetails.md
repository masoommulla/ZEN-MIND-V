# ZEN-MIND AI Companion - Technical Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [Key Features & Implementation](#key-features--implementation)
7. [Security & Authentication](#security--authentication)
8. [Email Service Integration](#email-service-integration)
9. [Libraries & Dependencies](#libraries--dependencies)
10. [Deployment](#deployment)

---

## 🎯 Project Overview

**ZEN-MIND** is a comprehensive mental wellness companion application designed specifically for teenagers (ages 13-19). The app features a modern, cartoon-style design with pastel gradients and anime-style graphics that appeal to the target demographic. It provides AI-powered mental health support, mood tracking, journaling, professional therapist booking, and crisis resources.

**Project Type**: Full-Stack Web Application  
**Target Users**: Teenagers (13-19 years)  
**Design Style**: Cartoon-modern with pastel gradients and anime aesthetics

---

## 🛠️ Technology Stack

### Frontend Technologies

#### Core Framework
- **React 18**: JavaScript library for building user interfaces
  - *Why?* Component-based architecture allows for reusable UI elements, efficient rendering with Virtual DOM, and strong ecosystem support
  - *How it works:* React creates a tree of components that represent your UI. When data changes, React efficiently updates only the parts of the DOM that need to change

- **TypeScript**: Typed superset of JavaScript
  - *Why?* Provides type safety, better IDE support, catches errors at compile-time, and makes code more maintainable
  - *How it works:* TypeScript adds static types to JavaScript. During development, it checks your code for type errors before running

- **Vite**: Next-generation frontend build tool
  - *Why?* Ultra-fast Hot Module Replacement (HMR), optimized production builds, and modern ES modules support
  - *How it works:* Vite uses native ES modules during development for instant server start, and Rollup for production builds

#### Routing
- **React Router v6**: Client-side routing
  - *Implementation:* Handles navigation between pages (Dashboard, Mood Tracker, Journal, etc.) without page reloads
  - *How it works:* React Router dynamically renders components based on the URL path, managing browser history and creating a Single Page Application (SPA) experience

#### Styling
- **Tailwind CSS v4.0**: Utility-first CSS framework
  - *Why?* Rapid UI development, consistent design system, smaller CSS bundle sizes, and highly customizable
  - *How it works:* Uses utility classes (like `bg-blue-500`, `p-4`) directly in JSX. Build process removes unused styles for optimized production bundles

### Backend Technologies

#### Server & Framework
- **Node.js v22.16.0**: JavaScript runtime
  - *Why?* Non-blocking I/O model perfect for real-time applications, unified language across stack, large ecosystem (npm)
  - *How it works:* Node.js executes JavaScript server-side using Chrome's V8 engine with an event-driven architecture

- **Express.js v4.18.2**: Web application framework
  - *Why?* Minimalist, flexible, robust routing, middleware support, and well-documented
  - *How it works:* Express provides routing, middleware handling, and request/response management through a simple API

#### Database
- **MongoDB Atlas**: Cloud-hosted NoSQL database
  - *Why?* Flexible schema design, scalability, JSON-like documents match JavaScript objects, cloud-managed (no server maintenance)
  - *How it works:* Stores data in BSON (Binary JSON) documents organized in collections. MongoDB Atlas handles hosting, backups, and scaling automatically

- **Mongoose v8.0.3**: MongoDB Object Data Modeling (ODM)
  - *Why?* Schema validation, query building, middleware hooks, type casting, and relationship management
  - *How it works:* Provides a schema-based solution to model application data, validates data before saving to database

---

## 🏗️ Architecture Overview

### Frontend-Backend Connection

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Components (Dashboard, MoodTracker, Journal, etc.)  │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │        AuthContext (Global State Management)         │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │      API Service Layer (/services/api.ts)            │   │
│  │  • Handles all HTTP requests                         │   │
│  │  • Manages JWT tokens in localStorage                │   │
│  │  • Formats requests/responses                        │   │
│  └────────────────────┬─────────────────────────────────┘   │
└───────────────────────┼──────────────────────────────────────┘
                        │
              HTTP/HTTPS REST API
              (JSON Format)
                        │
┌───────────────────────▼──────────────────────────────────────┐
│               Backend (Node.js + Express)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  CORS Middleware (Handles cross-origin requests)     │   │
│  └────────────────────┬─────────────────────────────────┘   │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │  Security Middleware (Helmet, Rate Limiting)         │   │
│  └────────────────────┬─────────────────────────────────┘   │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │  Authentication Middleware (JWT Verification)        │   │
│  └────────────────────┬─────────────────────────────────┘   │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │  Route Handlers (/routes)                            │   │
│  │  • /api/auth - Authentication                        │   │
│  │  • /api/moods - Mood tracking                        │   │
│  │  • /api/journals - Journal entries                   │   │
│  │  • /api/booking - Therapist booking                  │   │
│  └────────────────────┬─────────────────────────────────┘   │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │  Data Models (/models) - Mongoose Schemas            │   │
│  └────────────────────┬─────────────────────────────────┘   │
└───────────────────────┼──────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────┐
│                MongoDB Atlas Database                        │
│  Collections: users, moods, journals, appointments, etc.     │
└──────────────────────────────────────────────────────────────┘
```

### How Frontend Connects to Backend

1. **Configuration** (`/config.ts`):
   ```typescript
   export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```
   - Environment variable `VITE_API_URL` points to backend server
   - Production: `https://backend.onrender.com`
   - Development: `http://localhost:5000`

2. **API Service Layer** (`/services/api.ts`):
   - Centralized HTTP request handling
   - Automatically attaches JWT token from localStorage to all authenticated requests
   - Handles response errors and token management
   - Example flow:
     ```typescript
     // User logs in
     await authAPI.login({ email, password })
     → POST request to backend: /api/auth/login
     → Backend validates credentials
     → Returns JWT token + user data
     → Frontend stores token in localStorage
     → Frontend stores user in AuthContext
     ```

3. **Authentication Flow**:
   ```
   Frontend Component
         ↓
   AuthContext (manages auth state)
         ↓
   API Service (adds token to headers)
         ↓
   Backend Auth Middleware (verifies token)
         ↓
   Route Handler (processes request)
         ↓
   MongoDB (data persistence)
   ```

---

## 🔧 Backend Implementation

### Server Architecture (`/server/server.js`)

#### Middleware Stack (Order Matters!)
```javascript
1. helmet() - Security headers
2. mongoSanitize() - Prevents NoSQL injection
3. cors() - Handles cross-origin requests
4. rateLimit() - Prevents abuse (100 requests per 15 minutes)
5. express.json() - Parses JSON request bodies
6. compression() - Compresses responses
7. morgan() - Logs HTTP requests (development only)
```

**Why this order?**
- Security middleware first to protect against attacks
- CORS before parsing to validate origin
- Parsing middleware before routes to access request data

#### CORS Configuration
```javascript
const allowedOrigins = [
  'https://frontend-m8ui.onrender.com',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
```

**How it works:**
- Browsers send an `Origin` header with requests
- Server checks if origin is in allowedOrigins
- If allowed, responds with `Access-Control-Allow-Origin` header
- Browser then allows the response to reach frontend JavaScript

### Database Connection

```javascript
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
};
```

**Environment Variable:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zenmind
```

**How MongoDB Atlas works:**
- Cloud-hosted MongoDB cluster
- Automatic backups and scaling
- Connection string contains authentication and database name
- Mongoose manages connection pooling automatically

### API Routes Structure

```
/api/auth          - User authentication (login, register, password reset)
/api/users         - User profile management
/api/moods         - Mood tracking entries
/api/journals      - Journal entries
/api/therapists    - Therapist profiles and availability
/api/therapist-auth - Therapist authentication
/api/therapist     - Therapist management (pricing, slots)
/api/booking       - Appointment booking (instant-book)
/api/appointments  - Appointment management
/api/reviews       - Session reviews and ratings
/api/refunds       - Cancellation and refunds
/api/chats         - Chat/messaging system
/api/resources     - Mental health resources
/api/todos         - Task management
/api/study-plans   - Study planning
```

---

## 🔐 Security & Authentication

### Password Security (bcrypt)

**Library Used:** `bcryptjs v2.4.3`

#### How bcrypt Works (Simple Explanation)

Imagine you have a password "MyPass123!". You can't just store it as-is in the database because if someone hacks your database, they'll see everyone's passwords. Bcrypt solves this problem through **hashing**.

**Hashing Process:**
1. **Salt Generation**: Creates a random string (salt)
   - Example salt: `$2a$10$K1Xv8J9YzRtVv1ZJE1l0B.`
   
2. **Mixing**: Combines your password with the salt
   - "MyPass123!" + salt → mixed string

3. **Hashing**: Runs the mixed string through bcrypt algorithm (using 10 "rounds" of hashing)
   - The more rounds, the more secure but slower
   - 10 rounds = algorithm runs 2^10 (1024) times
   
4. **Final Hash**: 
   - `$2a$10$K1Xv8J9YzRtVv1ZJE1l0B.e5mLqJrT8vYBqJrT8vYBq`
   - This is what gets stored in the database

**Why is this secure?**
- **One-way function**: You can't reverse the hash to get the password
- **Unique salt**: Even if two users have the same password, hashes are different
- **Slow by design**: Makes brute-force attacks impractical

#### Implementation in ZEN-MIND

**File:** `/server/models/User.js`

```javascript
// Before saving user to database
userSchema.pre('save', async function(next) {
  // Only hash if password was modified
  if (!this.isModified('password')) {
    return next();
  }
  
  // Generate salt (10 rounds)
  const salt = await bcrypt.genSalt(10);
  
  // Hash password with salt
  this.password = await bcrypt.hash(this.password, salt);
  
  next();
});
```

**What happens during registration:**
```
User submits: { email: "teen@example.com", password: "MyPass123!" }
       ↓
Express receives request in /api/auth/register
       ↓
Creates new User document with plain password
       ↓
Mongoose 'pre save' hook triggers automatically
       ↓
bcrypt.genSalt(10) generates random salt
       ↓
bcrypt.hash() creates hash from password + salt
       ↓
Original password replaced with hash in document
       ↓
Document saved to MongoDB with hashed password
```

**Password Verification During Login:**

```javascript
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

**Login flow:**
```
User submits: { email: "teen@example.com", password: "MyPass123!" }
       ↓
Backend finds user in database
       ↓
Calls user.comparePassword("MyPass123!")
       ↓
bcrypt.compare() takes candidate password:
  1. Extracts salt from stored hash
  2. Hashes candidate password with same salt
  3. Compares resulting hash with stored hash
  4. Returns true if match, false if not
       ↓
If true: Generate JWT token and send to user
If false: Return "Invalid credentials" error
```

### JWT (JSON Web Token) Authentication

**Library Used:** `jsonwebtoken v9.0.2`

#### What is JWT? (Beginner-Friendly Explanation)

Think of JWT like a special movie ticket:
1. Theater (backend) stamps your ticket when you buy it (login)
2. Ticket has your seat info and validity time encoded on it
3. Every time you enter/exit theater (make API request), guard checks ticket
4. If ticket is valid and not expired, you get access
5. If ticket is fake or expired, you're denied entry

**JWT Structure:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGU3ZjYzODk0YjVkMDAiLCJpYXQiOjE2OTk1ODg5MDN9.K5Xv8J9YzRtVv1ZJE1l0B
│                                      │                                │
│          HEADER                      │          PAYLOAD               │    SIGNATURE
```

1. **Header**: Tells how token is encoded
2. **Payload**: Contains user data (like user ID)
3. **Signature**: Proves token wasn't tampered with

#### JWT Implementation

**Token Generation** (`/server/routes/auth.js`):
```javascript
const generateToken = (id) => {
  return jwt.sign(
    { id },                          // Payload: user ID
    process.env.JWT_SECRET,          // Secret key (like a master password)
    { expiresIn: '7d' }              // Token expires in 7 days
  );
};
```

**Environment Variable:**
```
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRE=7d
```

**Login Process:**
```javascript
// User logs in
const user = await User.findOne({ email }).select('+password');

// Verify password
const isPasswordMatch = await user.comparePassword(password);

// Generate JWT token
const token = generateToken(user._id);

// Send token to frontend
res.json({
  success: true,
  data: { user, token }
});
```

**Token Verification Middleware** (`/server/middleware/auth.js`):
```javascript
export const protect = async (req, res, next) => {
  // Extract token from header
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  try {
    // Verify token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from token
    req.user = await User.findById(decoded.id);
    
    next(); // Allow request to proceed
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

**Frontend Token Management:**
```typescript
// Store token after login
localStorage.setItem('token', token);

// Attach token to all API requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

**Complete Authentication Flow:**
```
1. User submits login credentials
        ↓
2. Backend verifies password with bcrypt
        ↓
3. Backend generates JWT token with user ID
        ↓
4. Frontend stores token in localStorage
        ↓
5. For protected requests, frontend sends token in Authorization header
        ↓
6. Backend middleware extracts and verifies token
        ↓
7. If valid, middleware attaches user to request object
        ↓
8. Route handler processes request with authenticated user
```

---

## 📧 Email Service Integration (Brevo)

**Library Used:** `@getbrevo/brevo v2.0.0` (formerly Sendinblue)

### What is Brevo?

Brevo is a cloud email service (like Gmail, but for applications). Instead of manually sending emails, your application tells Brevo what to send, and Brevo handles:
- Deliverability (making sure emails don't go to spam)
- Email server infrastructure
- Tracking (opens, clicks)
- Template management

### Why Use Brevo?

1. **Reliability**: High deliverability rates (emails actually reach inbox)
2. **Transactional Emails**: Perfect for automated emails (welcome, password reset, booking confirmations)
3. **Free Tier**: 300 emails/day free
4. **Easy Integration**: Simple API
5. **Professional**: Emails come from your domain, not a free email provider

### Implementation

**File:** `/server/utils/emailService.js`

#### Setup & Configuration

```javascript
import SibApiV3Sdk from '@getbrevo/brevo';

// Initialize API client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Configure with API key
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Sender configuration
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL; // 'noreply@zenmind.app'
const SENDER_NAME = process.env.BREVO_SENDER_NAME;   // 'ZenMind Team'
```

**Environment Variables:**
```
BREVO_API_KEY=xkeysib-abc123...
BREVO_SENDER_EMAIL=noreply@zenmind.app
BREVO_SENDER_NAME=ZenMind Team
```

#### Email Types Implemented

**1. Welcome Email** (Sent after registration)
```javascript
export async function sendWelcomeEmail(userEmail, userName) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Welcome to ZenMind 🌿";
  sendSmtpEmail.htmlContent = `<html>...</html>`; // HTML email template
  sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
  sendSmtpEmail.to = [{ email: userEmail, name: userName }];
  
  const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
  return { success: true, messageId: data.messageId };
}
```

**2. OTP Email** (Password reset)
```javascript
export async function sendOtpEmail(userEmail, userName, otp) {
  // Similar structure
  sendSmtpEmail.subject = "Your ZenMind Password Reset OTP 🔐";
  sendSmtpEmail.htmlContent = `
    <h1>${otp}</h1>
    <p>Valid for 10 minutes</p>
  `;
}
```

**3. Appointment Confirmation Email**
```javascript
export async function sendAppointmentEmail(userEmail, userName, appointmentDetails) {
  sendSmtpEmail.subject = "✅ ZenMind Therapy Session Confirmed";
  sendSmtpEmail.htmlContent = `
    <h2>Your Therapy Session is Confirmed!</h2>
    <p>Therapist: ${appointmentDetails.therapistName}</p>
    <p>Date: ${appointmentDetails.date}</p>
    <p>Time: ${appointmentDetails.startTime} - ${appointmentDetails.endTime}</p>
    <p>Amount: ₹${appointmentDetails.amount}</p>
  `;
}
```

**4. Therapist Notification Email**
```javascript
export async function sendTherapistAppointmentEmail(therapistEmail, therapistName, appointmentDetails) {
  sendSmtpEmail.subject = "📅 New Session Booked - ZenMind";
  // Includes anonymous teen info, session details
}
```

**5. Refund Confirmation Email**
```javascript
export async function sendRefundEmail(userEmail, userName, refundDetails) {
  sendSmtpEmail.subject = "💰 ZenMind Refund Processed";
  // Shows original amount, platform fee (10%), final refund amount
}
```

#### How Email Sending Works

**Registration Flow with Email:**
```
User submits registration form
       ↓
POST /api/auth/register
       ↓
Create user in database (password hashed with bcrypt)
       ↓
Generate JWT token
       ↓
Call sendWelcomeEmail() [Fire and Forget]
  ├── Creates email object with recipient, subject, HTML content
  ├── Sends to Brevo API via HTTPS
  ├── Brevo queues email for delivery
  └── Brevo sends email to user's inbox
       ↓
Return success response to frontend (don't wait for email)
```

**Important: Fire and Forget Pattern**
```javascript
// Don't wait for email to send
sendWelcomeEmail(user.email, user.name).catch(err => {
  console.error('Failed to send email:', err);
  // Don't fail registration if email fails
});

// Return immediately
res.status(201).json({ success: true, data: { user, token } });
```

**Why?**
- User registration shouldn't fail if email service is down
- Email delivery can take seconds
- Better user experience (faster response)

#### Password Reset OTP Flow

```
1. User clicks "Forgot Password"
       ↓
2. Frontend: POST /api/auth/forgot-password { email }
       ↓
3. Backend: Generate 6-digit OTP (123456)
       ↓
4. Save OTP to database with 10-minute expiration
       ↓
5. Send OTP via email using sendOtpEmail()
       ↓
6. User receives email with OTP
       ↓
7. User enters OTP in frontend
       ↓
8. Frontend: POST /api/auth/verify-otp { email, otp }
       ↓
9. Backend: Verify OTP matches and not expired
       ↓
10. Mark OTP as verified
       ↓
11. User enters new password
       ↓
12. Frontend: POST /api/auth/reset-password { email, newPassword }
       ↓
13. Backend: Hash new password with bcrypt and update user
       ↓
14. Delete OTP from database
```

#### Appointment Booking Email Flow

```
User completes fake payment for therapist session
       ↓
POST /api/booking/instant-book
       ↓
Create appointment in database
       ↓
Send TWO emails in parallel:
  ├── sendAppointmentEmail() → Teen gets confirmation
  └── sendTherapistAppointmentEmail() → Therapist gets notification
       ↓
Both emails sent via Brevo
       ↓
Teen sees: "Session Confirmed! Check your email"
Therapist sees: "New booking notification"
```

---

## 🎨 Frontend Implementation

### State Management

#### Context API (`/contexts/AuthContext.tsx`)

**What is Context?** 
Think of Context like a "global storage box" that all components can access. Without Context, you'd need to pass data through every component (prop drilling), even if intermediate components don't need it.

**Example without Context:**
```
App → Dashboard → Header → UserProfile
    ↓           ↓        ↓           ↓
  user        user      user      user (needs it)
```

**With Context:**
```
App (provides user to Context)
  ├── Dashboard (access user from Context)
  ├── Header (access user from Context)
  └── UserProfile (access user from Context)
```

**Implementation:**
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    setUser(response.data.user);
    setToken(response.data.token);
    localStorage.setItem('token', response.data.token);
  };
  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  };
  
  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**Usage in Components:**
```typescript
function Dashboard() {
  const { user, logout } = useAuth(); // Access global auth state
  
  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

```typescript
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
}
```

**How it works:**
1. User tries to access `/dashboard`
2. ProtectedRoute component renders
3. Checks if user is authenticated via AuthContext
4. If not authenticated, redirects to `/login`
5. If authenticated, renders the protected component

---

## ✨ Key Features & Implementation

### 1. User Authentication System

**Files:**
- Backend: `/server/routes/auth.js`, `/server/models/User.js`
- Frontend: `/components/UserLogin.tsx`, `/components/UserSignup.tsx`

**Features:**
- Email/password registration with validation
- Secure login with bcrypt password hashing
- JWT token-based authentication
- Forgot password with email OTP verification
- Password reset functionality

**Password Validation:**
```javascript
// Minimum requirements
- At least 8 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character (@$!%*?&)

// Validated in User schema before hashing
```

**User Schema:**
```javascript
{
  name: String,
  email: String (unique, lowercase),
  password: String (hashed with bcrypt),
  age: Number (13-19),
  avatar: String (URL),
  role: 'user' | 'therapist' | 'admin',
  profile: {
    bio, pronouns, phone, gender, dateOfBirth,
    interests: [], supportNeeds: []
  },
  settings: {
    notifications: { email, push, reminders },
    privacy: { profileVisibility, shareProgress },
    theme: 'light' | 'dark' | 'auto'
  },
  subscription: {
    plan: 'free' | 'premium' | 'unlimited',
    startDate, endDate, isActive
  },
  streakCount: Number,
  lastCheckIn: Date
}
```

### 2. Mood Tracking System

**Files:**
- Backend: `/server/routes/mood.js`, `/server/models/Mood.js`
- Frontend: `/components/MoodTracker.tsx`

**How it works:**
1. User selects mood emoji (Happy, Sad, Anxious, Calm, Energetic, Tired)
2. Rates intensity (1-5 scale)
3. Optionally adds:
   - Emotions (tags like "stressed", "excited")
   - Activities (exercise, social, work)
   - Notes (journal-like entry)
   - Energy level (1-10)
   - Sleep quality
4. Data saved to MongoDB
5. Statistics calculated server-side (mood distribution, trends)

**Mood Schema:**
```javascript
{
  userId: ObjectId (reference to User),
  mood: String ('happy', 'sad', 'anxious', etc.),
  intensity: Number (1-5),
  emotions: [String],
  activities: [String],
  notes: String,
  energy: Number (1-10),
  sleep: { hours: Number, quality: String },
  social: String,
  timestamp: Date
}
```

**API Endpoints:**
```
POST   /api/moods            - Create mood entry
GET    /api/moods            - Get all moods (paginated, sorted)
GET    /api/moods/stats      - Get mood statistics (last 30 days)
GET    /api/moods/:id        - Get single mood
PUT    /api/moods/:id        - Update mood
DELETE /api/moods/:id        - Delete mood
```

**Statistics Calculation:**
```javascript
// Server calculates:
- Most common mood
- Average intensity
- Mood distribution (percentage of each mood)
- Trends over time
- Correlations with activities
```

### 3. Journal System

**Files:**
- Backend: `/server/routes/journal.js`, `/server/models/Journal.js`
- Frontend: `/components/Journal.tsx`

**Features:**
- Create titled journal entries with rich text content
- Tag entries for organization
- Mark favorites
- Search across all entries
- Statistics (total entries, word count, tags used)

**Journal Schema:**
```javascript
{
  userId: ObjectId,
  title: String,
  content: String (rich text),
  mood: String (optional link to mood),
  tags: [String],
  isFavorite: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Therapist Booking System (WORKING UP TO PAYMENT)

**⚠️ CURRENT STATUS:**
- ✅ Working: Therapist browsing, selection, pricing, duration slider, fake payment
- ❌ Not Working: Post-payment flow (joining sessions, video calls, feedback)
- 📅 Future: Session joining, Jitsi video conferencing, ratings/reviews

**Files:**
- Backend: `/server/routes/booking.js`, `/server/routes/therapist.js`, `/server/models/Appointment.js`, `/server/models/TherapistAuth.js`
- Frontend: `/components/TherapistDashboardNew.tsx`, `/components/BookingModalNew.tsx`, `/components/FakePaymentModal.tsx`

#### Current Working Features

**1. Therapist Profiles:**
- Pre-seeded database with 15 therapists
- Each therapist has:
  - Name, bio, profile picture
  - Specialties (Anxiety, Depression, Stress, etc.)
  - Experience (1-15 years)
  - Rating (4.0-5.0)
  - Verified status
  - Languages spoken
  - Dynamic pricing based on experience

**2. Dynamic Pricing System:**
```javascript
// Pricing calculation based on experience
if (experience >= 10) {
  perSession = Math.floor(800 + Math.random() * 200); // ₹800-₹1000
} else if (experience >= 5) {
  perSession = Math.floor(650 + Math.random() * 150); // ₹650-₹800
} else {
  perSession = Math.floor(500 + Math.random() * 150); // ₹500-₹650
}
```

**3. Duration Selector:**
- Interactive slider component
- 30 or 60-minute sessions
- Price updates in real-time based on duration
- Calculation: `amount = (basePrice / 30) * selectedDuration`

**4. Instant Booking Flow:**
```
User selects therapist
       ↓
Opens booking modal
       ↓
Selects duration (30 or 60 min) with slider
       ↓
Sees calculated price
       ↓
Clicks "Book Now"
       ↓
Fake payment modal appears
       ↓
Clicks "Complete Payment"
       ↓
POST /api/booking/instant-book
  {
    therapistId: "...",
    duration: 30
  }
       ↓
Backend creates appointment:
  - Session starts 5 minutes from now
  - Calculates end time based on duration
  - Generates fake transaction ID
  - Creates Jitsi meeting link
  - Marks therapist as busy
       ↓
Sends confirmation emails to:
  - Teen (appointment details)
  - Therapist (new booking notification)
       ↓
Returns appointment data to frontend
       ↓
User redirected to appointments page
```

**5. Fake Payment System:**
```typescript
// FakePaymentModal.tsx
const handleCompletePayment = async () => {
  // Simulate payment processing
  setIsProcessing(true);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Call actual booking API
  const response = await fetch(`${API_URL}/api/booking/instant-book`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ therapistId, duration })
  });
  
  // Transaction ID: FAKE_1699588903_abc123
  // Amount: Calculated based on therapist pricing + duration
};
```

**6. Anonymity System:**
- Teen identity protected during sessions
- Therapist sees "Anonymous Teen" instead of real name
- Emails use generic "Anonymous Teen" for therapist notifications

**7. Appointment Schema:**
```javascript
{
  userId: ObjectId,
  therapistId: ObjectId,
  therapistName: String,
  therapistAvatar: String,
  date: Date (session start time),
  startTime: String ("14:30"),
  endTime: String ("15:00"),
  duration: Number (30 or 60),
  type: "video",
  status: "scheduled" | "completed" | "cancelled",
  payment: {
    amount: Number,
    currency: "INR",
    status: "completed",
    transactionId: String,
    paidAt: Date,
    method: "fake_payment"
  },
  meetingLink: String (Jitsi URL),
  rating: Number (1-5),
  review: String,
  cancellationReason: String
}
```

#### Future Implementation (Not Currently Working)

**These features are in the code but have bugs and don't work properly:**

1. **Session Joining:**
   - Should unlock 5 minutes before session
   - Teen should see "Join Session" button in appointments
   - Clicking should open Jitsi video call
   - **Current Bug:** Sessions immediately move to past, join button doesn't work

2. **Therapist Dashboard:**
   - Should show upcoming sessions
   - Allow therapist to join when ready
   - **Current Bug:** Sessions display incorrectly, therapist sees wrong status

3. **Jitsi Video Conferencing:**
   - Should open in-app video call
   - Anonymous display names
   - **Current Bug:** Video component doesn't load properly

4. **Post-Session Feedback:**
   - Teen should rate therapist (1-5 stars)
   - Leave review
   - **Current Bug:** Rating modal doesn't appear

5. **Therapist Busy Status:**
   - Therapist marked busy during session + 10min buffer
   - **Current Bug:** Status doesn't update correctly

### 5. AI Chat System (Botpress Integration)

**Files:**
- Frontend: `/components/AIChat.tsx`, `/utils/botpress.ts`
- Backend: `/server/routes/chat.js`

**How it works:**
1. Botpress AI chatbot embedded in iframe
2. Teen can have 24/7 conversations about mental health
3. Chat history saved to database (optional)
4. Botpress handles natural language processing

**Botpress Configuration:**
```typescript
// /utils/botpress.ts
export const BOTPRESS_CONFIG = {
  botId: process.env.VITE_BOTPRESS_BOT_ID,
  hostUrl: 'https://cdn.botpress.cloud/webchat/v1',
  messagingUrl: 'https://messaging.botpress.cloud'
};
```

### 6. Appointment Management

**Current Features (Working):**
- View all appointments
- See appointment details (therapist, date, time, amount)
- Cancel appointments with refund

**Appointments Display:**
```
Upcoming Sessions:
- Show future appointments
- Display countdown to session
- (Join button - not working yet)

Past Sessions:
- Completed sessions
- Can leave rating/review (not working yet)
- Can clear old sessions
```

### 7. Cancellation & Refund System

**Files:**
- Backend: `/server/routes/refund.js`
- Frontend: `/components/AppointmentsNew.tsx`

**How it works:**
```
User clicks "Cancel Appointment"
       ↓
Confirmation dialog appears
       ↓
User enters cancellation reason
       ↓
POST /api/refunds/cancel-appointment/:id
  { reason: "Schedule conflict" }
       ↓
Backend calculates refund:
  - Original amount: ₹600
  - Platform fee (10%): ₹60
  - Refund amount: ₹540
       ↓
Update appointment status to 'cancelled'
       ↓
Update therapist status (remove busy status)
       ↓
Send refund emails to:
  - Teen (refund breakdown)
  - Therapist (cancellation notice)
       ↓
Return refund details
       ↓
Frontend shows success message
```

**Refund Calculation:**
```javascript
const PLATFORM_FEE_PERCENTAGE = 10;

const calculateRefund = (amount) => {
  const platformFee = (amount * PLATFORM_FEE_PERCENTAGE) / 100;
  const refundAmount = amount - platformFee;
  
  return {
    originalAmount: amount,
    platformFee,
    platformFeePercentage: PLATFORM_FEE_PERCENTAGE,
    refundAmount
  };
};
```

### 8. Resources Section

**Files:**
- Backend: `/server/routes/resource.js`, `/server/models/Resource.js`
- Frontend: `/components/Resources.tsx`

**Features:**
- Mental health articles and guides
- Crisis helpline numbers
- Self-help resources
- Categorized content (Anxiety, Depression, Stress, etc.)

### 9. Settings & Profile Management

**Files:**
- Backend: `/server/routes/user.js`
- Frontend: `/components/Settings.tsx`

**Features:**
- Update profile (name, bio, pronouns)
- Change avatar
- Update password
- Notification preferences
- Privacy settings
- Theme selection
- Delete account

---

## 📚 Libraries & Dependencies

### Notification System

**Library:** `sonner v2.0.3`

**Why Sonner?**
- Beautiful, customizable toast notifications
- Simple API
- TypeScript support
- Animations built-in

**Implementation:**
```typescript
// App.tsx
import { Toaster } from 'sonner';

<Toaster 
  position="top-center" 
  toastOptions={{
    style: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    }
  }}
/>

// Usage in components
import { toast } from 'sonner';

toast.success('Login successful!');
toast.error('Something went wrong');
toast.loading('Processing payment...');
```

### Animation Library

**Library:** `motion/react` (formerly Framer Motion)

**Why Motion?**
- Declarative animations
- Spring physics
- Gesture support
- Great TypeScript support

**Implementation Examples:**

**1. Fade In Animation:**
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

**2. Slide In Animation:**
```typescript
<motion.div
  initial={{ x: -50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 100 }}
>
  Content
</motion.div>
```

**3. Hover Animation:**
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click Me
</motion.button>
```

**4. List Animations:**
```typescript
<AnimatePresence>
  {items.map(item => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      {item.content}
    </motion.div>
  ))}
</AnimatePresence>
```

**Used In:**
- Dashboard welcome animations
- Mood tracker mood selection
- Modal open/close transitions
- Page transitions
- Button hover effects
- Floating particles background

### UI Component Library

**shadcn/ui** - Collection of reusable components built with Radix UI and Tailwind

**Components Used:**
- Dialog/Modal
- Button
- Card
- Input
- Select
- Slider
- Tabs
- Badge
- Avatar
- Progress
- Tooltip
- Alert
- Calendar

### Icons

**Library:** `lucide-react`

**Why Lucide?**
- 1000+ beautiful icons
- Consistent design
- Tree-shakeable (only imports icons you use)
- TypeScript support

**Usage:**
```typescript
import { Heart, Calendar, Video, MessageCircle } from 'lucide-react';

<Heart className="w-6 h-6 text-red-500" />
```

### HTTP Client

**Built-in `fetch` API** - No external library needed

**Wrapped in custom API service:**
```typescript
// /services/api.ts
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
}
```

### Date Handling

**Native JavaScript Date** - No library needed for basic date operations

**Date formatting:**
```typescript
const date = new Date();
date.toLocaleDateString('en-IN', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
// Output: "Thursday, November 27, 2025"
```

---

## 🚀 Deployment

### Backend Deployment (Render)

**Service:** Render Web Service

**Build Configuration:**
```yaml
# render.yaml
services:
  - type: web
    name: zenmind-backend
    env: node
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: BREVO_API_KEY
        sync: false
```

**Environment Variables (Set in Render Dashboard):**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zenmind
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRE=7d
BREVO_API_KEY=xkeysib-abc123...
BREVO_SENDER_EMAIL=noreply@zenmind.app
BREVO_SENDER_NAME=ZenMind Team
FRONTEND_URL=https://frontend-m8ui.onrender.com
CLIENT_URL=https://frontend-m8ui.onrender.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Deployment (Render)

**Service:** Render Static Site

**Build Configuration:**
```
Build Command: npm run build
Publish Directory: dist
```

**Environment Variables:**
```
VITE_API_URL=https://zenmind-backend.onrender.com
```

**Build Process:**
```
1. Render clones GitHub repository
       ↓
2. Installs dependencies: npm install
       ↓
3. Runs build: npm run build
       ↓
4. Vite compiles React/TypeScript:
   - Bundles JavaScript
   - Processes Tailwind CSS
   - Optimizes images
   - Generates production-ready files
       ↓
5. Output in /dist folder:
   - index.html
   - assets/index-abc123.js
   - assets/index-xyz789.css
       ↓
6. Render serves /dist folder as static files
```

**Why separate frontend and backend deployments?**
- Frontend = Static files (HTML, CSS, JS) → Fast CDN delivery
- Backend = Node.js server → Always running for API requests
- More scalable (can scale independently)

### Database (MongoDB Atlas)

**Setup:**
1. Create account at mongodb.com
2. Create new cluster (free tier available)
3. Create database user with password
4. Whitelist IP addresses (0.0.0.0/0 for Render)
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/zenmind?retryWrites=true&w=majority
   ```
6. Add to Render environment variables

**Collections Created Automatically:**
- users
- therapistauths
- appointments
- moods
- journals
- otps
- chatmessages
- conversations
- resources
- todos
- studyplans

---

## 🔍 How Everything Connects

### Complete User Journey Example: Booking a Therapist

```
1. USER AUTHENTICATION
   Teen opens app → Landing Page
   Clicks "Sign Up" → UserSignup component
   Enters: name, email, password, age
   Clicks "Create Account"
   
   Frontend:
   - UserSignup.tsx validates form
   - Calls authAPI.register(userData)
   
   API Call:
   POST https://backend.onrender.com/api/auth/register
   Headers: { Content-Type: application/json }
   Body: { name, email, password, age }
   
   Backend:
   - routes/auth.js receives request
   - middleware/validation.js validates data
   - models/User.js creates new user:
     • Mongoose pre-save hook triggers
     • bcrypt hashes password (10 rounds)
     • User saved to MongoDB
   - Generate JWT token with user._id
   - utils/emailService.js sends welcome email via Brevo
   - Return { user, token }
   
   Frontend:
   - Store token in localStorage
   - Update AuthContext with user data
   - Redirect to /dashboard

2. BROWSING THERAPISTS
   Teen clicks "Find Therapist" in dashboard
   
   Frontend:
   - Navigate to /dashboard/therapists
   - TherapistDashboardNew.tsx renders
   - useEffect calls therapistAPI.getAll()
   
   API Call:
   GET https://backend.onrender.com/api/therapists
   Headers: { Authorization: Bearer <token> }
   
   Backend:
   - routes/therapist.js receives request
   - middleware/auth.js verifies JWT token:
     • Extracts token from header
     • jwt.verify(token, SECRET)
     • Find user by decoded ID
     • Attach user to req.user
   - TherapistAuth.find() gets all therapists from MongoDB
   - Calculate dynamic pricing based on experience
   - Return therapist array
   
   Frontend:
   - Display therapist cards with:
     • Profile picture
     • Name, specialties
     • Experience, rating
     • Calculated price per session

3. SELECTING THERAPIST
   Teen clicks "Book Session" on a therapist card
   
   Frontend:
   - BookingModalNew.tsx opens
   - Shows therapist details
   - DurationSelector renders slider
   - Initial duration: 30 minutes

4. CHOOSING DURATION
   Teen moves slider to 60 minutes
   
   Frontend:
   - DurationSelector onChange fires
   - Calculate new amount:
     perMinuteRate = therapist.pricing.perSession / 30
     newAmount = perMinuteRate * 60
   - Update displayed amount in real-time
   - No API call (client-side calculation)

5. INITIATING BOOKING
   Teen clicks "Book Now"
   
   Frontend:
   - BookingModalNew validates selection
   - FakePaymentModal opens
   - Shows:
     • Therapist name
     • Duration (60 minutes)
     • Amount (₹900)
   - "Complete Payment" button

6. FAKE PAYMENT
   Teen clicks "Complete Payment"
   
   Frontend:
   - Show loading spinner
   - Simulate 1.5 second delay
   - Call bookingAPI.instantBook()
   
   API Call:
   POST https://backend.onrender.com/api/booking/instant-book
   Headers: { 
     Authorization: Bearer <token>,
     Content-Type: application/json
   }
   Body: { 
     therapistId: "654e7f638...",
     duration: 60
   }
   
   Backend:
   - routes/booking.js receives request
   - middleware/auth.js verifies token
   - Find therapist by ID in database
   - Check if therapist is busy:
     • If currentSession.isActive and not expired: return error
     • If expired: clear session status
   - Get current time
   - Calculate session times:
     • sessionStart = now + 5 minutes
     • sessionEnd = sessionStart + duration
     • Format times (HH:MM)
   - Calculate amount from therapist pricing
   - Generate fake transaction ID:
     "FAKE_" + timestamp + random string
   - Generate Jitsi meeting link:
     "https://meet.jit.si/zenmind-" + timestamp + random
   - Create appointment in MongoDB:
     {
       userId, therapistId, therapistName,
       date: sessionStart,
       startTime, endTime, duration,
       status: 'scheduled',
       payment: { amount, status: 'completed', transactionId },
       meetingLink
     }
   - Update therapist busy status:
     {
       isActive: true,
       appointmentId,
       startedAt: sessionStart,
       endsAt: sessionEnd
     }
   - Send emails in parallel (fire and forget):
     
     A) Teen Confirmation Email:
        utils/emailService.js sendAppointmentEmail()
        → Brevo API
        → Teen's inbox
        Content: Session details, date, time, amount, privacy note
     
     B) Therapist Notification Email:
        utils/emailService.js sendTherapistAppointmentEmail()
        → Brevo API
        → Therapist's inbox
        Content: New booking, anonymous teen, session details
   
   - Return appointment data
   
   Frontend:
   - Close payment modal
   - Show success toast: "Booking confirmed! Check your email"
   - Navigate to /dashboard/appointments
   - AppointmentsNew.tsx loads appointments

7. VIEWING APPOINTMENT
   AppointmentsNew.tsx renders
   
   Frontend:
   - useEffect calls appointmentAPI.getAll()
   
   API Call:
   GET https://backend.onrender.com/api/appointments
   Headers: { Authorization: Bearer <token> }
   
   Backend:
   - routes/appointment.js receives request
   - middleware/auth.js verifies token
   - Appointment.find({ userId: req.user.id })
   - Populate therapist details
   - Return appointments array
   
   Frontend:
   - Separate into "Upcoming" and "Past"
   - Display appointment cards:
     • Therapist avatar, name
     • Date, time, duration
     • Amount paid
     • Status badge
     • Cancel button

8. EMAIL DELIVERY
   Parallel process (doesn't block API response):
   
   Brevo Email Service:
   - Receives sendTransacEmail API call from backend
   - Queues emails for delivery
   - Sends to SMTP servers
   - Emails delivered to recipients' inboxes
   - Tracks delivery status
   
   Teen receives email:
   "🌿 Your Therapy Session is Confirmed!"
   - Session details
   - Therapist name (real)
   - Date, time, duration
   - Amount paid
   - Privacy note about anonymity
   - Instructions to join
   
   Therapist receives email:
   "📅 New Session Booked - ZenMind"
   - Client name: "Anonymous Teen"
   - Session details
   - Amount earned
   - Privacy reminder
   - Instructions to prepare

9. DATABASE STATE AFTER BOOKING
   
   MongoDB Collections Updated:
   
   appointments collection:
   {
     _id: ObjectId("654e7f..."),
     userId: ObjectId("654e8a..."),
     therapistId: ObjectId("654e9b..."),
     therapistName: "Dr. Sarah Johnson",
     date: ISODate("2025-11-27T14:35:00Z"),
     startTime: "14:35",
     endTime: "15:35",
     duration: 60,
     status: "scheduled",
     payment: {
       amount: 900,
       currency: "INR",
       status: "completed",
       transactionId: "FAKE_1699588903_abc123",
       paidAt: ISODate("2025-11-27T14:30:00Z"),
       method: "fake_payment"
     },
     meetingLink: "https://meet.jit.si/zenmind-1699588903-abc123",
     createdAt: ISODate("2025-11-27T14:30:00Z")
   }
   
   therapistauths collection (updated):
   {
     _id: ObjectId("654e9b..."),
     name: "Dr. Sarah Johnson",
     currentSession: {
       isActive: true,
       appointmentId: ObjectId("654e7f..."),
       startedAt: ISODate("2025-11-27T14:35:00Z"),
       endsAt: ISODate("2025-11-27T15:35:00Z")
     },
     // ... other fields
   }

10. WHAT SHOULD HAPPEN NEXT (FUTURE IMPLEMENTATION)
    
    At 14:30 (5 min before session):
    - Frontend should enable "Join Session" button
    - Teen clicks button
    - Opens Jitsi video component
    - Joins as "Anonymous Teen"
    
    Therapist:
    - Sees session in dashboard
    - Clicks "Join Session"
    - Joins same Jitsi room
    
    After session:
    - Appointment status changes to "completed"
    - Therapist busy status cleared (after 10min buffer)
    - Teen sees rating modal
    - Can leave 1-5 star rating and review
    
    ⚠️ CURRENT ISSUE:
    - Sessions immediately show in "Past Sessions"
    - Join functionality doesn't work
    - Video conference doesn't load
    - Rating modal doesn't appear
```

---

## 📊 Performance Optimizations

### Backend
1. **MongoDB Indexing**: Indexes on frequently queried fields (userId, email, date)
2. **Compression**: Gzip compression for API responses
3. **Rate Limiting**: Prevents API abuse (100 requests per 15 minutes)
4. **Connection Pooling**: Mongoose manages MongoDB connections efficiently
5. **Async Email**: Fire-and-forget pattern doesn't block API responses

### Frontend
1. **Code Splitting**: React.lazy() for route-based code splitting
2. **Vite**: Lightning-fast HMR during development, optimized production builds
3. **Tailwind Purging**: Removes unused CSS classes
4. **Image Optimization**: Using Unsplash optimized URLs
5. **Local Storage**: Reduces API calls by caching user data

---

## 🔒 Security Best Practices Implemented

1. **Helmet**: Sets security HTTP headers
2. **CORS**: Restricts API access to allowed origins
3. **Rate Limiting**: Prevents brute-force attacks
4. **Input Validation**: express-validator on all user inputs
5. **NoSQL Injection Prevention**: express-mongo-sanitize
6. **Password Hashing**: bcrypt with 10 rounds (2^10 iterations)
7. **JWT**: Stateless authentication with expiration
8. **Environment Variables**: Sensitive data not in code
9. **HTTPS**: All production traffic encrypted
10. **Content Security Policy**: Via Helmet

---

## 📝 Code Quality & Standards

### TypeScript Strict Mode
- Type safety across frontend
- Catches errors at compile-time
- Better IDE autocomplete

### ESLint & Prettier
- Consistent code formatting
- Catches common errors
- Enforces best practices

### Error Handling
```javascript
// Backend
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Frontend
try {
  await api.request();
} catch (error) {
  toast.error(error.message);
}
```

---

## 🎓 Learning Resources

If you want to understand the technologies used:

- **React**: https://react.dev/learn
- **TypeScript**: https://www.typescriptlang.org/docs/handbook/intro.html
- **Node.js**: https://nodejs.dev/learn
- **Express**: https://expressjs.com/en/guide/routing.html
- **MongoDB**: https://www.mongodb.com/docs/manual/tutorial/getting-started/
- **JWT**: https://jwt.io/introduction
- **bcrypt**: https://github.com/kelektiv/node.bcrypt.js#readme

---

**END OF TECHNICAL DOCUMENTATION**
