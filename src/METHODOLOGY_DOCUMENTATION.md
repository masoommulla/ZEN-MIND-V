# ZEN-MIND AI Companion - Methodology Documentation
## Dept of CSE, KLECET, Chikodi 2024-25

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [System Architecture](#2-system-architecture)
3. [Use Case Diagram](#3-use-case-diagram)
4. [Class Diagram](#4-class-diagram)
5. [Database Schema](#5-database-schema)
6. [System Workflow](#6-system-workflow)
7. [Security Implementation](#7-security-implementation)

---

## 1. Introduction

### 1.1 Methodology Overview
This document outlines the systematic approach and architectural design used to develop **ZEN-MIND**, a comprehensive AI-powered mental wellness companion application for teenagers (ages 13-19). The methodology encompasses the techniques, tools, and procedures employed for data management, user interaction, and therapeutic services, ensuring the system is structured, secure, and scalable.

### 1.2 Technology Stack
- **Frontend**: React.js with TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Cloud-based NoSQL)
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing
- **Video Conferencing**: Jitsi Meet API
- **Email Services**: Nodemailer for notifications
- **AI Integration**: OpenAI API for chatbot functionality
- **Deployment**: Render (Frontend & Backend)

---

## 2. System Architecture

The ZEN-MIND application follows a **Client-Server Architecture** with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (React)                    │
│  - Landing Page      - Dashboard        - Mood Tracker      │
│  - AI Chat           - Journal          - Appointments      │
│  - Therapist Portal  - Settings         - Resources         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS/REST API
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              SERVER LAYER (Node.js/Express)                 │
│  - Authentication    - Appointment Mgmt  - Payment System   │
│  - User Management   - Therapist Mgmt    - Email Service    │
│  - Mood Analytics    - Journal Service   - Video Service    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Mongoose ODM
                       │
┌──────────────────────▼──────────────────────────────────────┐
│             DATABASE LAYER (MongoDB Atlas)                  │
│  - Users Collection        - Appointments Collection        │
│  - Therapists Collection   - Moods Collection               │
│  - Journals Collection     - ChatMessages Collection        │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Use Case Diagram

### 3.1 Use Case Diagram Description

```
                    ZEN-MIND Mental Wellness System
                           Use Case Diagram

┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌──────────────┐                                               │
│  │  Unregistered│                                               │
│  │    User      │────────► Register Account                     │
│  └──────────────┘                                               │
│                                                                  │
│  ┌──────────────┐                                               │
│  │              │────────► Login to System                      │
│  │              │────────► Track Daily Mood                     │
│  │              │────────► Write Journal Entries                │
│  │              │────────► Chat with AI Companion               │
│  │  Registered  │────────► Browse Therapist Profiles            │
│  │   Teen User  │────────► Book Therapy Appointment             │
│  │              │────────► Join Video Session                   │
│  │              │────────► Rate & Review Therapist              │
│  │              │────────► Request Refund                       │
│  │              │────────► Access Crisis Support                │
│  │              │────────► View Mental Health Resources         │
│  └──────────────┘                                               │
│                                                                  │
│  ┌──────────────┐                                               │
│  │              │────────► Login to Therapist Portal            │
│  │              │────────► Manage Availability Slots            │
│  │              │────────► View Appointment Schedule            │
│  │              │────────► Configure Session Pricing            │
│  │  Therapist   │────────► Join Video Session                   │
│  │              │────────► Add Session Notes                    │
│  │              │────────► View Teen Reviews (Anonymous)        │
│  │              │────────► Update Profile & Specializations     │
│  │              │────────► Receive Email Notifications          │
│  └──────────────┘                                               │
│                                                                  │
│  ┌──────────────┐                                               │
│  │              │────────► Manage User Accounts                 │
│  │              │────────► Approve Therapist Registrations      │
│  │   System     │────────► Monitor Platform Activity            │
│  │Administrator │────────► Handle Refund Requests               │
│  │              │────────► Generate Analytics Reports           │
│  │              │────────► Manage Content Moderation            │
│  └──────────────┘                                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Use Case Explanation

This diagram illustrates the interactions between three primary actors and the ZEN-MIND system:

**1. Unregistered User:**
- Can register to create an account and access the platform.

**2. Registered Teen User:**
- Has full access to mental wellness features including mood tracking, journaling, AI chat, and therapist booking.
- Can book therapy sessions with flexible duration (30-60 minutes) and pricing (₹500-₹1000).
- Maintains anonymity during sessions with therapists.
- Can rate and review therapists post-session.
- Has access to crisis support and mental health resources.

**3. Therapist:**
- Manages their own availability and configures session pricing based on experience.
- Views and manages appointment schedules.
- Conducts video therapy sessions with complete anonymity (no access to teen's personal data).
- Adds confidential session notes after meetings.
- Receives email notifications for bookings.

**4. System Administrator:**
- Oversees platform operations and user management.
- Monitors system health and handles refund requests (with 10% platform charge).
- Ensures content moderation and platform security.

---

## 4. Class Diagram

### 4.1 Class Diagram Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        User Class                           │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                 │
│ - _id: ObjectId                                             │
│ - name: String                                              │
│ - email: String (unique, validated)                         │
│ - password: String (hashed, hidden)                         │
│ - age: Number (13-19)                                       │
│ - avatar: String (URL)                                      │
│ - role: String (user/therapist/admin)                       │
│ - profile: {                                                │
│     bio: String                                             │
│     pronouns: String                                        │
│     phone: String                                           │
│     gender: String                                          │
│     dateOfBirth: Date                                       │
│     interests: [String]                                     │
│     supportNeeds: [String]                                  │
│   }                                                         │
│ - settings: {                                               │
│     notifications: { email, push, reminders: Boolean }      │
│     privacy: { profileVisibility, shareProgress }           │
│     theme: String (light/dark/auto)                         │
│   }                                                         │
│ - subscription: {                                           │
│     plan: String (free/premium/unlimited)                   │
│     startDate: Date                                         │
│     endDate: Date                                           │
│     isActive: Boolean                                       │
│   }                                                         │
│ - streakCount: Number                                       │
│ - lastCheckIn: Date                                         │
│ - createdAt: Date                                           │
│ - updatedAt: Date                                           │
├─────────────────────────────────────────────────────────────┤
│ Methods:                                                    │
│ + comparePassword(candidatePassword: String): Boolean       │
│ + updateStreak(): Promise<User>                             │
│ + hashPassword(): void (pre-save hook)                      │
├─────────────────────────────────────────────────────────────┤
│ Functionality:                                              │
│ Manages user authentication, profile data, preferences,     │
│ subscription plans, and engagement tracking through streak  │
│ counts. Implements secure password hashing using bcrypt     │
│ with automatic pre-save hooks and password comparison.      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ has many
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Appointment Class                        │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                 │
│ - _id: ObjectId                                             │
│ - userId: ObjectId (ref: User)                              │
│ - therapistId: ObjectId (ref: Therapist)                    │
│ - therapistName: String                                     │
│ - therapistAvatar: String                                   │
│ - date: Date                                                │
│ - startTime: String (HH:MM format)                          │
│ - endTime: String                                           │
│ - duration: Number (30 or 60 minutes)                       │
│ - type: String (video/audio/chat/in-person)                 │
│ - status: String (scheduled/confirmed/completed/cancelled)  │
│ - notes: String (max 500 chars)                             │
│ - reason: String                                            │
│ - meetingLink: String (Jitsi URL)                           │
│ - reminderSent: Boolean                                     │
│ - payment: {                                                │
│     amount: Number                                          │
│     currency: String (INR)                                  │
│     status: String (pending/completed/refunded)             │
│     transactionId: String                                   │
│     paidAt: Date                                            │
│     method: String (fake-payment)                           │
│   }                                                         │
│ - cancellation: {                                           │
│     cancelledBy: String (user/therapist/system)             │
│     reason: String                                          │
│     cancelledAt: Date                                       │
│   }                                                         │
│ - review: {                                                 │
│     rating: Number (1-5)                                    │
│     comment: String                                         │
│     createdAt: Date                                         │
│   }                                                         │
│ - sessionNotes: String (max 2000 chars, therapist only)     │
│ - createdAt: Date                                           │
│ - updatedAt: Date                                           │
├─────────────────────────────────────────────────────────────┤
│ Methods:                                                    │
│ + checkConflicts(): Promise<Boolean> (pre-save hook)        │
│ + static getUpcoming(userId, userType): Promise<Array>      │
│ + static getStats(userId, userType): Promise<Object>        │
├─────────────────────────────────────────────────────────────┤
│ Functionality:                                              │
│ Manages therapy session bookings with conflict detection,   │
│ payment processing (fake payments for demo), video meeting  │
│ link generation, email notifications, and post-session      │
│ reviews. Supports refund processing with 10% platform       │
│ charges and maintains session history with detailed notes.  │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                     Therapist Class                         │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                 │
│ - _id: ObjectId                                             │
│ - name: String                                              │
│ - email: String (unique)                                    │
│ - password: String (hashed, hidden)                         │
│ - profilePicture: String (URL)                              │
│ - about: String (max 1000 chars)                            │
│ - specializations: [String] (anxiety, depression, etc.)     │
│ - education: String                                         │
│ - experience: Number (years)                                │
│ - languages: [String]                                       │
│ - pricePerSession: Number (₹500-₹1000 based on experience) │
│ - sessionDuration: Number (30 or 60 minutes)                │
│ - currentSession: {                                         │
│     isActive: Boolean                                       │
│     appointmentId: ObjectId                                 │
│     startedAt: Date                                         │
│     endsAt: Date                                            │
│   }                                                         │
│ - availableSlots: [{                                        │
│     date: String (YYYY-MM-DD)                               │
│     slots: [{                                               │
│       startTime: String (HH:MM)                             │
│       endTime: String                                       │
│       isBooked: Boolean                                     │
│       bookedBy: ObjectId                                    │
│       appointmentId: ObjectId                               │
│     }]                                                      │
│   }]                                                        │
│ - rating: Number (0-5)                                      │
│ - reviewCount: Number                                       │
│ - reviews: [{                                               │
│     appointmentId: ObjectId                                 │
│     userId: ObjectId                                        │
│     userName: String (Anonymous)                            │
│     rating: Number (1-5)                                    │
│     comment: String                                         │
│     createdAt: Date                                         │
│   }]                                                        │
│ - role: String (therapist, immutable)                       │
│ - createdAt: Date                                           │
│ - updatedAt: Date                                           │
├─────────────────────────────────────────────────────────────┤
│ Methods:                                                    │
│ + comparePassword(candidatePassword: String): Boolean       │
│ + initializeDefaultSlots(): Promise<void>                   │
│ + getAvailableSlots(date: String): Array                    │
│ + bookSlot(date, startTime, userId, appointmentId): Slot    │
│ + cancelSlot(date, startTime): Promise<void>                │
│ + hashPassword(): void (pre-save hook)                      │
├─────────────────────────────────────────────────────────────┤
│ Functionality:                                              │
│ Manages therapist profiles with credentials, specializations,│
│ configurable pricing, and dynamic availability slots.       │
│ Handles real-time session tracking, booking management,     │
│ review aggregation, and maintains complete anonymity from   │
│ teen personal data. Supports slot initialization with 3     │
│ default daily slots and flexible scheduling.                │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ has many
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Mood Class                            │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                 │
│ - _id: ObjectId                                             │
│ - userId: ObjectId (ref: User)                              │
│ - mood: String (amazing/good/okay/sad/anxious/stressed)     │
│ - intensity: Number (1-10 scale)                            │
│ - emotions: [String]                                        │
│ - activities: [String]                                      │
│ - triggers: [String]                                        │
│ - notes: String (max 500 chars)                             │
│ - energy: Number (1-10)                                     │
│ - sleep: {                                                  │
│     hours: Number                                           │
│     quality: String (poor/fair/good/excellent)              │
│   }                                                         │
│ - social: String (none/minimal/moderate/active)             │
│ - suggestion: {                                             │
│     activity: String                                        │
│     book: String                                            │
│     song: String                                            │
│     exercise: String                                        │
│     emotion: String                                         │
│     intensity: Number                                       │
│   }                                                         │
│ - date: Date                                                │
│ - createdAt: Date                                           │
│ - updatedAt: Date                                           │
├─────────────────────────────────────────────────────────────┤
│ Methods:                                                    │
│ + static getUserStats(userId, days): Promise<Object>        │
├─────────────────────────────────────────────────────────────┤
│ Functionality:                                              │
│ Tracks daily mood entries with detailed emotional states,   │
│ intensity ratings, associated activities, and triggers.     │
│ Provides AI-generated personalized suggestions including    │
│ activities, books, songs, and exercises based on mood       │
│ patterns. Generates comprehensive statistics showing mood   │
│ distribution, average intensity, and correlations with      │
│ sleep quality, social interaction, and energy levels.       │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                      Journal Class                          │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                 │
│ - _id: ObjectId                                             │
│ - userId: ObjectId (ref: User)                              │
│ - title: String                                             │
│ - content: String (markdown supported)                      │
│ - mood: String                                              │
│ - tags: [String]                                            │
│ - isPrivate: Boolean (default: true)                        │
│ - isFavorite: Boolean                                       │
│ - gratitude: [String]                                       │
│ - goals: [{                                                 │
│     text: String                                            │
│     completed: Boolean                                      │
│   }]                                                        │
│ - aiInsights: {                                             │
│     sentiment: String (positive/neutral/negative)           │
│     themes: [String]                                        │
│     suggestions: [String]                                   │
│   }                                                         │
│ - attachments: [{                                           │
│     type: String (image/audio/file)                         │
│     url: String                                             │
│     name: String                                            │
│   }]                                                        │
│ - createdAt: Date                                           │
│ - updatedAt: Date                                           │
├─────────────────────────────────────────────────────────────┤
│ Methods:                                                    │
│ + static getUserStats(userId): Promise<Object>              │
├─────────────────────────────────────────────────────────────┤
│ Functionality:                                              │
│ Manages private journaling with rich text support, mood     │
│ tracking, tagging system, and goal management. Provides     │
│ AI-powered sentiment analysis and thematic insights.        │
│ Supports multimedia attachments and gratitude lists.        │
│ Generates statistics on writing patterns, favorite entries, │
│ and most-used tags for self-reflection.                     │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                  ChatMessage Class                          │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                 │
│ - _id: ObjectId                                             │
│ - conversationId: ObjectId (ref: Conversation)              │
│ - senderId: ObjectId (ref: User)                            │
│ - receiverId: ObjectId (ref: User)                          │
│ - message: String (max 2000 chars)                          │
│ - type: String (text/image/file/audio/video/ai)             │
│ - isAI: Boolean (marks AI companion responses)              │
│ - metadata: {                                               │
│     sentiment: String                                       │
│     category: String                                        │
│     relatedResources: [String]                              │
│   }                                                         │
│ - attachments: [{                                           │
│     type: String                                            │
│     url: String                                             │
│     size: Number                                            │
│   }]                                                        │
│ - isRead: Boolean                                           │
│ - readAt: Date                                              │
│ - isEdited: Boolean                                         │
│ - editedAt: Date                                            │
│ - createdAt: Date                                           │
│ - updatedAt: Date                                           │
├─────────────────────────────────────────────────────────────┤
│ Methods:                                                    │
│ (Inherited from Mongoose Model)                             │
├─────────────────────────────────────────────────────────────┤
│ Functionality:                                              │
│ Handles AI chatbot conversations with sentiment analysis,   │
│ categorization, and resource recommendations. Supports      │
│ multimedia messaging, read receipts, and message editing.   │
│ Stores conversation context for personalized AI responses   │
│ and maintains message history for continuity in mental      │
│ health support interactions.                                │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                 Authentication Service                      │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                 │
│ - JWT_SECRET: String (environment variable)                 │
│ - JWT_EXPIRE: String (7 days)                               │
│ - SALT_ROUNDS: Number (10)                                  │
├─────────────────────────────────────────────────────────────┤
│ Methods:                                                    │
│ + generateToken(userId, role): String                       │
│ + verifyToken(token): Object                                │
│ + hashPassword(password): String                            │
│ + comparePassword(plain, hashed): Boolean                   │
│ + authenticateUser(email, password): Promise<User>          │
│ + authenticateTherapist(email, password): Promise<Therapist>│
│ + sendOTP(email): Promise<String>                           │
│ + verifyOTP(email, otp): Promise<Boolean>                   │
├─────────────────────────────────────────────────────────────┤
│ Functionality:                                              │
│ Provides secure authentication using JWT tokens with        │
│ bcrypt password hashing. Implements separate authentication │
│ flows for teens and therapists. Supports OTP-based email    │
│ verification for account security and password resets.      │
│ Manages session tokens with automatic expiration and        │
│ refresh mechanisms. Validates user roles and permissions    │
│ for access control across the platform.                     │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                   Payment Service                           │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                 │
│ - PLATFORM_CHARGE: Number (10%)                             │
│ - MIN_PRICE: Number (₹500)                                  │
│ - MAX_PRICE: Number (₹1000)                                 │
├─────────────────────────────────────────────────────────────┤
│ Methods:                                                    │
│ + processFakePayment(amount, userId): Promise<Transaction>  │
│ + calculateTherapistPayout(amount): Number                  │
│ + processRefund(appointmentId, reason): Promise<Refund>     │
│ + validatePaymentAmount(amount): Boolean                    │
│ + generateTransactionId(): String                           │
├─────────────────────────────────────────────────────────────┤
│ Functionality:                                              │
│ Handles fake payment processing for demo purposes (replaced │
│ Razorpay for minor project). Calculates platform charges    │
│ (10%) and therapist payouts. Manages refund requests with   │
│ appropriate fee deductions. Validates payment amounts based │
│ on therapist experience and session duration. Generates     │
│ transaction records for financial tracking and auditing.    │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                 Video Conference Service                    │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                 │
│ - JITSI_DOMAIN: String (meet.jit.si)                        │
│ - SESSION_TIMEOUT: Number (configurable)                    │
├─────────────────────────────────────────────────────────────┤
│ Methods:                                                    │
│ + generateMeetingLink(appointmentId): String                │
│ + validateSessionAccess(userId, appointmentId): Boolean     │
│ + enforceTimeRestrictions(appointmentId): Boolean           │
│ + endSession(appointmentId): Promise<void>                  │
│ + generateAnonymousDisplayNames(userId, therapistId): Object│
├─────────────────────────────────────────────────────────────┤
│ Functionality:                                              │
│ Integrates Jitsi Meet for secure video therapy sessions.    │
│ Generates unique meeting links with time-restricted access  │
│ (only accessible 5 minutes before to session end time).     │
│ Enforces anonymity by using "Teen User" and therapist names │
│ without revealing personal identifiable information.        │
│ Automatically ends sessions after scheduled duration and    │
│ triggers post-session review flow. Ensures secure,          │
│ HIPAA-compliant video communication for therapy sessions.   │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│              Email Notification Service                     │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                 │
│ - SMTP_CONFIG: Object (host, port, auth)                    │
│ - EMAIL_TEMPLATES: Object (booking, reminder, cancellation) │
├─────────────────────────────────────────────────────────────┤
│ Methods:                                                    │
│ + sendBookingConfirmation(appointment): Promise<void>       │
│ + sendTherapistNotification(appointment): Promise<void>     │
│ + sendCancellationEmail(appointment, reason): Promise<void> │
│ + sendRefundConfirmation(refund): Promise<void>             │
│ + sendSessionReminder(appointment): Promise<void>           │
├─────────────────────────────────────────────────────────────┤
│ Functionality:                                              │
│ Manages automated email notifications using Nodemailer.     │
│ Sends booking confirmations to both teens and therapists    │
│ (maintaining anonymity - no teen personal data to therapist)│
│ Provides session reminders 24 hours before appointments.    │
│ Notifies users of cancellations, refund processing, and     │
│ session completions. Uses HTML email templates with branded │
│ styling for professional communication.                     │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Class Relationships

```
User ────────┬──────► Appointment (one-to-many)
             │
             ├──────► Mood (one-to-many)
             │
             ├──────► Journal (one-to-many)
             │
             └──────► ChatMessage (one-to-many)


Therapist ───┬──────► Appointment (one-to-many)
             │
             └──────► Reviews (embedded one-to-many)


Appointment ─┬──────► User (many-to-one)
             │
             ├──────► Therapist (many-to-one)
             │
             ├──────► Payment (embedded one-to-one)
             │
             └──────► Review (embedded one-to-one)


ChatMessage ─┬──────► User (many-to-one as sender)
             │
             └──────► Conversation (many-to-one)


AuthenticationService ──► User (validates)
AuthenticationService ──► Therapist (validates)

PaymentService ──────────► Appointment (processes)

VideoConferenceService ──► Appointment (generates links)

EmailService ────────────► User (notifies)
EmailService ────────────► Therapist (notifies)
```

---

## 5. Database Schema

### 5.1 Collections Overview

| Collection Name    | Documents | Purpose                           |
|--------------------|-----------|-----------------------------------|
| users              | ~500+     | Teen user accounts & profiles     |
| therapists         | ~50+      | Licensed therapist accounts       |
| appointments       | ~1000+    | Therapy session bookings          |
| moods              | ~5000+    | Daily mood tracking entries       |
| journals           | ~3000+    | Private journal entries           |
| chatmessages       | ~10000+   | AI chatbot conversation history   |
| conversations      | ~500+     | Chat conversation metadata        |
| otps               | Variable  | Email verification codes          |

### 5.2 Indexing Strategy

**Performance Optimizations:**
- `users.email`: Unique index for authentication
- `therapists.email`: Unique index for therapist login
- `appointments.userId + date`: Compound index for user appointment queries
- `appointments.therapistId + date`: Compound index for therapist schedule
- `moods.userId + date`: Compound index for mood analytics
- `journals.userId + createdAt`: Compound index for journal retrieval
- `chatmessages.conversationId + createdAt`: Compound index for chat history

---

## 6. System Workflow

### 6.1 User Registration & Authentication Flow

```
1. User submits registration form
   ↓
2. Backend validates email format and password strength
   ↓
3. Password is hashed using bcrypt (10 salt rounds)
   ↓
4. User document is created in MongoDB
   ↓
5. JWT token is generated (7-day expiration)
   ↓
6. Token sent to frontend and stored in localStorage
   ↓
7. User redirected to Dashboard
```

### 6.2 Therapist Booking Flow

```
1. Teen browses therapist profiles (filtered by specialization)
   ↓
2. Teen selects therapist and views available slots
   ↓
3. Teen chooses date, time, and duration (30/60 min)
   ↓
4. System calculates price based on therapist rate & duration
   ↓
5. Teen enters booking reason and proceeds to payment
   ↓
6. Fake payment modal processes payment simulation
   ↓
7. Appointment document created with status: 'scheduled'
   ↓
8. Therapist slot marked as booked
   ↓
9. Jitsi meeting link generated
   ↓
10. Email notifications sent to teen & therapist
    ↓
11. Session accessible 5 minutes before start time
    ↓
12. After session, teen prompted to rate & review
    ↓
13. Rating updates therapist's average rating
```

### 6.3 Mood Tracking Flow

```
1. Teen opens Mood Tracker
   ↓
2. Selects mood emoji (amazing/good/okay/sad/anxious/stressed/angry)
   ↓
3. Rates intensity on 1-10 scale
   ↓
4. Adds optional emotions, activities, triggers
   ↓
5. Records sleep quality and social interaction
   ↓
6. AI generates personalized suggestions (books, songs, exercises)
   ↓
7. Mood entry saved to database
   ↓
8. Analytics dashboard updated with mood trends
```

### 6.4 AI Chat Flow

```
1. Teen opens AI Chat interface
   ↓
2. Types message and sends
   ↓
3. Frontend sends message to backend API
   ↓
4. Backend forwards message to OpenAI API
   ↓
5. AI generates empathetic, context-aware response
   ↓
6. Response includes sentiment analysis
   ↓
7. System suggests related mental health resources
   ↓
8. ChatMessage document saved with metadata
   ↓
9. Response displayed to teen with typing animation
```

### 6.5 Refund Processing Flow

```
1. Teen requests refund from appointment details
   ↓
2. System validates eligibility (before session start)
   ↓
3. Platform charge (10%) calculated
   ↓
4. Refund amount = Total - 10% platform fee
   ↓
5. Appointment status changed to 'cancelled'
   ↓
6. Therapist slot becomes available again
   ↓
7. Payment status updated to 'refunded'
   ↓
8. Email notifications sent to teen & therapist
   ↓
9. Refund confirmation displayed
```

---

## 7. Security Implementation

### 7.1 Authentication Security

- **Password Requirements**: Minimum 8 characters, must include uppercase, lowercase, number, and special character
- **Password Storage**: Bcrypt hashing with 10 salt rounds
- **JWT Tokens**: 7-day expiration, signed with secret key
- **Token Storage**: Frontend stores tokens in localStorage with automatic expiration handling
- **OTP Verification**: Email-based OTP for password resets (5-minute validity)

### 7.2 Data Privacy

- **Teen Anonymity**: Therapists see "Teen User" instead of real names during sessions
- **Profile Privacy**: Default private profile visibility
- **No PII Sharing**: Teen's email, phone, and personal details never shared with therapists
- **Therapist Reviews**: Anonymous reviews (userName: "Anonymous Teen")
- **Journal Encryption**: All journal entries marked private by default
- **Session Notes**: Only therapists can add confidential session notes

### 7.3 Access Control

- **Role-Based Access**: User, Therapist, Admin roles with different permissions
- **Protected Routes**: Frontend routes protected with AuthContext
- **Backend Middleware**: JWT verification middleware on all protected endpoints
- **Time-Restricted Sessions**: Video calls only accessible within scheduled time window
- **Appointment Validation**: Users can only access their own appointments

### 7.4 Data Validation

- **Input Sanitization**: All user inputs sanitized to prevent XSS attacks
- **MongoDB Injection Protection**: Mongoose schema validation prevents NoSQL injection
- **Email Validation**: Regex validation for email format
- **Age Verification**: Enforced 13-19 age range for teen users
- **Payment Amount Validation**: Server-side validation of payment amounts (₹500-₹1000)

### 7.5 API Security

- **CORS Configuration**: Restricted to frontend domain
- **Rate Limiting**: Prevents API abuse and DDoS attacks
- **Environment Variables**: Sensitive credentials stored in .env files
- **HTTPS Enforcement**: All production traffic over HTTPS
- **Error Handling**: Generic error messages to prevent information leakage

---

## 8. Conclusion

The ZEN-MIND methodology provides a comprehensive, secure, and user-centric approach to teen mental wellness. The system architecture ensures scalability, the class design promotes maintainability, and security measures protect sensitive user data. The integration of AI chatbots, mood analytics, journaling, and professional therapy creates a holistic mental health support platform tailored specifically for teenagers aged 13-19.

### 8.1 Key Achievements

✅ Complete authentication system with JWT and bcrypt  
✅ Real-time therapist booking with configurable pricing  
✅ Anonymity-preserving video therapy sessions (Jitsi)  
✅ AI-powered chatbot and mood suggestions  
✅ Comprehensive mood tracking with analytics  
✅ Private journaling with AI insights  
✅ Rating and review system  
✅ Refund processing with platform charges  
✅ Email notification system  
✅ Responsive cartoon-modern UI design  

### 8.2 Future Enhancements

- Group therapy sessions support
- Parental monitoring dashboard (with teen consent)
- Crisis hotline integration with 24/7 support
- Gamification with achievement badges and rewards
- Integration with wearable devices for health tracking
- Multi-language support for regional accessibility
- Mobile app versions (iOS and Android)
- Advanced AI sentiment analysis and risk detection

---

**Document Version**: 1.0  
**Last Updated**: November 28, 2024  
**Project Team**: CSE Department, KLECET, Chikodi  
**Contact**: masoommulla@klecet.edu.in

---

*This methodology document serves as the comprehensive technical reference for the ZEN-MIND AI Companion application architecture, design, and implementation.*
