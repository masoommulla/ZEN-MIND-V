# ZEN-MIND AI Companion - Complete User Flow Documentation

## 📋 Purpose
This document describes every possible user interaction and flow in the ZEN-MIND application. It can be used to generate visual flow charts and understand the complete user journey.

---

## 🎯 Application Entry Points

### Entry Point 1: Landing Page
```
URL: /
Component: LandingPage.tsx
Authentication: Not Required
```

### Entry Point 2: Direct Login
```
URL: /login
Component: UserLogin.tsx
Authentication: Not Required
```

### Entry Point 3: Direct Signup
```
URL: /signup
Component: UserSignup.tsx
Authentication: Not Required
```

### Entry Point 4: Therapist Portal
```
URL: /therapist-portal
Component: TherapistPortalPage.tsx
Authentication: Not Required (Public)
```

---

## 🔵 FLOW 1: New User Registration & Onboarding

### Start: User Opens App

```
Step 1: Landing Page
├─ URL: /
├─ Display: Hero section with app features
├─ Options:
│  ├─ Click "Get Started" → Go to Step 2
│  ├─ Click "Login" → Jump to FLOW 2
│  └─ Scroll down → View features, testimonials
└─ Endpoint: GET /

Step 2: Navigate to Signup
├─ Click "Get Started" or "Sign Up" button
├─ Navigation: /signup
└─ Component: UserSignup.tsx renders

Step 3: Signup Form Display
├─ Form Fields:
│  ├─ Name (text input, required)
│  ├─ Email (email input, required, must be valid email)
│  ├─ Password (password input, required, must meet requirements)
│  ├─ Age (number input, required, must be 13-19)
│  └─ Confirm Password (password input, must match password)
├─ Password Requirements Shown:
│  ├─ Minimum 8 characters
│  ├─ One uppercase letter
│  ├─ One lowercase letter
│  ├─ One number
│  └─ One special character
└─ Submit Button: "Create Account"

Step 4: User Fills Form
├─ User enters all required information
├─ Real-time validation:
│  ├─ Email format check
│  ├─ Password strength indicator
│  └─ Age range validation
└─ Enable/disable submit button based on validation

Step 5: Submit Registration
├─ User clicks "Create Account"
├─ Frontend Validation:
│  ├─ Check all fields filled
│  ├─ Verify password requirements
│  ├─ Verify passwords match
│  └─ Verify age is 13-19
├─ If validation fails:
│  ├─ Show error message
│  └─ Return to Step 4
└─ If validation passes: → Continue to Step 6

Step 6: API Call - Register
├─ Endpoint: POST /api/auth/register
├─ Headers:
│  └─ Content-Type: application/json
├─ Body:
│  ├─ name: string
│  ├─ email: string
│  ├─ password: string
│  └─ age: number
└─ Request sent to backend

Step 7: Backend Processing
├─ Server receives request at routes/auth.js
├─ Validation middleware checks:
│  ├─ All required fields present
│  ├─ Email format valid
│  ├─ Password meets requirements
│  └─ Age in valid range
├─ If validation fails:
│  ├─ Return 400 error
│  └─ Frontend shows error → Return to Step 4
└─ If validation passes: → Continue

Step 8: Check Existing User
├─ Query MongoDB: User.findOne({ email })
├─ If user exists:
│  ├─ Return 400 error: "User already exists"
│  ├─ Frontend shows error message
│  └─ User can try different email or login
└─ If user doesn't exist: → Continue

Step 9: Create User Account
├─ User.create() called with user data
├─ Mongoose Schema Validation:
│  ├─ Name: max 50 characters
│  ├─ Email: lowercase, unique
│  ├─ Password: triggers pre-save hook
│  └─ Age: 13-19
├─ Pre-save Hook Executes:
│  ├─ Check if password modified
│  ├─ Generate salt: bcrypt.genSalt(10)
│  ├─ Hash password: bcrypt.hash(password, salt)
│  └─ Replace plain password with hash
├─ User document saved to MongoDB
└─ New user created with:
   ├─ Hashed password
   ├─ Default avatar
   ├─ Role: 'user'
   ├─ Streak count: 0
   ├─ Default settings
   └─ Created timestamp

Step 10: Generate JWT Token
├─ Function: generateToken(user._id)
├─ Process:
│  ├─ jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
│  └─ Returns signed token string
└─ Token contains: user ID and expiration

Step 11: Send Welcome Email (Async)
├─ Call: sendWelcomeEmail(user.email, user.name)
├─ Process (non-blocking):
│  ├─ Create HTML email with welcome message
│  ├─ Features list (AI chat, mood tracking, journaling, etc.)
│  ├─ Send via Brevo API
│  └─ Log result (success or error)
└─ Note: Don't wait for completion, proceed immediately

Step 12: Return Success Response
├─ Status: 201 Created
├─ Response Body:
│  ├─ success: true
│  ├─ message: "User registered successfully"
│  └─ data:
│     ├─ user: { id, name, email, age, avatar, role, createdAt }
│     └─ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
└─ Send to frontend

Step 13: Frontend Receives Response
├─ Store token: localStorage.setItem('token', token)
├─ Store user: localStorage.setItem('currentUser', JSON.stringify(user))
├─ Update AuthContext:
│  ├─ setUser(user)
│  └─ setToken(token)
├─ Show success toast: "Account created! Welcome to ZenMind 🌿"
└─ Navigate to: /dashboard

Step 14: Dashboard First Load
├─ URL: /dashboard
├─ Component: Dashboard.tsx
├─ ProtectedRoute checks authentication:
│  ├─ AuthContext has user → Allow access
│  └─ No user → Redirect to /login
├─ Display:
│  ├─ Welcome message: "Welcome back, [Name]! 🌿"
│  ├─ Quick stats: 0 journal entries, 0 moods tracked
│  ├─ Daily check-in prompt
│  ├─ Feature cards (Mood Tracker, Journal, AI Chat, Find Therapist)
│  └─ Motivational quote
└─ User successfully registered and logged in!

Step 15: Email Arrives (Parallel Process)
├─ User receives welcome email in inbox
├─ Subject: "Welcome to ZenMind 🌿"
├─ Content:
│  ├─ Personalized greeting
│  ├─ Features overview
│  ├─ Getting started tips
│  └─ Support contact info
└─ Brevo tracks delivery and opens
```

---

## 🔵 FLOW 2: Existing User Login

### Start: User Has Account

```
Step 1: Navigate to Login
├─ From Landing Page: Click "Login" button
├─ Or Direct URL: /login
└─ Component: UserLogin.tsx renders

Step 2: Login Form Display
├─ Form Fields:
│  ├─ Email (email input, required)
│  └─ Password (password input, required)
├─ Options:
│  ├─ "Forgot Password?" link → Jump to FLOW 3
│  ├─ "Sign Up" link → Jump to FLOW 1
│  └─ Submit Button: "Login"
└─ Show eye icon to toggle password visibility

Step 3: User Enters Credentials
├─ User types email and password
├─ Can toggle password visibility
└─ Clicks "Login" button

Step 4: Frontend Validation
├─ Check email not empty
├─ Check password not empty
├─ If invalid:
│  ├─ Show error: "Please fill in all fields"
│  └─ Return to Step 3
└─ If valid: → Continue

Step 5: API Call - Login
├─ Endpoint: POST /api/auth/login
├─ Headers:
│  └─ Content-Type: application/json
├─ Body:
│  ├─ email: string
│  └─ password: string
└─ Request sent to backend

Step 6: Backend Receives Login Request
├─ Server: routes/auth.js
├─ Validation middleware:
│  ├─ Check email and password present
│  └─ Validate email format
├─ If validation fails:
│  ├─ Return 400 error
│  └─ Frontend shows error → Return to Step 3
└─ If validation passes: → Continue

Step 7: Find User in Database
├─ Query: User.findOne({ email }).select('+password')
├─ Note: .select('+password') needed because password excluded by default
├─ If user not found:
│  ├─ Return 401: "No account found with this email"
│  ├─ Frontend shows error
│  └─ User can try again or sign up
└─ If user found: → Continue with user document

Step 8: Verify Password
├─ Call: user.comparePassword(candidatePassword)
├─ Process:
│  ├─ bcrypt.compare(candidate, hashedPassword)
│  ├─ bcrypt extracts salt from stored hash
│  ├─ Hashes candidate with same salt
│  └─ Compares hashes
├─ If passwords don't match:
│  ├─ Return 401: "Invalid credentials"
│  ├─ Frontend shows error
│  └─ User can try again or reset password → FLOW 3
└─ If passwords match: → Continue

Step 9: Update Streak (Non-Critical)
├─ Call: user.updateStreak()
├─ Logic:
│  ├─ Get current date
│  ├─ Compare with lastCheckIn
│  ├─ If same day: No change
│  ├─ If next day: Increment streak
│  ├─ If gap > 1 day: Reset to 1
│  └─ Update lastCheckIn to now
├─ Save user document
├─ If streak update fails:
│  ├─ Log error
│  └─ Continue login (don't block)
└─ Streak updated successfully

Step 10: Generate JWT Token
├─ Function: generateToken(user._id)
├─ Creates token valid for 7 days
└─ Token contains user ID

Step 11: Return Success Response
├─ Status: 200 OK
├─ Response Body:
│  ├─ success: true
│  ├─ message: "Login successful"
│  └─ data:
│     ├─ user: { id, name, email, age, avatar, role, streakCount, subscription }
│     └─ token: "eyJhbG..."
└─ Send to frontend

Step 12: Frontend Receives Response
├─ Store token: localStorage.setItem('token', token)
├─ Store user: localStorage.setItem('currentUser', JSON.stringify(user))
├─ Update AuthContext:
│  ├─ setUser(user)
│  └─ setToken(token)
├─ Show success toast: "Welcome back, [Name]! 🌿"
└─ Navigate to: /dashboard

Step 13: Dashboard Loads
├─ URL: /dashboard
├─ ProtectedRoute allows access (user authenticated)
├─ Display:
│  ├─ Welcome back message
│  ├─ User stats (streak count, journal entries, moods tracked)
│  ├─ Recent activity
│  ├─ Quick action cards
│  └─ Daily check-in button
└─ User successfully logged in!
```

---

## 🔵 FLOW 3: Forgot Password / Password Reset

### Start: User Forgot Password

```
Step 1: Navigate to Forgot Password
├─ From Login Page: Click "Forgot Password?" link
├─ Or Direct: Open AuthModal in forgot password mode
└─ Component: AuthModal opens in "forgot" mode

Step 2: Enter Email Form
├─ Form Field: Email (required)
├─ Instruction: "Enter your email to receive reset code"
├─ Submit Button: "Send OTP"
└─ Back link to login

Step 3: User Enters Email
├─ User types their registered email
└─ Clicks "Send OTP"

Step 4: Validate Email
├─ Check email not empty
├─ Check valid email format
├─ If invalid:
│  ├─ Show error message
│  └─ Return to Step 3
└─ If valid: → Continue

Step 5: API Call - Request OTP
├─ Endpoint: POST /api/auth/forgot-password
├─ Headers:
│  └─ Content-Type: application/json
├─ Body:
│  └─ email: string
└─ Request sent to backend

Step 6: Backend Receives Request
├─ Server: routes/auth.js
├─ Validate email present and format
├─ If validation fails:
│  ├─ Return 400 error
│  └─ Frontend shows error → Return to Step 3
└─ If validation passes: → Continue

Step 7: Check User Exists
├─ Query: User.findOne({ email })
├─ If user not found:
│  ├─ Return 404: "No account found with this email"
│  ├─ Frontend shows error
│  └─ User can try different email or sign up
└─ If user exists: → Continue

Step 8: Generate and Store OTP
├─ Generate 6-digit OTP:
│  └─ Math.floor(100000 + Math.random() * 900000)
│  └─ Example: "234567"
├─ Delete any existing OTPs for this email:
│  └─ OTP.deleteMany({ email })
├─ Create new OTP document:
│  ├─ email: user email
│  ├─ otp: generated code
│  ├─ expiresAt: now + 10 minutes
│  └─ verified: false
└─ Save to MongoDB

Step 9: Send OTP Email
├─ Call: sendOtpEmail(user.email, user.name, otp)
├─ Process:
│  ├─ Create HTML email with OTP displayed prominently
│  ├─ Include "Valid for 10 minutes" warning
│  ├─ Send via Brevo API
│  └─ Wait for completion (blocking)
├─ If email fails:
│  ├─ Return 500 error
│  └─ User can try again
└─ If email succeeds: → Continue

Step 10: Return Success Response
├─ Status: 200 OK
├─ Response:
│  ├─ success: true
│  └─ message: "OTP sent to your email. Please check your inbox."
└─ Send to frontend

Step 11: OTP Sent Confirmation
├─ Frontend shows success message
├─ Modal transitions to OTP entry form
└─ User instructed to check email

Step 12: User Receives Email
├─ Email arrives in inbox
├─ Subject: "Your ZenMind Password Reset OTP 🔐"
├─ Content:
│  ├─ Large OTP code (e.g., "234567")
│  ├─ "Valid for 10 minutes"
│  ├─ Security warning
│  └─ Ignore if didn't request
└─ User copies or memorizes OTP

Step 13: OTP Entry Form
├─ Form Field: 6-digit OTP input
├─ Instruction: "Enter the code sent to [email]"
├─ Submit Button: "Verify OTP"
├─ Options:
│  ├─ "Didn't receive? Resend" → Back to Step 5
│  └─ Back to forgot password form
└─ Auto-focus on OTP input

Step 14: User Enters OTP
├─ User types 6-digit code
└─ Clicks "Verify OTP"

Step 15: Validate OTP Input
├─ Check OTP not empty
├─ Check OTP is 6 digits
├─ If invalid:
│  ├─ Show error message
│  └─ Return to Step 14
└─ If valid: → Continue

Step 16: API Call - Verify OTP
├─ Endpoint: POST /api/auth/verify-otp
├─ Headers:
│  └─ Content-Type: application/json
├─ Body:
│  ├─ email: string
│  └─ otp: string
└─ Request sent to backend

Step 17: Backend Verifies OTP
├─ Server: routes/auth.js
├─ Validate email and OTP present
├─ Query: OTP.findOne({ email, otp })
├─ If OTP not found:
│  ├─ Return 400: "Invalid OTP"
│  ├─ Frontend shows error
│  └─ User can try again (max 3 attempts)
└─ If OTP found: → Continue

Step 18: Check OTP Expiration
├─ Compare otpRecord.expiresAt with current time
├─ If expired (> 10 minutes):
│  ├─ Delete OTP: OTP.deleteOne({ _id: otpRecord._id })
│  ├─ Return 400: "OTP has expired. Please request a new one."
│  ├─ Frontend shows error
│  └─ User must request new OTP → Back to Step 2
└─ If not expired: → Continue

Step 19: Mark OTP as Verified
├─ Update: otpRecord.verified = true
├─ Save OTP document
└─ OTP verified successfully

Step 20: Return Verification Success
├─ Status: 200 OK
├─ Response:
│  ├─ success: true
│  └─ message: "OTP verified successfully"
└─ Send to frontend

Step 21: New Password Form
├─ Frontend transitions to new password form
├─ Form Fields:
│  ├─ New Password (required, must meet requirements)
│  └─ Confirm New Password (must match)
├─ Password Requirements Shown:
│  ├─ Min 8 characters
│  ├─ One uppercase, lowercase
│  ├─ One number, one special char
│  └─ Real-time strength indicator
└─ Submit Button: "Reset Password"

Step 22: User Enters New Password
├─ User types new password twice
├─ Real-time validation and matching
└─ Clicks "Reset Password"

Step 23: Validate New Password
├─ Check password meets requirements
├─ Check passwords match
├─ If invalid:
│  ├─ Show error message
│  └─ Return to Step 22
└─ If valid: → Continue

Step 24: API Call - Reset Password
├─ Endpoint: POST /api/auth/reset-password
├─ Headers:
│  └─ Content-Type: application/json
├─ Body:
│  ├─ email: string
│  └─ newPassword: string
└─ Request sent to backend

Step 25: Backend Resets Password
├─ Server: routes/auth.js
├─ Validate email and newPassword present
├─ Check for verified OTP:
│  └─ OTP.findOne({ email, verified: true })
├─ If no verified OTP:
│  ├─ Return 400: "Please verify OTP first"
│  └─ Security check (prevent bypassing OTP)
└─ If verified OTP exists: → Continue

Step 26: Update User Password
├─ Find user: User.findOne({ email })
├─ Update password: user.password = newPassword
├─ Save user document:
│  ├─ Triggers pre-save hook
│  ├─ Password hashed with bcrypt
│  └─ Hashed password saved
└─ Delete OTP record: OTP.deleteMany({ email })

Step 27: Return Success Response
├─ Status: 200 OK
├─ Response:
│  ├─ success: true
│  └─ message: "Password reset successful. You can now login."
└─ Send to frontend

Step 28: Password Reset Complete
├─ Show success message
├─ Auto-close modal after 2 seconds
├─ Navigate to login page
└─ User can now login with new password → FLOW 2
```

---

## 🔵 FLOW 4: Dashboard Navigation

### Start: User Authenticated and on Dashboard

```
Step 1: Dashboard Home View
├─ URL: /dashboard
├─ Component: Dashboard.tsx
├─ Display Elements:
│  ├─ Header: User avatar, name, logout button
│  ├─ Welcome Message: "Welcome back, [Name]! 🌿"
│  ├─ Stats Cards:
│  │  ├─ Streak Count: [X] days
│  │  ├─ Journal Entries: [X] entries
│  │  ├─ Moods Tracked: [X] moods
│  │  └─ Sessions Booked: [X] sessions
│  ├─ Quick Actions:
│  │  ├─ "Track Your Mood" → FLOW 5
│  │  ├─ "Write in Journal" → FLOW 6
│  │  ├─ "Chat with AI" → FLOW 7
│  │  └─ "Find Therapist" → FLOW 8
│  ├─ Recent Activity:
│  │  ├─ Latest mood entry
│  │  ├─ Latest journal entry
│  │  └─ Upcoming appointments
│  └─ Motivational Quote
└─ Navigation Sidebar:
   ├─ Dashboard (current)
   ├─ AI Chat
   ├─ Mood Tracker
   ├─ Journal
   ├─ Find Therapist
   ├─ Appointments
   ├─ Resources
   └─ Settings

Step 2: Navigation Options
├─ User clicks any sidebar item
├─ React Router handles navigation
├─ URL changes without page reload
└─ New component renders in main area

Navigation Flow Tree:
├─ Click "AI Chat" → Go to FLOW 7
├─ Click "Mood Tracker" → Go to FLOW 5
├─ Click "Journal" → Go to FLOW 6
├─ Click "Find Therapist" → Go to FLOW 8
├─ Click "Appointments" → Go to FLOW 9
├─ Click "Resources" → Go to FLOW 10
├─ Click "Settings" → Go to FLOW 11
└─ Click "Logout" → Go to FLOW 12
```

---

## 🔵 FLOW 5: Mood Tracking

### Start: User Wants to Track Mood

```
Step 1: Navigate to Mood Tracker
├─ From Dashboard: Click "Mood Tracker" in sidebar
├─ URL: /dashboard/mood
├─ Component: MoodTracker.tsx renders
└─ Endpoint: GET /api/moods (load existing moods)

Step 2: Load Existing Moods
├─ useEffect triggers on component mount
├─ API Call: GET /api/moods
├─ Headers:
│  └─ Authorization: Bearer [token]
├─ Backend:
│  ├─ Auth middleware verifies token
│  ├─ Query: Mood.find({ userId: req.user.id })
│  ├─ Sort by date descending
│  └─ Return moods array
├─ Frontend receives moods
└─ Display mood history

Step 3: Mood Tracker Interface
├─ Display:
│  ├─ "How are you feeling today?" heading
│  ├─ Mood Selection (Emoji Grid):
│  │  ├─ 😊 Happy
│  │  ├─ 😢 Sad
│  │  ├─ 😰 Anxious
│  │  ├─ 😌 Calm
│  │  ├─ ⚡ Energetic
│  │  └─ 😴 Tired
│  ├─ Intensity Slider: 1 (Low) to 5 (High)
│  ├─ Optional Fields (Expandable):
│  │  ├─ Emotions (tags): stressed, excited, grateful, etc.
│  │  ├─ Activities: exercise, social, work, study, etc.
│  │  ├─ Energy Level: 1-10 slider
│  │  ├─ Sleep: hours + quality dropdown
│  │  ├─ Social: lots/some/little/none
│  │  └─ Notes: Text area for additional thoughts
│  ├─ Submit Button: "Save Mood"
│  └─ Mood History:
│     ├─ Calendar view
│     ├─ List of recent moods
│     └─ Statistics (mood distribution, trends)
└─ Motion animations on mood emojis

Step 4: User Selects Mood
├─ User clicks mood emoji (e.g., 😊 Happy)
├─ Emoji scales up with animation
├─ Background color changes to match mood
├─ Intensity slider appears
└─ State updated: selectedMood = "happy"

Step 5: User Adjusts Intensity
├─ User drags slider or clicks value
├─ Slider position: 1 to 5
├─ Visual feedback with color intensity
└─ State updated: intensity = [1-5]

Step 6: User Adds Optional Details (Optional)
├─ Click "Add More Details" to expand
├─ Select emotion tags:
│  └─ Click tag → Toggle selected state
├─ Select activities:
│  └─ Click activity icon → Toggle
├─ Adjust energy slider: 1-10
├─ Enter sleep info:
│  ├─ Hours: number input
│  └─ Quality: dropdown (excellent/good/fair/poor)
├─ Select social level: radio buttons
└─ Add notes: Text area (max 500 characters)

Step 7: User Saves Mood
├─ User clicks "Save Mood" button
├─ Frontend validation:
│  ├─ Check mood selected
│  ├─ Check intensity set
│  └─ If invalid: Show error → Return to Step 4
└─ If valid: → Continue

Step 8: API Call - Save Mood
├─ Endpoint: POST /api/moods
├─ Headers:
│  ├─ Authorization: Bearer [token]
│  └─ Content-Type: application/json
├─ Body:
│  ├─ mood: "happy"
│  ├─ intensity: 4
│  ├─ emotions: ["excited", "grateful"]
│  ├─ activities: ["exercise", "social"]
│  ├─ energy: 8
│  ├─ sleep: { hours: 7, quality: "good" }
│  ├─ social: "some"
│  └─ notes: "Had a great workout today!"
└─ Request sent to backend

Step 9: Backend Saves Mood
├─ Server: routes/mood.js
├─ Auth middleware verifies token
├─ Validation:
│  ├─ Check mood is valid value
│  ├─ Check intensity is 1-5
│  └─ Validate optional fields
├─ Create mood document:
│  └─ Mood.create({
       userId: req.user.id,
       mood, intensity, emotions, activities,
       energy, sleep, social, notes,
       timestamp: new Date()
     })
├─ Save to MongoDB
└─ Return saved mood document

Step 10: Frontend Receives Response
├─ Status: 201 Created
├─ Response includes:
│  ├─ success: true
│  └─ data: { mood document with _id }
├─ Add new mood to local state
├─ Show success toast: "Mood saved! 🌟"
├─ Update mood history display
└─ Reset form for new entry

Step 11: Mood Suggestions (AI-Powered)
├─ Based on saved mood, backend generates suggestions
├─ Endpoint: Called internally after mood save
├─ Backend logic (moodSuggestions.js):
│  ├─ Analyze mood, intensity, emotions
│  ├─ Generate personalized suggestions:
│  │  ├─ If anxious: breathing exercises, calming music
│  │  ├─ If sad: journaling prompts, reach out to friend
│  │  ├─ If energetic: challenge workout, creative project
│  │  └─ If tired: rest reminder, sleep tips
│  └─ Return 3-5 actionable suggestions
├─ Frontend displays suggestions card
└─ User can click suggestions for quick actions

Step 12: View Mood Statistics
├─ User scrolls to statistics section
├─ Display:
│  ├─ Most Common Mood: Happy (40%)
│  ├─ Average Intensity: 3.5/5
│  ├─ Mood Distribution Chart:
│  │  └─ Pie chart showing percentage of each mood
│  ├─ Mood Trends:
│  │  └─ Line graph showing intensity over time
│  ├─ Activity Correlations:
│  │  └─ "You feel best after: Exercise, Social"
│  └─ Energy Patterns:
│     └─ "Peak energy: 10 AM - 2 PM"
└─ Statistics updated in real-time

Step 13: Edit or Delete Past Mood
├─ User clicks mood entry in history
├─ Options:
│  ├─ View details
│  ├─ Edit → Open edit modal
│  └─ Delete → Confirmation dialog
└─ Edit Flow:
   ├─ Pre-fill form with existing data
   ├─ API: PUT /api/moods/:id
   └─ Update in history
   Delete Flow:
   ├─ Confirm deletion
   ├─ API: DELETE /api/moods/:id
   └─ Remove from history
```

---

## 🔵 FLOW 6: Journaling

### Start: User Wants to Write Journal Entry

```
Step 1: Navigate to Journal
├─ From Dashboard: Click "Journal" in sidebar
├─ URL: /dashboard/journal
├─ Component: Journal.tsx renders
└─ Load existing entries

Step 2: Load Existing Journals
├─ API Call: GET /api/journals
├─ Headers:
│  └─ Authorization: Bearer [token]
├─ Backend:
│  ├─ Verify token
│  ├─ Query: Journal.find({ userId: req.user.id })
│  ├─ Sort by createdAt descending
│  └─ Return journals array
├─ Frontend receives journals
└─ Display journal entries

Step 3: Journal Interface
├─ Display:
│  ├─ Header: "Your Journal 📔"
│  ├─ "New Entry" button
│  ├─ Search bar
│  ├─ Filter options: All, Favorites, By Tag
│  ├─ Journal entries list:
│  │  ├─ Title
│  │  ├─ Date
│  │  ├─ Preview (first 100 characters)
│  │  ├─ Tags
│  │  └─ Favorite star icon
│  └─ Statistics:
│     ├─ Total entries
│     ├─ Total words written
│     └─ Most used tags
└─ Empty state if no entries: "Start your journaling journey..."

Step 4: Create New Entry
├─ User clicks "New Entry" button
├─ Modal or new page opens
└─ Editor interface displays

Step 5: Journal Editor Form
├─ Form Fields:
│  ├─ Title: Text input (required)
│  ├─ Content: Large text area (required, rich text)
│  ├─ Mood: Optional dropdown (links to mood)
│  └─ Tags: Tag input (comma-separated)
├─ Features:
│  ├─ Auto-save draft (every 30 seconds)
│  ├─ Word count display
│  ├─ Character count
│  └─ Last saved timestamp
└─ Action buttons:
   ├─ Save
   ├─ Cancel
   └─ Add to Favorites checkbox

Step 6: User Writes Entry
├─ User types title: e.g., "Reflections on Today"
├─ User writes content in text area
├─ Auto-save triggers every 30 seconds:
│  └─ Save to localStorage as draft
├─ User adds tags: "reflection, gratitude, growth"
├─ User optionally links to mood
└─ Word count updates in real-time

Step 7: User Saves Entry
├─ User clicks "Save" button
├─ Frontend validation:
│  ├─ Check title not empty
│  ├─ Check content not empty
│  └─ If invalid: Show error → Return to Step 6
└─ If valid: → Continue

Step 8: API Call - Save Journal
├─ Endpoint: POST /api/journals
├─ Headers:
│  ├─ Authorization: Bearer [token]
│  └─ Content-Type: application/json
├─ Body:
│  ├─ title: "Reflections on Today"
│  ├─ content: "[full journal text]"
│  ├─ mood: "happy" (optional)
│  ├─ tags: ["reflection", "gratitude", "growth"]
│  └─ isFavorite: false
└─ Request sent to backend

Step 9: Backend Saves Journal
├─ Server: routes/journal.js
├─ Auth middleware verifies token
├─ Validation:
│  ├─ Check title and content present
│  └─ Validate tags format
├─ Create journal document:
│  └─ Journal.create({
       userId: req.user.id,
       title, content, mood, tags,
       isFavorite: false,
       wordCount: content.split(' ').length,
       characterCount: content.length
     })
├─ Save to MongoDB
└─ Return saved journal document

Step 10: Frontend Receives Response
├─ Status: 201 Created
├─ Response includes:
│  ├─ success: true
│  └─ data: { journal document }
├─ Add new journal to local state
├─ Show success toast: "Journal entry saved! ✍️"
├─ Close editor
├─ Update journal list
└─ Clear draft from localStorage

Step 11: View Journal Entry
├─ User clicks journal entry from list
├─ Modal or detail page opens
├─ Display:
│  ├─ Title
│  ├─ Date and time
│  ├─ Full content
│  ├─ Tags
│  ├─ Linked mood (if any)
│  ├─ Word count
│  └─ Actions:
│     ├─ Edit
│     ├─ Delete
│     ├─ Toggle Favorite
│     └─ Share (future)
└─ Scroll through content

Step 12: Edit Journal Entry
├─ User clicks "Edit" button
├─ Editor opens with pre-filled data
├─ User makes changes
├─ User clicks "Update"
├─ API Call: PUT /api/journals/:id
├─ Backend updates document
├─ Frontend updates entry in list
└─ Show success toast: "Entry updated!"

Step 13: Delete Journal Entry
├─ User clicks "Delete" button
├─ Confirmation dialog: "Are you sure?"
├─ User confirms
├─ API Call: DELETE /api/journals/:id
├─ Backend deletes document
├─ Frontend removes from list
└─ Show toast: "Entry deleted"

Step 14: Search Journals
├─ User types in search bar
├─ Frontend: Filter locally OR
├─ API Call: GET /api/journals/search?q=[query]
├─ Backend searches title and content
├─ Display matching results
└─ Highlight search terms

Step 15: Toggle Favorite
├─ User clicks star icon on entry
├─ API Call: PATCH /api/journals/:id/favorite
├─ Backend toggles isFavorite field
├─ Frontend updates icon state
└─ Entry moves to favorites filter

Step 16: View Statistics
├─ Display in sidebar or footer:
│  ├─ Total Entries: 24
│  ├─ Total Words: 12,450
│  ├─ Average Words/Entry: 518
│  ├─ Most Used Tags:
│  │  ├─ reflection (8)
│  │  ├─ gratitude (6)
│  │  └─ growth (5)
│  └─ Journaling Streak: 7 days
└─ Update after each new entry
```

---

## 🔵 FLOW 7: AI Chat

### Start: User Wants to Chat with AI

```
Step 1: Navigate to AI Chat
├─ From Dashboard: Click "AI Chat" in sidebar
├─ URL: /dashboard/chat
├─ Component: AIChat.tsx renders
└─ Initialize Botpress webchat

Step 2: AI Chat Interface
├─ Display:
│  ├─ Header: "Chat with AI Companion 🤖"
│  ├─ Botpress webchat iframe embedded
│  ├─ Chat window:
│  │  ├─ Welcome message from AI
│  │  ├─ Suggested conversation starters
│  │  └─ Chat history (if exists)
│  ├─ Input field at bottom
│  └─ Send button
└─ Botpress initializes

Step 3: Botpress Initialization
├─ Load Botpress script from CDN
├─ Configuration:
│  ├─ botId: from environment variable
│  ├─ hostUrl: Botpress CDN
│  └─ messagingUrl: Botpress messaging server
├─ Connect to Botpress backend
└─ Load user conversation history

Step 4: AI Greeting
├─ AI sends welcome message:
│  "Hi! I'm your AI companion. How are you feeling today?"
├─ Display suggested topics:
│  ├─ "I'm feeling anxious"
│  ├─ "I need someone to talk to"
│  ├─ "I'm stressed about school"
│  └─ "I want to feel better"
└─ User can click suggestion or type freely

Step 5: User Sends Message
├─ User types message: "I'm feeling anxious about my exams"
├─ User clicks send or presses Enter
├─ Message appears in chat window
├─ Show "AI is typing..." indicator
└─ Message sent to Botpress

Step 6: Botpress Processing
├─ Message sent to Botpress NLP engine
├─ Processes:
│  ├─ Natural language understanding
│  ├─ Intent recognition: "anxiety" + "exams"
│  ├─ Entity extraction: exam stress
│  └─ Context management: Remember conversation
├─ Generate appropriate response
└─ Return AI response

Step 7: AI Responds
├─ AI message appears in chat
├─ Example response:
│  "I understand that exam anxiety can be overwhelming. 
│   It's completely normal to feel this way. 
│   Let's work through this together. 
│   Have you tried any relaxation techniques?"
├─ May include:
│  ├─ Follow-up questions
│  ├─ Suggested actions
│  └─ Resources links
└─ "AI is typing..." disappears

Step 8: Conversation Continues
├─ User continues chatting
├─ Each message goes through Steps 5-7
├─ AI maintains context:
│  ├─ Remembers previous messages
│  ├─ Personalizes responses
│  └─ Builds therapeutic rapport
└─ Unlimited back-and-forth

Step 9: AI Provides Resources (Conditional)
├─ If AI detects need, suggests:
│  ├─ Breathing exercises
│  ├─ Coping strategies
│  ├─ Professional help resources
│  ├─ Crisis helpline (if urgent)
│  └─ Relevant articles from Resources section
├─ Click links to access resources
└─ AI explains how to use each resource

Step 10: Save Chat History (Optional)
├─ Chat automatically saved to Botpress
├─ Can also save to ZenMind database:
│  ├─ API Call: POST /api/chat/save
│  ├─ Body: { message, fromBot, timestamp }
│  └─ Saved with userId
├─ Access history later
└─ Privacy: User can delete history

Step 11: End Chat Session
├─ User can:
│  ├─ Close chat window
│  ├─ Navigate away (chat persists)
│  └─ Start new conversation
├─ AI sends closing message:
│  "Take care! I'm here whenever you need to talk. 💙"
└─ Conversation saved for next time

Step 12: View Chat History
├─ API Call: GET /api/chat/history
├─ Backend returns past conversations
├─ Display in sidebar or separate view
├─ Can search past messages
└─ Can delete specific conversations

Special Flow: Crisis Detection
├─ If AI detects crisis keywords:
│  ├─ "suicide", "self-harm", "want to die"
│  └─ AI responds with:
│     ├─ Immediate support resources
│     ├─ Crisis helpline numbers
│     ├─ Urgent care message
│     └─ Encouragement to reach out
└─ May notify system for follow-up
```

---

## 🔵 FLOW 8: Find and Book Therapist (WORKING UP TO PAYMENT)

### Start: User Wants Professional Help

```
Step 1: Navigate to Therapist Search
├─ From Dashboard: Click "Find Therapist" card
├─ URL: /dashboard/therapists
├─ Component: TherapistDashboardNew.tsx renders
└─ Load therapists

Step 2: Load Therapists from Database
├─ API Call: GET /api/therapists
├─ Headers:
│  └─ Authorization: Bearer [token]
├─ Backend:
│  ├─ Verify token
│  ├─ Query: TherapistAuth.find()
│  ├─ Calculate dynamic pricing for each:
│  │  ├─ If experience >= 10 years: ₹800-₹1000/session
│  │  ├─ If experience 5-9 years: ₹650-₹800/session
│  │  └─ If experience < 5 years: ₹500-₹650/session
│  └─ Return therapists array
├─ Frontend receives 15 therapists
└─ Display therapist grid

Step 3: Therapist Listing Display
├─ Display for each therapist:
│  ├─ Profile Picture
│  ├─ Name (e.g., "Dr. Sarah Johnson")
│  ├─ Specialties (tags): Anxiety, Depression, Stress
│  ├─ Experience: "10 years"
│  ├─ Rating: 4.8 ★★★★★ (32 reviews)
│  ├─ Languages: English, Hindi
│  ├─ Verified Badge: ✓ Verified
│  ├─ Price: "₹900 per session"
│  └─ "Book Session" button
├─ Filter Options:
│  ├─ By Specialty: All, Anxiety, Depression, etc.
│  ├─ By Experience: All, 5+, 10+ years
│  ├─ By Price: All, Under ₹700, ₹700-₹900, ₹900+
│  └─ Sort: Featured, Price (low-high), Rating
└─ Search bar: Search by name or specialty

Step 4: Filter Therapists (Optional)
├─ User selects filter: "Anxiety"
├─ Frontend filters locally OR
├─ API Call: GET /api/therapists?specialty=anxiety
├─ Display only matching therapists
└─ Show result count: "12 therapists found"

Step 5: View Therapist Profile
├─ User clicks therapist card
├─ Detailed modal or page opens
├─ Display:
│  ├─ Full profile information
│  ├─ Bio and background
│  ├─ Education and certifications
│  ├─ Specialties with descriptions
│  ├─ Approach and techniques
│  ├─ Languages spoken
│  ├─ Availability overview
│  ├─ Reviews and ratings:
│  │  ├─ Average rating
│  │  ├─ Individual reviews
│  │  └─ Rating distribution
│  └─ Pricing information
└─ "Book Session" button prominent

Step 6: Initiate Booking
├─ User clicks "Book Session" button
├─ Check if user authenticated:
│  ├─ If not: Redirect to login → FLOW 2
│  └─ If yes: → Continue
├─ BookingModalNew.tsx opens
└─ Load booking form

Step 7: Booking Modal Display
├─ Display:
│  ├─ Therapist summary:
│  │  ├─ Name
│  │  ├─ Avatar
│  │  ├─ Specialties
│  │  └─ Base price per session
│  ├─ Session Duration Selector:
│  │  └─ Interactive slider component
│  ├─ Duration options: 30 or 60 minutes
│  ├─ Initial selection: 30 minutes
│  ├─ Calculated price display
│  ├─ Privacy notice:
│  │  "Your identity will remain anonymous during the session"
│  └─ "Continue to Payment" button
└─ Duration slider prominently displayed

Step 8: Select Session Duration
├─ Component: DurationSelector.tsx
├─ Slider Interface:
│  ├─ Visual slider with two stops: 30 and 60
│  ├─ Animated transitions
│  ├─ Haptic feedback (if mobile)
│  └─ Color changes based on duration
├─ User drags slider or clicks value
├─ Options:
│  ├─ 30 minutes (default)
│  └─ 60 minutes
├─ Real-time price calculation:
│  └─ amount = (therapist.pricing.perSession / 30) * duration
├─ Price updates instantly
└─ Example:
   ├─ Base: ₹900 per 30-minute session
   ├─ 30 min selected → Display: ₹900
   └─ 60 min selected → Display: ₹1800

Step 9: Review Booking Details
├─ User reviews:
│  ├─ Therapist name
│  ├─ Selected duration: 60 minutes
│  ├─ Calculated amount: ₹1800
│  ├─ Session type: Video Call (Anonymous)
│  └─ Privacy reminder
├─ User confirms selection
└─ Clicks "Continue to Payment"

Step 10: Open Fake Payment Modal
├─ FakePaymentModal.tsx opens
├─ Display:
│  ├─ Payment summary:
│  │  ├─ Therapist: Dr. Sarah Johnson
│  │  ├─ Duration: 60 minutes
│  │  ├─ Amount: ₹1800
│  │  └─ Session ID: Generated
│  ├─ Fake payment UI:
│  │  ├─ Credit card input fields (fake)
│  │  ├─ UPI option (fake)
│  │  ├─ Wallet option (fake)
│  │  └─ "This is a demo payment system"
│  ├─ Privacy assurance
│  └─ "Complete Payment" button
└─ Professional payment-like interface

Step 11: User Initiates Payment
├─ User reviews payment details
├─ User clicks "Complete Payment"
├─ Show processing spinner
└─ Simulate payment processing (1.5 seconds)

Step 12: Process Fake Payment
├─ Frontend:
│  └─ Simulate delay: setTimeout(1500ms)
├─ No actual payment gateway
├─ Generate fake transaction data:
│  └─ transactionId = "FAKE_" + timestamp + random string
├─ Example: "FAKE_1699588903_k7j2h"
└─ Proceed to booking creation

Step 13: API Call - Create Booking
├─ Endpoint: POST /api/booking/instant-book
├─ Headers:
│  ├─ Authorization: Bearer [token]
│  └─ Content-Type: application/json
├─ Body:
│  ├─ therapistId: "654e7f638..."
│  └─ duration: 60
└─ Request sent to backend

Step 14: Backend Creates Appointment
├─ Server: routes/booking.js
├─ Auth middleware verifies token
├─ Validation:
│  ├─ Check therapistId present
│  ├─ Check duration is 30 or 60
│  └─ If invalid: Return 400 error
├─ Find therapist in database
├─ If therapist not found: Return 404 error
└─ If found: → Continue

Step 15: Check Therapist Availability
├─ Check therapist.currentSession.isActive
├─ If therapist busy:
│  ├─ Check if session expired
│  ├─ If not expired:
│  │  ├─ Return 400: "Therapist is currently busy"
│  │  └─ Frontend shows error: "Please try again later"
│  └─ If expired: Clear session and continue
└─ If therapist available: → Continue

Step 16: Calculate Session Times
├─ Get current time: now = new Date()
├─ Calculate session start:
│  └─ sessionStart = now + 5 minutes
│  └─ (Session joins unlock 5 min before actual start)
├─ Calculate session end:
│  └─ sessionEnd = sessionStart + duration
├─ Format times:
│  ├─ startTime = "14:35" (24-hour format)
│  └─ endTime = "15:35"
└─ Times calculated in server timezone

Step 17: Calculate Pricing
├─ Get therapist base price: ₹900 per 30-min session
├─ Calculate per-minute rate:
│  └─ perMinuteRate = therapist.pricing.perSession / 30
│  └─ Example: ₹900 / 30 = ₹30 per minute
├─ Calculate total amount:
│  └─ amount = perMinuteRate * duration
│  └─ Example: ₹30 * 60 = ₹1800
└─ Round up: Math.ceil(amount)

Step 18: Generate Meeting Details
├─ Create fake transaction ID:
│  └─ "FAKE_" + Date.now() + "_" + random(7 chars)
│  └─ Example: "FAKE_1699588903_abc123x"
├─ Create Jitsi meeting link:
│  └─ "https://meet.jit.si/zenmind-" + timestamp + "-" + random
│  └─ Example: "https://meet.jit.si/zenmind-1699588903-xyz789"
└─ Unique link for this session

Step 19: Create Appointment Document
├─ Appointment.create({
     userId: req.user.id,
     therapistId: therapist._id,
     therapistName: therapist.name,
     therapistAvatar: therapist.profilePicture,
     date: sessionStart,
     startTime: "14:35",
     endTime: "15:35",
     duration: 60,
     type: "video",
     status: "scheduled",
     payment: {
       amount: 1800,
       currency: "INR",
       status: "completed",
       transactionId: "FAKE_1699588903_abc123x",
       paidAt: new Date(),
       method: "fake_payment"
     },
     meetingLink: "https://meet.jit.si/zenmind-1699588903-xyz789"
   })
├─ Save to MongoDB
└─ Appointment created successfully

Step 20: Update Therapist Status
├─ Update therapist.currentSession:
│  └─ {
       isActive: true,
       appointmentId: appointment._id,
       startedAt: sessionStart,
       endsAt: sessionEnd
     }
├─ Save therapist document
└─ Therapist now marked as busy

Step 21: Send Confirmation Emails (Parallel)
├─ Find user: User.findById(req.user.id)
├─ Email to Teen:
│  ├─ Function: sendAppointmentEmail(user.email, user.name, details)
│  ├─ Details:
│  │  ├─ therapistName: "Dr. Sarah Johnson"
│  │  ├─ date: Formatted date string
│  │  ├─ startTime: "14:35"
│  │  ├─ endTime: "15:35"
│  │  ├─ duration: 60
│  │  └─ amount: 1800
│  ├─ Send via Brevo API
│  └─ Non-blocking (fire and forget)
├─ Email to Therapist:
│  ├─ Function: sendTherapistAppointmentEmail(therapist.email, therapist.name, details)
│  ├─ Details include "Anonymous Teen" as client
│  ├─ Send via Brevo API
│  └─ Non-blocking
└─ Log results but don't block response

Step 22: Return Success Response
├─ Status: 200 OK
├─ Response Body:
│  ├─ success: true
│  ├─ message: "Booking confirmed! Check your email."
│  └─ data:
│     └─ appointment: { full appointment document }
└─ Send to frontend

Step 23: Frontend Receives Confirmation
├─ Close fake payment modal
├─ Show success toast:
│  "🎉 Session booked successfully! Check your email for details."
├─ Store appointment in local state
└─ Navigate to: /dashboard/appointments

Step 24: Appointments Page Loads
├─ URL: /dashboard/appointments
├─ Component: AppointmentsNew.tsx
├─ Load all appointments:
│  └─ API: GET /api/appointments
├─ Display new appointment in "Upcoming Sessions"
└─ User sees booking confirmation

Step 25: Email Delivery (Parallel Process)
├─ Teen receives email:
│  ├─ Subject: "✅ ZenMind Therapy Session Confirmed"
│  ├─ Content:
│  │  ├─ Therapist name (real): Dr. Sarah Johnson
│  │  ├─ Date and time
│  │  ├─ Duration: 60 minutes
│  │  ├─ Amount paid: ₹1800
│  │  ├─ Privacy reminder (anonymous session)
│  │  └─ Instructions to join
│  └─ Arrives in inbox within seconds
├─ Therapist receives email:
│  ├─ Subject: "📅 New Session Booked - ZenMind"
│  ├─ Content:
│  │  ├─ Client name: "Anonymous Teen" (protected)
│  │  ├─ Date and time
│  │  ├─ Duration: 60 minutes
│  │  ├─ Session fee: ₹1800
│  │  ├─ Privacy reminder
│  │  └─ Instructions to prepare
│  └─ Arrives in therapist's inbox
└─ Both emails tracked by Brevo

Step 26: Database State
├─ MongoDB updated with:
│  ├─ New appointment document in "appointments" collection
│  ├─ Updated therapist document with currentSession active
│  └─ All data persisted
└─ Ready for future operations

⚠️ CURRENT STATUS:
✅ Working up to this point:
   - Therapist browsing
   - Duration selection
   - Price calculation
   - Fake payment
   - Booking creation
   - Email notifications
   - Appointment storage

❌ Not Working (Future Implementation):
   - Step 27 onwards (session joining)
   - Video conferencing
   - Post-session feedback
   - Therapist dashboard features

---

FUTURE IMPLEMENTATION (Not Currently Working):

Step 27: Wait Period Before Session [FUTURE]
├─ Session scheduled for 5 minutes from booking
├─ User should see countdown in appointments
├─ "Join Session" button should be disabled
├─ Timer displays: "Session starts in 4:32"
└─ Button unlocks 30 seconds before session start

Step 28: Join Session [FUTURE]
├─ User clicks "Join Session" button (currently not working)
├─ API Call: POST /api/booking/join-session/:appointmentId
├─ Backend validates:
│  ├─ Session time is within window
│  ├─ User is participant
│  └─ Session not already ended
├─ Return meeting link
└─ Open video conference

Step 29: Video Conference [FUTURE]
├─ Load JitsiVideoCall.tsx component (currently buggy)
├─ Connect to Jitsi server
├─ User joins as "Anonymous Teen"
├─ Therapist joins with real name
├─ Video call features:
│  ├─ Audio/video controls
│  ├─ Chat
│  ├─ Screen share
│  └─ End call button
└─ Session duration tracked

Step 30: End Session [FUTURE]
├─ At scheduled end time or manual end
├─ Update appointment status to "completed"
├─ Clear therapist busy status after 10-min buffer
├─ Generate session summary
└─ Trigger post-session flow

Step 31: Post-Session Feedback [FUTURE]
├─ Rating modal appears (currently not working)
├─ User rates therapist: 1-5 stars
├─ User writes review (optional)
├─ API: POST /api/reviews/submit
├─ Backend saves review
├─ Updates therapist rating
└─ Thank you message
```

---

## 🔵 FLOW 9: Appointment Management

### Start: User Wants to View Appointments

```
Step 1: Navigate to Appointments
├─ From Dashboard: Click "Appointments" in sidebar
├─ URL: /dashboard/appointments
├─ Component: AppointmentsNew.tsx renders
└─ Load appointments

Step 2: Load Appointments from Backend
├─ API Call: GET /api/appointments
├─ Headers:
│  └─ Authorization: Bearer [token]
├─ Backend:
│  ├─ Verify token
│  ├─ Query: Appointment.find({ userId: req.user.id })
│  ├─ Populate therapist details
│  ├─ Sort by date descending
│  └─ Return appointments array
├─ Frontend receives appointments
└─ Process and categorize

Step 3: Categorize Appointments
├─ Frontend logic:
│  ├─ Get current date/time
│  ├─ Separate into two arrays:
│  │  ├─ Upcoming: date > now && status === "scheduled"
│  │  └─ Past: date <= now || status === "completed"/"cancelled"
│  └─ Sort each array
├─ State updated
└─ Ready to display

Step 4: Appointments Page Display
├─ Layout:
│  ├─ Header: "My Appointments 📅"
│  ├─ Summary Stats:
│  │  ├─ Total sessions: [count]
│  │  ├─ Upcoming: [count]
│  │  └─ Past: [count]
│  ├─ Tabs:
│  │  ├─ Upcoming Sessions (active by default)
│  │  └─ Past Sessions
│  └─ Filter/Sort Options:
│     ├─ Sort by: Date, Therapist, Amount
│     └─ Filter by: All, This Week, This Month
└─ Empty state if no appointments

Step 5: Upcoming Sessions Tab
├─ Display each appointment card:
│  ├─ Therapist Info:
│  │  ├─ Avatar
│  │  ├─ Name
│  │  └─ Specialties
│  ├─ Session Details:
│  │  ├─ Date: "Wednesday, November 27, 2025"
│  │  ├─ Time: "14:35 - 15:35"
│  │  ├─ Duration: "60 minutes"
│  │  └─ Status badge: "Scheduled"
│  ├─ Payment Info:
│  │  ├─ Amount: "₹1800"
│  │  ├─ Payment status: "Paid"
│  │  └─ Transaction ID (collapsible)
│  ├─ Countdown Timer:
│  │  └─ "Starts in: 2 days, 3 hours"
│  ├─ Action Buttons:
│  │  ├─ "Join Session" (disabled until unlock time) [FUTURE]
│  │  ├─ "View Details"
│  │  └─ "Cancel Appointment"
│  └─ Privacy Reminder:
│     "Your identity is protected during this session"
└─ Cards sorted by date (earliest first)

Step 6: View Appointment Details
├─ User clicks "View Details"
├─ Detailed modal opens
├─ Display:
│  ├─ Full therapist profile summary
│  ├─ Complete session information
│  ├─ Payment breakdown
│  ├─ Meeting link (hidden until join time) [FUTURE]
│  ├─ Privacy policy
│  ├─ Cancellation policy
│  └─ Support contact
└─ Close button

Step 7: Cancel Appointment Flow
├─ User clicks "Cancel Appointment"
├─ Confirmation dialog opens:
│  ├─ Warning: "Are you sure you want to cancel?"
│  ├─ Refund information:
│  │  ├─ Original amount: ₹1800
│  │  ├─ Platform fee (10%): ₹180
│  │  └─ Refund amount: ₹1620
│  ├─ Cancellation reason field (optional)
│  └─ Buttons: "Cancel Appointment" / "Keep Appointment"
└─ User must confirm or cancel

Step 8: User Confirms Cancellation
├─ User clicks "Cancel Appointment" in dialog
├─ User optionally enters reason:
│  └─ e.g., "Schedule conflict"
└─ Proceed to cancellation API call

Step 9: API Call - Cancel Appointment
├─ Endpoint: POST /api/refunds/cancel-appointment/:appointmentId
├─ Headers:
│  ├─ Authorization: Bearer [token]
│  └─ Content-Type: application/json
├─ Body:
│  └─ reason: "Schedule conflict" (optional)
└─ Request sent to backend

Step 10: Backend Processes Cancellation
├─ Server: routes/refund.js
├─ Auth middleware verifies token
├─ Find appointment:
│  └─ Appointment.findById(appointmentId)
├─ Validate:
│  ├─ Appointment exists
│  ├─ Belongs to requesting user
│  ├─ Status is "scheduled"
│  └─ If validation fails: Return error
└─ If validation passes: → Continue

Step 11: Calculate Refund Amount
├─ Get original payment amount: ₹1800
├─ Platform fee: 10%
├─ Calculate:
│  ├─ platformFee = (1800 * 10) / 100 = ₹180
│  └─ refundAmount = 1800 - 180 = ₹1620
└─ Refund breakdown prepared

Step 12: Update Appointment Status
├─ Update appointment document:
│  ├─ status = "cancelled"
│  ├─ cancellationReason = reason
│  ├─ cancelledAt = new Date()
│  └─ cancellationDetails = refund breakdown
├─ Save to MongoDB
└─ Appointment cancelled

Step 13: Update Therapist Availability
├─ Find therapist: TherapistAuth.findById(therapistId)
├─ Clear therapist busy status:
│  └─ currentSession = {
       isActive: false,
       appointmentId: null,
       startedAt: null,
       endsAt: null
     }
├─ Save therapist document
└─ Therapist now available for bookings

Step 14: Send Cancellation Emails (Parallel)
├─ Email to Teen:
│  ├─ Function: sendCancellationEmailToUser()
│  ├─ Subject: "❌ Session Cancelled - ZenMind"
│  ├─ Content:
│  │  ├─ Cancellation confirmation
│  │  ├─ Session details
│  │  ├─ Refund breakdown with platform fee
│  │  ├─ Refund timeline: "5-7 business days"
│  │  └─ Rebooking encouragement
│  ├─ Send via Brevo
│  └─ Non-blocking
├─ Email to Therapist:
│  ├─ Function: sendCancellationEmailToTherapist()
│  ├─ Subject: "❌ Session Cancelled - ZenMind"
│  ├─ Content:
│  │  ├─ Cancellation notice
│  │  ├─ Anonymous teen cancelled
│  │  ├─ Session details
│  │  ├─ Reason (if provided)
│  │  ├─ Slot now available
│  │  └─ Payment note: No payment for cancelled session
│  ├─ Send via Brevo
│  └─ Non-blocking
└─ Log email results

Step 15: Return Success Response
├─ Status: 200 OK
├─ Response Body:
│  ├─ success: true
│  ├─ message: "Appointment cancelled and refund processed"
│  └─ data:
│     └─ refund:
│        ├─ originalAmount: 1800
│        ├─ platformFee: 180
│        ├─ platformFeePercentage: 10
│        └─ refundAmount: 1620
└─ Send to frontend

Step 16: Frontend Updates After Cancellation
├─ Update appointment status in local state
├─ Move appointment from "Upcoming" to "Past"
├─ Show success toast:
│  "Appointment cancelled. Refund of ₹1620 processed."
├─ Display refund breakdown in notification
└─ Update stats (upcoming count decreased)

Step 17: Past Sessions Tab
├─ User switches to "Past Sessions" tab
├─ Display completed/cancelled appointments
├─ Each card shows:
│  ├─ Therapist info
│  ├─ Date and time
│  ├─ Duration
│  ├─ Status: "Completed" or "Cancelled"
│  ├─ Amount (or refund if cancelled)
│  └─ Actions:
│     ├─ "View Details"
│     ├─ "Leave Review" [FUTURE - if completed]
│     └─ "Book Again" (same therapist)
└─ Sorted by date (most recent first)

Step 18: Leave Review [FUTURE - NOT WORKING]
├─ User clicks "Leave Review" on completed session
├─ Rating modal opens
├─ Form:
│  ├─ Star rating: 1-5 stars
│  ├─ Review text (optional)
│  └─ Submit button
├─ API: POST /api/reviews/submit
├─ Backend saves review
├─ Updates therapist rating
└─ Thank you message

Step 19: Clear Past Sessions
├─ "Clear Past Sessions" button at bottom
├─ Confirmation: "Delete all past sessions?"
├─ If confirmed:
│  ├─ API: DELETE /api/appointments/clear-past
│  ├─ Backend deletes completed/cancelled appointments
│  └─ Frontend removes from list
└─ Clean up old data

Step 20: Book Again
├─ User clicks "Book Again" on past session
├─ Navigate to: /dashboard/therapists
├─ Pre-select same therapist
├─ Open booking modal
└─ Follow FLOW 8 (booking process)
```

---

## 🔵 FLOW 10: Resources Section

### Start: User Wants Mental Health Resources

```
Step 1: Navigate to Resources
├─ From Dashboard: Click "Resources" in sidebar
├─ URL: /dashboard/resources
├─ Component: Resources.tsx renders
└─ Load resources

Step 2: Load Resources from Backend
├─ API Call: GET /api/resources
├─ Headers:
│  └─ Authorization: Bearer [token]
├─ Backend:
│  ├─ Verify token
│  ├─ Query: Resource.find()
│  ├─ Optionally filter by category
│  └─ Return resources array
├─ Frontend receives resources
└─ Display resources

Step 3: Resources Page Display
├─ Layout:
│  ├─ Header: "Mental Health Resources 📚"
│  ├─ Search Bar: Search resources
│  ├─ Category Tabs:
│  │  ├─ All
│  │  ├─ Anxiety
│  │  ├─ Depression
│  │  ├─ Stress
│  │  ├─ Crisis
│  │  └─ General Wellness
│  ├─ Featured Resources (top 3)
│  └─ Resource Cards Grid
└─ Responsive layout

Step 4: Browse Resources
├─ Each resource card shows:
│  ├─ Title
│  ├─ Category badge
│  ├─ Type: Article, Video, Podcast, Tool
│  ├─ Brief description
│  ├─ Read time or duration
│  ├─ Likes count
│  └─ "View" button
└─ Click to view details

Step 5: Filter by Category
├─ User clicks category tab: e.g., "Anxiety"
├─ Frontend filters locally OR
├─ API Call: GET /api/resources?category=anxiety
├─ Display only matching resources
└─ Update result count

Step 6: Search Resources
├─ User types in search bar: e.g., "coping strategies"
├─ API Call: GET /api/resources/search?q=coping+strategies
├─ Backend searches title and description
├─ Display matching results
└─ Highlight search terms

Step 7: View Resource Details
├─ User clicks "View" button
├─ Detailed page or modal opens
├─ Display:
│  ├─ Full title
│  ├─ Category and type
│  ├─ Full description
│  ├─ Content:
│  │  ├─ If Article: Full text or link
│  │  ├─ If Video: Embedded player
│  │  ├─ If Podcast: Audio player
│  │  └─ If Tool: Interactive widget
│  ├─ Related resources
│  ├─ Like button
│  ├─ Share button
│  └─ Download button (if applicable)
└─ Track view count

Step 8: Crisis Resources
├─ Special "Crisis" category
├─ Prominent placement
├─ Display:
│  ├─ 24/7 helpline numbers:
│  │  ├─ National Suicide Prevention: 1-800-273-8255
│  │  ├─ Crisis Text Line: Text HOME to 741741
│  │  └─ Local emergency: 911 / 112
│  ├─ Immediate support articles
│  ├─ Safety planning tools
│  └─ Emergency contact guidance
└─ Always accessible

Step 9: Interactive Tools
├─ Resources can include tools:
│  ├─ Breathing Exercise: Guided visual breathing
│  ├─ Mood Journal Prompt Generator
│  ├─ Anxiety Tracker
│  └─ Relaxation Techniques Guide
├─ User interacts directly in resource
└─ Can save tool progress (future)

Step 10: Like Resource
├─ User clicks like/heart icon
├─ API Call: PATCH /api/resources/:id/like
├─ Backend increments like count
├─ Frontend updates icon (filled heart)
└─ User sees confirmation

Step 11: Download Resource (If Available)
├─ User clicks "Download" button
├─ API Call: GET /api/resources/:id/download
├─ Backend:
│  ├─ Increment download count
│  └─ Return file or redirect to file
├─ Frontend initiates download
└─ File saves to user's device
```

---

## 🔵 FLOW 11: Settings & Profile Management

### Start: User Wants to Update Settings

```
Step 1: Navigate to Settings
├─ From Dashboard: Click "Settings" in sidebar
├─ URL: /dashboard/settings
├─ Component: Settings.tsx renders
└─ Load current user settings

Step 2: Settings Page Display
├─ Tabs:
│  ├─ Profile (default)
│  ├─ Account
│  ├─ Privacy
│  ├─ Notifications
│  └─ Appearance
└─ Each tab has different options

Step 3: Profile Tab
├─ Display current profile:
│  ├─ Avatar (with edit button)
│  ├─ Name
│  ├─ Email (non-editable)
│  ├─ Age
│  ├─ Bio
│  ├─ Pronouns
│  ├─ Gender
│  └─ Interests (tags)
├─ Edit form
└─ Save button

Step 4: Update Profile
├─ User edits fields
├─ User clicks "Save Changes"
├─ Frontend validation
├─ API Call: PUT /api/users/me
├─ Body: Updated profile data
├─ Backend updates user document
├─ Return updated user
├─ Frontend updates local state
└─ Show toast: "Profile updated!"

Step 5: Change Avatar
├─ User clicks avatar edit button
├─ Avatar selector modal opens
├─ Options:
│  ├─ Pre-defined avatars (grid)
│  ├─ Upload custom image [future]
│  └─ Remove avatar (default)
├─ User selects avatar
├─ API Call: PUT /api/users/me/avatar
├─ Body: { avatar: url }
├─ Backend updates user.avatar
├─ Frontend updates display
└─ Show toast: "Avatar updated!"

Step 6: Account Tab
├─ Display:
│  ├─ Email (non-editable)
│  ├─ Account created date
│  ├─ Subscription plan
│  ├─ Change Password section
│  └─ Delete Account section
└─ Each with corresponding actions

Step 7: Change Password
├─ User clicks "Change Password"
├─ Form appears:
│  ├─ Current password
│  ├─ New password
│  └─ Confirm new password
├─ User fills form
├─ User clicks "Update Password"
├─ Frontend validation:
│  ├─ Current password not empty
│  ├─ New password meets requirements
│  └─ Passwords match
├─ API Call: PUT /api/users/me/password
├─ Body: { currentPassword, newPassword }
├─ Backend:
│  ├─ Verify current password
│  ├─ Hash new password
│  └─ Update user
├─ Frontend shows success
└─ User must re-login

Step 8: Delete Account
├─ User clicks "Delete Account"
├─ Warning dialog:
│  ├─ "This action is permanent"
│  ├─ List what will be deleted:
│  │  ├─ Profile and account
│  │  ├─ All journal entries
│  │  ├─ All mood tracking data
│  │  ├─ Chat history
│  │  └─ All appointments
│  └─ Confirmation: Type "DELETE" to confirm
├─ User confirms
├─ API Call: DELETE /api/users/me
├─ Backend:
│  ├─ Delete all user data
│  ├─ Cancel active appointments
│  └─ Remove user document
├─ Frontend logs out
└─ Redirect to landing page

Step 9: Privacy Tab
├─ Display options:
│  ├─ Profile visibility:
│  │  └─ Radio: Public / Private
│  ├─ Share progress with therapist:
│  │  └─ Toggle switch
│  ├─ Data collection:
│  │  └─ Toggle: Allow anonymized data for research
│  └─ Download my data:
│     └─ Button: "Download All Data" (GDPR)
├─ User toggles settings
├─ Auto-save on change
├─ API Call: PUT /api/users/me
└─ Backend updates settings

Step 10: Notifications Tab
├─ Display options:
│  ├─ Email Notifications:
│  │  ├─ Appointment reminders
│  │  ├─ Journal reminders
│  │  ├─ Mood tracking reminders
│  │  └─ Newsletter
│  ├─ Push Notifications: [future]
│  │  ├─ Chat messages
│  │  ├─ Appointments
│  │  └─ Daily check-in
│  └─ Notification frequency:
│     └─ Dropdown: Daily / Weekly / Never
├─ User toggles preferences
├─ Auto-save
└─ Backend updates user.settings.notifications

Step 11: Appearance Tab
├─ Display options:
│  ├─ Theme:
│  │  └─ Radio: Light / Dark / Auto
│  ├─ Font size:
│  │  └─ Radio: Small / Medium / Large
│  └─ Reduced motion:
│     └─ Toggle: Accessibility option
├─ User selects preference
├─ Apply immediately to UI
├─ Save to localStorage
└─ Optional: Sync to backend
```

---

## 🔵 FLOW 12: Logout

### Start: User Wants to Logout

```
Step 1: Initiate Logout
├─ User clicks "Logout" button (in header or settings)
├─ Confirmation dialog: "Are you sure you want to logout?"
├─ User confirms
└─ Proceed to logout

Step 2: Logout Process
├─ Frontend:
│  ├─ Call authAPI.logout()
│  ├─ Remove token from localStorage
│  ├─ Remove user data from localStorage
│  ├─ Clear AuthContext:
│  │  ├─ setUser(null)
│  │  └─ setToken(null)
│  └─ Clear any other cached data
├─ Show toast: "Logged out successfully"
└─ Navigate to: / (landing page)

Step 3: After Logout
├─ User on landing page
├─ All authentication-required pages inaccessible
├─ Attempting to access /dashboard → Redirect to /login
└─ User must login again to access dashboard
```

---

## 🔵 FLOW 13: Therapist Portal

### Start: Therapist Wants to Access Portal

```
Step 1: Navigate to Therapist Portal
├─ From Landing Page: Click "Therapist Login"
├─ URL: /therapist-portal
├─ Component: TherapistPortalPage.tsx renders
└─ Public access (no auth required for this page)

Step 2: Therapist Portal Display
├─ Display options:
│  ├─ "Therapist Login" button
│  ├─ "Register as Therapist" button
│  ├─ Information about platform
│  └─ Benefits of joining
└─ User selects action

Step 3: Therapist Login
├─ User clicks "Therapist Login"
├─ TherapistLogin component renders
├─ Form:
│  ├─ Email
│  └─ Password
├─ User enters credentials
├─ API Call: POST /api/therapist-auth/login
├─ Backend:
│  ├─ Find therapist: TherapistAuth.findOne({ email })
│  ├─ Verify password with bcrypt
│  ├─ Generate JWT token
│  └─ Return token + therapist data
├─ Frontend:
│  ├─ Store token
│  ├─ Store therapist data
│  └─ Navigate to therapist dashboard
└─ Therapist logged in

Step 4: Therapist Dashboard (Not Fully Working)
├─ URL: /therapist-portal/dashboard
├─ Display:
│  ├─ Upcoming sessions
│  ├─ Today's schedule
│  ├─ Earnings summary
│  ├─ Recent bookings
│  └─ Join session buttons [currently buggy]
├─ Known issues:
│  ├─ Sessions don't display correctly
│  ├─ Join functionality broken
│  └─ Dashboard data sync issues
└─ Needs fixes for full functionality
```

---

## 🔵 FLOW 14: Session Auto-End Service (Backend Background Process)

```
Step 1: Service Initialization
├─ When backend starts: server.js
├─ Call: startSessionAutoEndService()
├─ Service: sessionAutoEndService.js
└─ Cron job initialized

Step 2: Scheduled Execution
├─ Runs every 2 minutes: cron.schedule('*/2 * * * *')
├─ Checks all active sessions
└─ Automatically ends expired sessions

Step 3: Process Active Sessions
├─ Query: Find all appointments with status "scheduled"
├─ For each appointment:
│  ├─ Check if session end time passed
│  ├─ If expired:
│  │  ├─ Update status to "completed"
│  │  ├─ Clear therapist busy status
│  │  └─ Log completion
│  └─ If not expired: Skip
└─ Continue monitoring

Step 4: Cleanup
├─ Ensures no sessions stuck in "scheduled" status
├─ Therapists become available after sessions
└─ Maintains system integrity
```

---

## 📊 Complete Feature Matrix

| Feature | Entry Point | Component | Working Status |
|---------|-------------|-----------|----------------|
| User Registration | /signup | UserSignup.tsx | ✅ Fully Working |
| User Login | /login | UserLogin.tsx | ✅ Fully Working |
| Password Reset | Login page | AuthModal.tsx | ✅ Fully Working |
| Dashboard | /dashboard | Dashboard.tsx | ✅ Fully Working |
| Mood Tracking | /dashboard/mood | MoodTracker.tsx | ✅ Fully Working |
| Journal | /dashboard/journal | Journal.tsx | ✅ Fully Working |
| AI Chat | /dashboard/chat | AIChat.tsx | ✅ Fully Working |
| Find Therapist | /dashboard/therapists | TherapistDashboardNew.tsx | ✅ Fully Working |
| Therapist Booking (up to payment) | Booking modal | BookingModalNew.tsx | ✅ Fully Working |
| Fake Payment | Payment modal | FakePaymentModal.tsx | ✅ Fully Working |
| Email Notifications | Backend service | emailService.js | ✅ Fully Working |
| View Appointments | /dashboard/appointments | AppointmentsNew.tsx | ✅ Fully Working |
| Cancel Appointment | Appointments page | AppointmentsNew.tsx | ✅ Fully Working |
| Refund Processing | Backend | refund.js | ✅ Fully Working |
| Resources | /dashboard/resources | Resources.tsx | ✅ Fully Working |
| Settings | /dashboard/settings | Settings.tsx | ✅ Fully Working |
| Logout | Any page | Header | ✅ Fully Working |
| **Join Session** | Appointments page | SessionManager.tsx | ❌ Not Working |
| **Video Conference** | Session join | JitsiVideoCall.tsx | ❌ Not Working |
| **Post-Session Rating** | After session | SessionReviewModal.tsx | ❌ Not Working |
| **Therapist Dashboard** | /therapist-portal | TherapistDashboardNew.tsx | ⚠️ Partially Working |
| Therapist Login | /therapist-portal | TherapistLogin.tsx | ✅ Fully Working |

---

**END OF FLOW DOCUMENTATION**

This flow documentation is designed to be comprehensive enough for a tool like Perplexity to generate accurate visual flow charts. Each flow includes all decision points, API calls, component interactions, and user actions.
