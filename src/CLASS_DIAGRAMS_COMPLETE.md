# ZEN-MIND Complete Class Diagrams & Specifications
## For UML Diagram Generation

---

## TABLE OF CONTENTS
1. [User Authentication Module](#1-user-authentication-module)
2. [Therapist Management Module](#2-therapist-management-module)
3. [Appointment Booking Module](#3-appointment-booking-module)
4. [Mood Tracking Module](#4-mood-tracking-module)
5. [Journal Management Module](#5-journal-management-module)
6. [AI Chat Module](#6-ai-chat-module)
7. [Payment Processing Module](#7-payment-processing-module)
8. [Video Conference Module](#8-video-conference-module)
9. [Email Notification Module](#9-email-notification-module)
10. [Database Service Module](#10-database-service-module)
11. [PlantUML Diagram Code](#11-plantuml-diagram-code)
12. [Mermaid Diagram Code](#12-mermaid-diagram-code)

---

## 1. USER AUTHENTICATION MODULE

### 1.1 User Class

**Attributes:**
- `_id`: ObjectId - Unique identifier for the user
- `name`: String - Full name of the user (max 50 characters)
- `email`: String - Email address (unique, validated, lowercase)
- `password`: String - Hashed password (min 8 chars, bcrypt encrypted, hidden)
- `age`: Number - User age (13-19 for teens)
- `avatar`: String - Profile picture URL
- `role`: String - User role (user/therapist/admin)
- `profile.bio`: String - User biography
- `profile.pronouns`: String - Preferred pronouns
- `profile.phone`: String - Phone number (validated format)
- `profile.gender`: String - Gender identity (male/female/non-binary/prefer-not-to-say/other)
- `profile.dateOfBirth`: Date - Date of birth
- `profile.interests`: Array<String> - List of interests
- `profile.supportNeeds`: Array<String> - Mental health support needs
- `settings.notifications.email`: Boolean - Email notification preference
- `settings.notifications.push`: Boolean - Push notification preference
- `settings.notifications.reminders`: Boolean - Reminder notification preference
- `settings.privacy.profileVisibility`: String - Profile visibility (public/private)
- `settings.privacy.shareProgress`: Boolean - Share progress with others
- `settings.theme`: String - UI theme (light/dark/auto)
- `subscription.plan`: String - Subscription plan (free/premium/unlimited)
- `subscription.startDate`: Date - Subscription start date
- `subscription.endDate`: Date - Subscription end date
- `subscription.isActive`: Boolean - Active subscription status
- `streakCount`: Number - Daily check-in streak counter
- `lastCheckIn`: Date - Last check-in timestamp
- `createdAt`: Date - Account creation timestamp
- `updatedAt`: Date - Last update timestamp

**Methods:**
- `comparePassword(candidatePassword: String)`: Boolean - Compares plain text password with hashed password
- `updateStreak()`: Promise<User> - Updates daily check-in streak counter
- `hashPassword()`: void - Hashes password before saving (pre-save hook)
- `validateEmail(email: String)`: Boolean - Validates email format using regex
- `validatePassword(password: String)`: Boolean - Validates password strength (8+ chars, uppercase, lowercase, number, special char)
- `getPublicProfile()`: Object - Returns sanitized profile without sensitive data
- `updateSettings(settings: Object)`: Promise<User> - Updates user settings
- `updateProfile(profile: Object)`: Promise<User> - Updates user profile information
- `activateSubscription(plan: String, duration: Number)`: Promise<User> - Activates subscription plan
- `deactivateSubscription()`: Promise<User> - Deactivates subscription

**Functionality:**
Manages user authentication, profile data, preferences, subscription plans, and engagement tracking through streak counts. Implements secure password hashing using bcrypt with automatic pre-save hooks and password comparison. Handles user registration with email validation, password strength validation, and age verification (13-19 years). Provides methods for profile management, notification settings, privacy controls, and theme preferences. Tracks user engagement through daily check-in streaks and last check-in timestamps.

---

### 1.2 AuthenticationService Class

**Attributes:**
- `JWT_SECRET`: String - Secret key for JWT token signing (environment variable)
- `JWT_EXPIRE`: String - Token expiration time (default: 7 days)
- `SALT_ROUNDS`: Number - Bcrypt salt rounds (default: 10)
- `OTP_EXPIRY`: Number - OTP expiration time in minutes (default: 5)
- `MAX_LOGIN_ATTEMPTS`: Number - Maximum failed login attempts (default: 5)
- `LOCKOUT_DURATION`: Number - Account lockout duration in minutes (default: 30)

**Methods:**
- `generateToken(userId: ObjectId, role: String)`: String - Generates JWT token with user ID and role
- `verifyToken(token: String)`: Object - Verifies JWT token and returns decoded payload
- `refreshToken(token: String)`: String - Refreshes expired token
- `hashPassword(password: String)`: Promise<String> - Hashes password using bcrypt
- `comparePassword(plainPassword: String, hashedPassword: String)`: Promise<Boolean> - Compares plain and hashed passwords
- `authenticateUser(email: String, password: String)`: Promise<User> - Authenticates user and returns user object
- `authenticateTherapist(email: String, password: String)`: Promise<Therapist> - Authenticates therapist
- `sendOTP(email: String)`: Promise<String> - Generates and sends OTP to email
- `verifyOTP(email: String, otp: String)`: Promise<Boolean> - Verifies OTP code
- `resetPassword(email: String, newPassword: String, otp: String)`: Promise<Boolean> - Resets password using OTP
- `registerUser(userData: Object)`: Promise<User> - Registers new user with validation
- `registerTherapist(therapistData: Object)`: Promise<Therapist> - Registers new therapist
- `logout(token: String)`: Promise<Boolean> - Invalidates token and logs out user
- `validateToken(token: String)`: Boolean - Validates token format and signature
- `checkAccountLockout(email: String)`: Promise<Boolean> - Checks if account is locked
- `incrementFailedAttempts(email: String)`: Promise<void> - Increments failed login attempts
- `resetFailedAttempts(email: String)`: Promise<void> - Resets failed login counter

**Functionality:**
Provides secure authentication using JWT tokens with bcrypt password hashing. Implements separate authentication flows for teens and therapists. Supports OTP-based email verification for account security and password resets with 5-minute expiration. Manages session tokens with automatic expiration (7 days) and refresh mechanisms. Validates user roles and permissions for access control across the platform. Implements account lockout after 5 failed login attempts for 30 minutes. Handles user registration with comprehensive validation including email format, password strength, and age verification. Provides token refresh functionality for seamless user experience.

---

### 1.3 OTP Class

**Attributes:**
- `_id`: ObjectId - Unique identifier for OTP record
- `email`: String - Email address associated with OTP
- `otp`: String - Generated OTP code (6 digits)
- `purpose`: String - Purpose of OTP (password-reset/email-verification/account-activation)
- `expiresAt`: Date - OTP expiration timestamp
- `isUsed`: Boolean - Whether OTP has been used
- `attempts`: Number - Number of verification attempts
- `maxAttempts`: Number - Maximum allowed attempts (default: 3)
- `createdAt`: Date - OTP creation timestamp

**Methods:**
- `generateOTP()`: String - Generates random 6-digit OTP code
- `verify(code: String)`: Boolean - Verifies OTP code and checks expiration
- `markAsUsed()`: Promise<OTP> - Marks OTP as used
- `isExpired()`: Boolean - Checks if OTP has expired
- `incrementAttempts()`: Promise<OTP> - Increments verification attempts
- `canAttempt()`: Boolean - Checks if more attempts are allowed
- `static cleanupExpired()`: Promise<void> - Removes expired OTP records

**Functionality:**
Manages one-time password codes for email verification and password resets. Generates secure 6-digit OTP codes with 5-minute expiration. Tracks verification attempts with maximum 3 attempts allowed. Marks OTPs as used after successful verification to prevent reuse. Provides automatic cleanup of expired OTP records. Implements rate limiting through attempt tracking to prevent brute force attacks.

---

## 2. THERAPIST MANAGEMENT MODULE

### 2.1 Therapist Class

**Attributes:**
- `_id`: ObjectId - Unique identifier for therapist
- `name`: String - Full name of therapist
- `email`: String - Email address (unique, validated, lowercase)
- `password`: String - Hashed password (min 8 chars, bcrypt encrypted, hidden)
- `profilePicture`: String - Profile picture URL
- `about`: String - Therapist biography (max 1000 characters)
- `specializations`: Array<String> - List of specializations (anxiety, depression, stress, trauma, etc.)
- `education`: String - Educational qualifications
- `experience`: Number - Years of experience (min 0)
- `languages`: Array<String> - Languages spoken
- `pricePerSession`: Number - Price per 30-minute session in INR (₹500-₹1000)
- `sessionDuration`: Number - Default session duration (30 or 60 minutes)
- `currentSession.isActive`: Boolean - Whether therapist is currently in session
- `currentSession.appointmentId`: ObjectId - Reference to active appointment
- `currentSession.startedAt`: Date - Session start timestamp
- `currentSession.endsAt`: Date - Session end timestamp
- `availableSlots`: Array<Object> - Array of available time slots with date and times
- `availableSlots[].date`: String - Date in YYYY-MM-DD format
- `availableSlots[].slots`: Array<Object> - Time slots for that date
- `availableSlots[].slots[].startTime`: String - Start time in HH:MM format
- `availableSlots[].slots[].endTime`: String - End time in HH:MM format
- `availableSlots[].slots[].isBooked`: Boolean - Booking status
- `availableSlots[].slots[].bookedBy`: ObjectId - User who booked the slot
- `availableSlots[].slots[].appointmentId`: ObjectId - Reference to appointment
- `rating`: Number - Average rating (0-5 scale)
- `reviewCount`: Number - Total number of reviews
- `reviews`: Array<Object> - Array of review objects
- `reviews[].appointmentId`: ObjectId - Reference to appointment
- `reviews[].userId`: ObjectId - User who left review
- `reviews[].userName`: String - Display name (Anonymous Teen)
- `reviews[].rating`: Number - Rating (1-5)
- `reviews[].comment`: String - Review comment
- `reviews[].createdAt`: Date - Review timestamp
- `role`: String - Role (therapist, immutable)
- `createdAt`: Date - Account creation timestamp
- `updatedAt`: Date - Last update timestamp

**Methods:**
- `comparePassword(candidatePassword: String)`: Promise<Boolean> - Compares password with hash
- `initializeDefaultSlots()`: Promise<void> - Creates default 3 slots for today
- `getAvailableSlots(date: String)`: Array<Object> - Returns available slots for specific date
- `bookSlot(date: String, startTime: String, userId: ObjectId, appointmentId: ObjectId)`: Promise<Object> - Books a time slot
- `cancelSlot(date: String, startTime: String)`: Promise<void> - Cancels a booked slot
- `hashPassword()`: void - Hashes password before saving (pre-save hook)
- `addReview(appointmentId: ObjectId, userId: ObjectId, rating: Number, comment: String)`: Promise<Therapist> - Adds new review
- `updateRating()`: Promise<Therapist> - Recalculates average rating
- `addSlot(date: String, startTime: String, endTime: String)`: Promise<Therapist> - Adds new time slot
- `removeSlot(date: String, startTime: String)`: Promise<Therapist> - Removes time slot
- `updatePricing(pricePerSession: Number)`: Promise<Therapist> - Updates session pricing
- `updateProfile(profileData: Object)`: Promise<Therapist> - Updates therapist profile
- `getUpcomingAppointments()`: Promise<Array> - Returns upcoming appointments
- `startSession(appointmentId: ObjectId)`: Promise<Therapist> - Marks session as active
- `endSession()`: Promise<Therapist> - Marks session as inactive
- `isAvailableAt(date: String, time: String)`: Boolean - Checks availability at specific time

**Functionality:**
Manages therapist profiles with credentials, specializations, configurable pricing (₹500-₹1000 based on experience), and dynamic availability slots. Handles real-time session tracking with currentSession object that tracks active appointments, start time, and end time. Implements slot management with methods to initialize default 3 daily slots, add custom slots, book slots, and cancel bookings. Maintains complete anonymity from teen personal data by storing only anonymous references. Supports review aggregation with automatic rating calculation and review count updates. Provides pricing flexibility with updatePricing method based on experience level. Tracks current session status to prevent double-booking and ensure real-time availability. Implements secure password hashing identical to User class.

---

### 2.2 TherapistService Class

**Attributes:**
- `MIN_PRICE`: Number - Minimum session price (₹500)
- `MAX_PRICE`: Number - Maximum session price (₹1000)
- `DEFAULT_SLOTS_PER_DAY`: Number - Default number of slots (3)
- `SLOT_DURATION`: Number - Default slot duration (60 minutes)
- `BREAK_DURATION`: Number - Break between slots (30 minutes)
- `EXPERIENCE_PRICE_MAP`: Object - Mapping of experience years to price ranges

**Methods:**
- `getAllTherapists()`: Promise<Array<Therapist>> - Retrieves all active therapists
- `getTherapistById(therapistId: ObjectId)`: Promise<Therapist> - Retrieves therapist by ID
- `getTherapistsBySpecialization(specialization: String)`: Promise<Array<Therapist>> - Filters therapists by specialization
- `getAvailableTherapists(date: String, time: String)`: Promise<Array<Therapist>> - Returns therapists available at specific time
- `calculateRecommendedPrice(experience: Number)`: Number - Calculates recommended price based on experience
- `getTherapistSchedule(therapistId: ObjectId, startDate: String, endDate: String)`: Promise<Array> - Returns schedule for date range
- `generateDefaultSlots(date: String)`: Array<Object> - Generates default 3 slots for a date
- `validateSlotTiming(startTime: String, endTime: String)`: Boolean - Validates slot timing format and logic
- `checkSlotConflict(therapistId: ObjectId, date: String, startTime: String)`: Promise<Boolean> - Checks for scheduling conflicts
- `updateTherapistAvailability(therapistId: ObjectId, slots: Array)`: Promise<Therapist> - Updates availability slots
- `getTherapistStats(therapistId: ObjectId)`: Promise<Object> - Returns statistics (appointments, ratings, revenue)
- `searchTherapists(query: String, filters: Object)`: Promise<Array<Therapist>> - Searches therapists with filters
- `validateTherapistCredentials(email: String, password: String)`: Promise<Boolean> - Validates login credentials

**Functionality:**
Provides centralized therapist management services including therapist retrieval, filtering by specialization, and availability checking. Implements pricing logic with experience-based recommendations (0-2 years: ₹500-₹600, 3-5 years: ₹700-₹800, 6+ years: ₹900-₹1000). Handles slot generation with default 3 slots per day (10:00-11:00, 12:00-13:00, 14:00-15:00) and 30-minute breaks. Validates slot timings to prevent overlaps and conflicts. Provides comprehensive search functionality with filters for specialization, price range, rating, and availability. Generates therapist statistics including total appointments, average rating, revenue earned, and session completion rate. Manages therapist availability updates and schedule retrieval for calendar views.

---

## 3. APPOINTMENT BOOKING MODULE

### 3.1 Appointment Class

**Attributes:**
- `_id`: ObjectId - Unique identifier for appointment
- `userId`: ObjectId - Reference to User (teen)
- `therapistId`: ObjectId - Reference to Therapist
- `therapistName`: String - Cached therapist name for quick access
- `therapistAvatar`: String - Cached therapist avatar URL
- `date`: Date - Appointment date
- `startTime`: String - Start time in HH:MM format (24-hour)
- `endTime`: String - End time in HH:MM format
- `duration`: Number - Session duration in minutes (30 or 60)
- `type`: String - Session type (video/audio/chat/in-person)
- `status`: String - Appointment status (scheduled/confirmed/completed/cancelled/no-show)
- `notes`: String - Teen's notes/concerns (max 500 characters)
- `reason`: String - Reason for booking (max 300 characters)
- `meetingLink`: String - Jitsi video conference link
- `reminderSent`: Boolean - Whether reminder email was sent
- `payment.amount`: Number - Total payment amount in INR
- `payment.currency`: String - Currency code (default: INR)
- `payment.status`: String - Payment status (pending/completed/refunded/failed)
- `payment.transactionId`: String - Unique transaction identifier
- `payment.paidAt`: Date - Payment timestamp
- `payment.method`: String - Payment method (fake-payment for demo)
- `cancellation.cancelledBy`: String - Who cancelled (user/therapist/system)
- `cancellation.reason`: String - Cancellation reason
- `cancellation.cancelledAt`: Date - Cancellation timestamp
- `review.rating`: Number - Session rating (1-5)
- `review.comment`: String - Review comment
- `review.createdAt`: Date - Review timestamp
- `sessionNotes`: String - Therapist's confidential session notes (max 2000 characters)
- `createdAt`: Date - Appointment creation timestamp
- `updatedAt`: Date - Last update timestamp

**Methods:**
- `checkConflicts()`: Promise<Boolean> - Checks for scheduling conflicts (pre-save hook)
- `static getUpcoming(userId: ObjectId, userType: String)`: Promise<Array<Appointment>> - Returns upcoming appointments
- `static getStats(userId: ObjectId, userType: String)`: Promise<Object> - Returns appointment statistics
- `generateMeetingLink()`: String - Generates Jitsi meeting link
- `sendReminder()`: Promise<void> - Sends reminder email 24 hours before
- `canJoinSession()`: Boolean - Checks if session can be joined (5 min before to end time)
- `markAsCompleted()`: Promise<Appointment> - Marks appointment as completed
- `cancel(cancelledBy: String, reason: String)`: Promise<Appointment> - Cancels appointment
- `processPayment(transactionId: String)`: Promise<Appointment> - Processes payment
- `processRefund(reason: String)`: Promise<Appointment> - Processes refund with 10% platform charge
- `addReview(rating: Number, comment: String)`: Promise<Appointment> - Adds review after session
- `addSessionNotes(notes: String)`: Promise<Appointment> - Therapist adds session notes
- `isWithinTimeWindow()`: Boolean - Checks if current time is within session window
- `getSessionDuration()`: Number - Returns actual session duration in minutes
- `static getPastAppointments(userId: ObjectId)`: Promise<Array<Appointment>> - Returns completed appointments

**Functionality:**
Manages therapy session bookings with comprehensive conflict detection to prevent double-booking. Implements payment processing with fake payments for demo purposes, storing transaction IDs, amounts, and payment status. Generates Jitsi video meeting links with unique room IDs based on appointment ID. Handles email notifications for booking confirmations, reminders (24 hours before), and cancellations. Supports flexible session durations (30 or 60 minutes) with corresponding pricing. Implements time-restricted session access allowing users to join 5 minutes before session start and until session end time. Manages post-session reviews with rating (1-5) and comment, updating therapist's average rating. Processes refunds with 10% platform charges deducted from refund amount. Maintains therapist's confidential session notes (max 2000 chars) accessible only to therapist. Provides statistics methods for total appointments, completed, upcoming, and cancelled counts.

---

### 3.2 BookingService Class

**Attributes:**
- `PLATFORM_CHARGE_PERCENTAGE`: Number - Platform fee percentage (10%)
- `MIN_BOOKING_ADVANCE`: Number - Minimum hours to book in advance (2 hours)
- `MAX_BOOKING_ADVANCE`: Number - Maximum days to book in advance (30 days)
- `SESSION_ACCESS_BUFFER`: Number - Minutes before session to allow access (5 minutes)
- `REMINDER_HOURS`: Number - Hours before session to send reminder (24 hours)

**Methods:**
- `createBooking(userId: ObjectId, therapistId: ObjectId, date: Date, startTime: String, duration: Number, reason: String)`: Promise<Appointment> - Creates new booking
- `validateBooking(therapistId: ObjectId, date: Date, startTime: String, duration: Number)`: Promise<Boolean> - Validates booking request
- `checkTherapistAvailability(therapistId: ObjectId, date: String, startTime: String)`: Promise<Boolean> - Checks therapist availability
- `calculateTotalPrice(therapistId: ObjectId, duration: Number)`: Promise<Number> - Calculates total price
- `processBookingPayment(appointmentId: ObjectId, paymentData: Object)`: Promise<Appointment> - Processes payment
- `cancelBooking(appointmentId: ObjectId, cancelledBy: String, reason: String)`: Promise<Appointment> - Cancels booking
- `rescheduleBooking(appointmentId: ObjectId, newDate: Date, newStartTime: String)`: Promise<Appointment> - Reschedules appointment
- `getBookingById(appointmentId: ObjectId)`: Promise<Appointment> - Retrieves booking by ID
- `getUserBookings(userId: ObjectId, status: String)`: Promise<Array<Appointment>> - Gets user's bookings
- `getTherapistBookings(therapistId: ObjectId, date: String)`: Promise<Array<Appointment>> - Gets therapist's bookings for date
- `sendBookingConfirmation(appointmentId: ObjectId)`: Promise<void> - Sends confirmation email
- `sendBookingReminder(appointmentId: ObjectId)`: Promise<void> - Sends reminder email
- `processRefund(appointmentId: ObjectId, reason: String)`: Promise<Object> - Processes refund
- `canCancelBooking(appointmentId: ObjectId)`: Promise<Boolean> - Checks if booking can be cancelled
- `canRescheduleBooking(appointmentId: ObjectId)`: Promise<Boolean> - Checks if booking can be rescheduled
- `markSessionAsCompleted(appointmentId: ObjectId)`: Promise<Appointment> - Marks session as completed
- `autoCompleteExpiredSessions()`: Promise<void> - Auto-completes sessions after end time

**Functionality:**
Provides comprehensive booking management including creation, validation, cancellation, and rescheduling. Implements business rules like minimum 2-hour advance booking and maximum 30-day booking window. Validates therapist availability by checking slot booking status and current session status. Calculates total price based on therapist's rate and session duration (30 min = base price, 60 min = 2x base price). Processes fake payments with transaction ID generation and payment status tracking. Handles cancellations with automatic slot release and refund processing (10% platform charge). Implements rescheduling with availability checks and notification updates. Sends automated emails for booking confirmations, reminders 24 hours before, and cancellation notices. Enforces session access window (5 minutes before to end time) for security. Auto-completes sessions after scheduled end time for accurate status tracking.

---

## 4. MOOD TRACKING MODULE

### 4.1 Mood Class

**Attributes:**
- `_id`: ObjectId - Unique identifier for mood entry
- `userId`: ObjectId - Reference to User
- `mood`: String - Mood type (amazing/good/okay/sad/anxious/stressed/angry)
- `intensity`: Number - Mood intensity on 1-10 scale
- `emotions`: Array<String> - Associated emotions (happy, excited, worried, lonely, etc.)
- `activities`: Array<String> - Activities performed (exercise, study, socializing, gaming, etc.)
- `triggers`: Array<String> - Mood triggers (school, family, friends, health, etc.)
- `notes`: String - Additional notes (max 500 characters)
- `energy`: Number - Energy level on 1-10 scale
- `sleep.hours`: Number - Hours of sleep
- `sleep.quality`: String - Sleep quality (poor/fair/good/excellent)
- `social`: String - Social interaction level (none/minimal/moderate/active)
- `suggestion.activity`: String - AI-suggested activity
- `suggestion.book`: String - AI-suggested book
- `suggestion.song`: String - AI-suggested song
- `suggestion.exercise`: String - AI-suggested exercise
- `suggestion.emotion`: String - Predicted emotion trend
- `suggestion.intensity`: Number - Predicted intensity
- `date`: Date - Mood entry date
- `createdAt`: Date - Creation timestamp
- `updatedAt`: Date - Last update timestamp

**Methods:**
- `static getUserStats(userId: ObjectId, days: Number)`: Promise<Object> - Returns mood statistics for specified days
- `static getMoodTrends(userId: ObjectId, days: Number)`: Promise<Array> - Returns mood trends over time
- `generateSuggestions()`: Promise<Object> - Generates AI-powered suggestions based on mood
- `analyzeMoodPattern(userId: ObjectId)`: Promise<Object> - Analyzes mood patterns and correlations
- `getTriggerAnalysis(userId: ObjectId)`: Promise<Object> - Analyzes common triggers
- `getSleepCorrelation(userId: ObjectId)`: Promise<Object> - Analyzes sleep impact on mood
- `getEnergyCorrelation(userId: ObjectId)`: Promise<Object> - Analyzes energy level correlations
- `getSocialCorrelation(userId: ObjectId)`: Promise<Object> - Analyzes social interaction impact
- `getEmotionDistribution(userId: ObjectId)`: Promise<Object> - Returns emotion frequency distribution
- `getActivityImpact(userId: ObjectId)`: Promise<Object> - Analyzes activity impact on mood
- `exportMoodData(userId: ObjectId, format: String)`: Promise<String> - Exports mood data (CSV/JSON)

**Functionality:**
Tracks daily mood entries with detailed emotional states, intensity ratings (1-10 scale), associated activities, and triggers. Implements comprehensive mood analytics including mood distribution (percentage of amazing, good, okay, sad, anxious, stressed, angry moods), average intensity calculation, and trend analysis. Provides AI-generated personalized suggestions based on current mood including recommended activities (meditation, journaling, exercise), books, songs, and exercises. Correlates mood with sleep quality and hours, energy levels, and social interaction patterns to identify factors affecting mental health. Analyzes trigger patterns to help users identify common mood triggers (school stress, family issues, social anxiety). Generates emotion distribution showing most frequent emotions. Tracks activity impact by correlating activities with mood improvements or deteriorations. Supports data export for external analysis or sharing with therapists.

---

### 4.2 MoodAnalyticsService Class

**Attributes:**
- `MOOD_SCORE_MAP`: Object - Mapping of moods to numerical scores (amazing: 5, good: 4, okay: 3, sad: 2, anxious: 2, stressed: 2, angry: 1)
- `SUGGESTION_DATABASE`: Object - Database of activities, books, songs, exercises
- `ANALYSIS_PERIOD`: Number - Default analysis period in days (30)
- `MIN_ENTRIES_FOR_ANALYSIS`: Number - Minimum entries needed for reliable analysis (7)

**Methods:**
- `getMoodScore(mood: String)`: Number - Converts mood to numerical score
- `calculateAverageMood(userId: ObjectId, days: Number)`: Promise<Number> - Calculates average mood score
- `getMoodDistribution(userId: ObjectId, days: Number)`: Promise<Object> - Returns mood frequency distribution
- `identifyMoodPatterns(userId: ObjectId)`: Promise<Object> - Identifies weekly/monthly patterns
- `predictMoodTrend(userId: ObjectId)`: Promise<String> - Predicts mood trend (improving/stable/declining)
- `generatePersonalizedSuggestions(mood: String, intensity: Number, emotions: Array, triggers: Array)`: Promise<Object> - Generates AI suggestions
- `correlateSleepWithMood(userId: ObjectId)`: Promise<Object> - Analyzes sleep-mood correlation
- `correlateEnergyWithMood(userId: ObjectId)`: Promise<Object> - Analyzes energy-mood correlation
- `correlateSocialWithMood(userId: ObjectId)`: Promise<Object> - Analyzes social-mood correlation
- `identifyTopTriggers(userId: ObjectId, limit: Number)`: Promise<Array> - Returns most common triggers
- `identifyTopEmotions(userId: ObjectId, limit: Number)`: Promise<Array> - Returns most frequent emotions
- `identifyBeneficialActivities(userId: ObjectId)`: Promise<Array> - Returns activities that improve mood
- `generateWeeklyReport(userId: ObjectId)`: Promise<Object> - Generates weekly mood report
- `generateMonthlyReport(userId: ObjectId)`: Promise<Object> - Generates monthly mood report
- `compareWithPreviousPeriod(userId: ObjectId, days: Number)`: Promise<Object> - Compares mood with previous period
- `detectAnomalies(userId: ObjectId)`: Promise<Array> - Detects unusual mood patterns
- `generateRecommendations(userId: ObjectId)`: Promise<Array> - Generates mental health recommendations

**Functionality:**
Provides advanced mood analytics and AI-powered insights. Converts moods to numerical scores for statistical analysis (amazing=5, sad=2, angry=1). Calculates comprehensive statistics including average mood score, mood distribution percentages, and intensity averages. Identifies patterns such as "worse moods on Mondays" or "better moods after exercise". Predicts mood trends using linear regression on recent mood scores. Generates personalized suggestions by matching current mood/emotions/triggers with suggestion database of 100+ activities, books, songs, and exercises. Performs correlation analysis between sleep quality/hours and mood scores to show impact. Analyzes energy level patterns and their relationship with mood. Identifies beneficial activities that consistently correlate with mood improvements. Generates weekly/monthly reports with visualizations and insights. Detects anomalies like sudden mood drops or unusual trigger frequency. Provides actionable recommendations based on data analysis.

---

## 5. JOURNAL MANAGEMENT MODULE

### 5.1 Journal Class

**Attributes:**
- `_id`: ObjectId - Unique identifier for journal entry
- `userId`: ObjectId - Reference to User
- `title`: String - Journal entry title (required)
- `content`: String - Journal entry content (required, supports markdown)
- `mood`: String - Associated mood (optional)
- `tags`: Array<String> - Tags for categorization
- `isPrivate`: Boolean - Privacy setting (default: true)
- `isFavorite`: Boolean - Favorite/bookmarked status
- `gratitude`: Array<String> - Gratitude list items
- `goals`: Array<Object> - Goal tracking objects
- `goals[].text`: String - Goal description
- `goals[].completed`: Boolean - Completion status
- `aiInsights.sentiment`: String - AI-analyzed sentiment (positive/neutral/negative)
- `aiInsights.themes`: Array<String> - Identified themes (growth, anxiety, relationships, etc.)
- `aiInsights.suggestions`: Array<String> - AI-generated suggestions
- `attachments`: Array<Object> - Media attachments
- `attachments[].type`: String - Attachment type (image/audio/file)
- `attachments[].url`: String - File URL
- `attachments[].name`: String - File name
- `createdAt`: Date - Creation timestamp
- `updatedAt`: Date - Last update timestamp

**Methods:**
- `static getUserStats(userId: ObjectId)`: Promise<Object> - Returns journal statistics
- `analyzeContent()`: Promise<Object> - Analyzes content with AI
- `extractThemes()`: Promise<Array<String>> - Extracts recurring themes
- `detectSentiment()`: Promise<String> - Detects sentiment (positive/neutral/negative)
- `generateInsights()`: Promise<Object> - Generates AI insights
- `addTag(tag: String)`: Promise<Journal> - Adds tag to entry
- `removeTag(tag: String)`: Promise<Journal> - Removes tag
- `toggleFavorite()`: Promise<Journal> - Toggles favorite status
- `addGoal(goalText: String)`: Promise<Journal> - Adds new goal
- `completeGoal(goalIndex: Number)`: Promise<Journal> - Marks goal as completed
- `addAttachment(type: String, url: String, name: String)`: Promise<Journal> - Adds attachment
- `removeAttachment(attachmentId: ObjectId)`: Promise<Journal> - Removes attachment
- `searchContent(query: String)`: Promise<Array<Journal>> - Searches journal content
- `getRelatedEntries(entryId: ObjectId)`: Promise<Array<Journal>> - Finds related entries by tags/themes

**Functionality:**
Manages private journaling with rich text support (markdown formatting for bold, italics, lists, links). Implements comprehensive tagging system for categorization and easy retrieval. Provides AI-powered sentiment analysis using natural language processing to detect positive, neutral, or negative emotions in writing. Extracts recurring themes from journal content to identify patterns in thoughts and experiences (e.g., growth mindset, anxiety, relationships, self-improvement). Generates AI insights and suggestions based on journal content to promote self-reflection. Supports multimedia attachments (images, audio recordings, files) for richer journaling experience. Implements gratitude lists to encourage positive thinking and mental wellness. Tracks goals with completion status for personal development. Calculates statistics including total entries, favorite count, most-used tags, mood distribution, and writing frequency. Provides content search functionality across all entries. Maintains strict privacy with default isPrivate: true setting.

---

### 5.2 JournalAnalyticsService Class

**Attributes:**
- `SENTIMENT_THRESHOLD_POSITIVE`: Number - Sentiment score threshold (0.3)
- `SENTIMENT_THRESHOLD_NEGATIVE`: Number - Sentiment score threshold (-0.3)
- `THEME_EXTRACTION_MIN_FREQUENCY`: Number - Minimum theme mentions (3)
- `WRITING_STREAK_ENABLED`: Boolean - Enable streak tracking (true)

**Methods:**
- `analyzeSentiment(content: String)`: Promise<Object> - Analyzes text sentiment with score
- `extractKeywords(content: String)`: Promise<Array<String>> - Extracts important keywords
- `identifyThemes(userId: ObjectId)`: Promise<Array<Object>> - Identifies recurring themes across entries
- `calculateWritingStreak(userId: ObjectId)`: Promise<Number> - Calculates consecutive writing days
- `getWritingFrequency(userId: ObjectId, period: String)`: Promise<Object> - Returns writing frequency stats
- `getMoodCorrelation(userId: ObjectId)`: Promise<Object> - Correlates journal moods with mood tracker
- `getTopTags(userId: ObjectId, limit: Number)`: Promise<Array<Object>> - Returns most-used tags
- `getGoalCompletionRate(userId: ObjectId)`: Promise<Number> - Calculates goal completion percentage
- `getGratitudeInsights(userId: ObjectId)`: Promise<Object> - Analyzes gratitude patterns
- `generateMonthlyReport(userId: ObjectId, year: Number, month: Number)`: Promise<Object> - Generates monthly summary
- `detectWritingPatterns(userId: ObjectId)`: Promise<Object> - Detects writing time patterns
- `compareWithPreviousMonth(userId: ObjectId)`: Promise<Object> - Compares current with previous month
- `getEmotionalJourney(userId: ObjectId, startDate: Date, endDate: Date)`: Promise<Array> - Maps emotional journey
- `suggestWritingPrompts(userId: ObjectId)`: Promise<Array<String>> - Suggests prompts based on history
- `exportJournalData(userId: ObjectId, format: String)`: Promise<String> - Exports journal data

**Functionality:**
Provides advanced analytics for journaling behavior and content. Implements sentiment analysis using natural language processing libraries (positive: >0.3, neutral: -0.3 to 0.3, negative: <-0.3). Extracts keywords and themes using TF-IDF algorithm to identify recurring topics in journal entries. Tracks writing streaks by calculating consecutive days with journal entries. Analyzes writing frequency patterns (daily, weekly, monthly) and identifies best writing times. Correlates journal moods with mood tracker data to validate emotional tracking accuracy. Ranks tags by frequency and calculates goal completion rates. Analyzes gratitude patterns to identify common gratitude themes and frequency. Generates comprehensive monthly reports with entry count, average sentiment, top themes, and goal progress. Detects writing patterns like "writes more on weekends" or "writes late at night". Maps emotional journey over time by plotting sentiment scores. Suggests personalized writing prompts based on past themes and interests. Supports data export in CSV/JSON formats for external analysis or therapist sharing.

---

## 6. AI CHAT MODULE

### 6.1 ChatMessage Class

**Attributes:**
- `_id`: ObjectId - Unique identifier for message
- `conversationId`: ObjectId - Reference to Conversation
- `senderId`: ObjectId - Reference to User (sender)
- `receiverId`: ObjectId - Reference to User (receiver, null for AI)
- `message`: String - Message content (max 2000 characters)
- `type`: String - Message type (text/image/file/audio/video/ai)
- `isAI`: Boolean - Marks AI companion responses (true for AI)
- `metadata.sentiment`: String - Detected sentiment (positive/neutral/negative/crisis)
- `metadata.category`: String - Message category (greeting/question/crisis/emotional-support/advice)
- `metadata.relatedResources`: Array<String> - Related resource links
- `attachments`: Array<Object> - Message attachments
- `attachments[].type`: String - Attachment type
- `attachments[].url`: String - File URL
- `attachments[].size`: Number - File size in bytes
- `isRead`: Boolean - Read status
- `readAt`: Date - Read timestamp
- `isEdited`: Boolean - Edit status
- `editedAt`: Date - Edit timestamp
- `createdAt`: Date - Creation timestamp
- `updatedAt`: Date - Last update timestamp

**Methods:**
- `markAsRead()`: Promise<ChatMessage> - Marks message as read
- `editMessage(newContent: String)`: Promise<ChatMessage> - Edits message content
- `deleteMessage()`: Promise<void> - Soft deletes message
- `addAttachment(type: String, url: String, size: Number)`: Promise<ChatMessage> - Adds attachment
- `detectCrisis()`: Boolean - Detects crisis keywords in message
- `analyzeSentiment()`: Promise<String> - Analyzes message sentiment
- `categorizeMessage()`: Promise<String> - Categorizes message type
- `suggestResources()`: Promise<Array<String>> - Suggests relevant resources
- `static getConversationHistory(conversationId: ObjectId, limit: Number)`: Promise<Array<ChatMessage>> - Returns conversation history
- `static getUnreadCount(userId: ObjectId)`: Promise<Number> - Returns unread message count

**Functionality:**
Handles AI chatbot conversations with comprehensive sentiment analysis and crisis detection. Stores message content with type classification (text, image, file, audio, video, AI response). Implements sentiment detection using keyword analysis and NLP to identify positive, neutral, negative, or crisis-level emotions. Categorizes messages into greeting, question, crisis, emotional support request, or advice seeking. Detects crisis keywords (suicide, self-harm, harm others, abuse) and triggers appropriate resources and alerts. Suggests related mental health resources based on message category (crisis hotlines, breathing exercises, therapist booking). Supports multimedia attachments with size tracking. Maintains read receipts and edit history. Provides conversation history retrieval with pagination support. Tracks unread message counts for notification badges.

---

### 6.2 Conversation Class

**Attributes:**
- `_id`: ObjectId - Unique identifier for conversation
- `userId`: ObjectId - Reference to User
- `title`: String - Conversation title (auto-generated from first message)
- `category`: String - Conversation category (general/crisis/therapy-prep/emotional-support)
- `isActive`: Boolean - Active status
- `lastMessageAt`: Date - Last message timestamp
- `messageCount`: Number - Total message count
- `unreadCount`: Number - Unread message count
- `tags`: Array<String> - Conversation tags
- `sentiment`: String - Overall conversation sentiment
- `crisisDetected`: Boolean - Whether crisis was detected
- `createdAt`: Date - Creation timestamp
- `updatedAt`: Date - Last update timestamp

**Methods:**
- `addMessage(messageId: ObjectId)`: Promise<Conversation> - Adds message to conversation
- `updateLastMessage(timestamp: Date)`: Promise<Conversation> - Updates last message timestamp
- `incrementMessageCount()`: Promise<Conversation> - Increments message counter
- `markAllAsRead()`: Promise<Conversation> - Marks all messages as read
- `archiveConversation()`: Promise<Conversation> - Archives conversation
- `deleteConversation()`: Promise<void> - Soft deletes conversation
- `analyzeSentiment()`: Promise<String> - Analyzes overall sentiment
- `detectCrisis()`: Promise<Boolean> - Checks for crisis messages
- `static getUserConversations(userId: ObjectId)`: Promise<Array<Conversation>> - Returns user's conversations

**Functionality:**
Manages AI chat conversations with metadata and organization. Auto-generates conversation titles from first user message for easy identification. Categorizes conversations into general chat, crisis support, therapy preparation, or emotional support. Tracks conversation activity status and last message timestamp for sorting. Maintains message and unread counts for UI badge displays. Implements sentiment analysis across entire conversation to identify overall emotional tone. Detects crisis situations by analyzing multiple messages for concerning patterns. Supports conversation archiving for decluttering while preserving history. Provides conversation retrieval with filtering and sorting options.

---

### 6.3 AIService Class

**Attributes:**
- `OPENAI_API_KEY`: String - OpenAI API key (environment variable)
- `MODEL`: String - AI model (gpt-4 or gpt-3.5-turbo)
- `MAX_TOKENS`: Number - Maximum response tokens (500)
- `TEMPERATURE`: Number - Response creativity (0.7)
- `SYSTEM_PROMPT`: String - AI personality and guidelines
- `CRISIS_KEYWORDS`: Array<String> - List of crisis detection keywords
- `RESOURCE_DATABASE`: Object - Mental health resources database

**Methods:**
- `generateResponse(message: String, conversationHistory: Array)`: Promise<String> - Generates AI response
- `analyzeMessage(message: String)`: Promise<Object> - Analyzes message for sentiment and category
- `detectCrisis(message: String)`: Boolean - Detects crisis situations
- `suggestResources(category: String, sentiment: String)`: Array<String> - Suggests relevant resources
- `generateConversationTitle(firstMessage: String)`: Promise<String> - Generates conversation title
- `maintainContext(conversationId: ObjectId, maxMessages: Number)`: Promise<Array> - Maintains conversation context
- `handleCrisisResponse(message: String)`: Promise<Object> - Generates crisis support response
- `provideEmotionalSupport(sentiment: String, emotions: Array)`: Promise<String> - Provides empathetic response
- `answerMentalHealthQuestion(question: String)`: Promise<String> - Answers mental health questions
- `suggestCopingStrategies(mood: String, triggers: Array)`: Promise<Array<String>> - Suggests coping strategies
- `recommendActivities(mood: String, interests: Array)`: Promise<Array<String>> - Recommends activities
- `validateResponse(response: String)`: Boolean - Validates response appropriateness

**Functionality:**
Provides AI-powered chatbot functionality using OpenAI GPT models with teen-focused mental health support. Implements empathetic system prompt defining AI as supportive, non-judgmental companion for teenagers. Generates contextual responses by maintaining conversation history (last 10 messages) for coherent dialogue. Analyzes messages for sentiment (positive/neutral/negative/crisis) and category (greeting/question/emotional-support). Detects crisis situations using keyword matching (suicide, self-harm, abuse) and contextual analysis. Provides immediate crisis support with hotline numbers (1-800-273-8255), breathing exercises, and therapist booking links. Suggests relevant mental health resources based on message category (anxiety: breathing exercises, depression: mood tracker, stress: journaling). Generates conversation titles from first message using summarization. Recommends coping strategies based on mood and triggers (stressed: meditation, anxious: grounding techniques). Validates responses for appropriateness ensuring supportive, non-medical advice.

---

## 7. PAYMENT PROCESSING MODULE

### 7.1 Payment Class

**Attributes:**
- `_id`: ObjectId - Unique identifier for payment
- `appointmentId`: ObjectId - Reference to Appointment
- `userId`: ObjectId - Reference to User (payer)
- `therapistId`: ObjectId - Reference to Therapist (payee)
- `amount`: Number - Total payment amount in INR
- `currency`: String - Currency code (INR)
- `platformCharge`: Number - Platform fee amount (10% of total)
- `therapistPayout`: Number - Amount paid to therapist (90% of total)
- `status`: String - Payment status (pending/completed/refunded/failed)
- `method`: String - Payment method (fake-payment for demo)
- `transactionId`: String - Unique transaction identifier
- `razorpayOrderId`: String - Razorpay order ID (null for fake payments)
- `razorpayPaymentId`: String - Razorpay payment ID (null for fake payments)
- `refund.status`: String - Refund status (pending/completed/failed)
- `refund.amount`: Number - Refunded amount
- `refund.platformChargeDeducted`: Number - Platform charge kept (10%)
- `refund.refundedToUser`: Number - Amount returned to user (90%)
- `refund.reason`: String - Refund reason
- `refund.processedAt`: Date - Refund processing timestamp
- `paidAt`: Date - Payment completion timestamp
- `createdAt`: Date - Payment creation timestamp
- `updatedAt`: Date - Last update timestamp

**Methods:**
- `calculatePlatformCharge(amount: Number)`: Number - Calculates 10% platform fee
- `calculateTherapistPayout(amount: Number)`: Number - Calculates therapist payout (90%)
- `processFakePayment()`: Promise<Payment> - Simulates payment processing
- `processRefund(reason: String)`: Promise<Payment> - Processes refund with platform charge
- `generateTransactionId()`: String - Generates unique transaction ID
- `markAsCompleted(transactionId: String)`: Promise<Payment> - Marks payment as completed
- `markAsFailed(reason: String)`: Promise<Payment> - Marks payment as failed
- `calculateRefundAmount(totalAmount: Number)`: Number - Calculates refund (total - 10%)
- `validatePaymentAmount(amount: Number)`: Boolean - Validates amount is within ₹500-₹2000
- `static getPaymentHistory(userId: ObjectId)`: Promise<Array<Payment>> - Returns payment history
- `static getEarnings(therapistId: ObjectId, startDate: Date, endDate: Date)`: Promise<Object> - Calculates therapist earnings

**Functionality:**
Manages payment processing with fake payment simulation for demonstration purposes (replacing Razorpay integration for minor project). Implements 10% platform charge calculation with automatic therapist payout calculation (90% of total). Generates unique transaction IDs using timestamp and random string concatenation. Processes fake payments by updating status to 'completed' and storing transaction details. Handles refund processing with automatic platform charge deduction (user receives 90% refund, platform keeps 10%). Validates payment amounts to ensure they fall within expected range (₹500-₹2000 for 30-60 minute sessions). Stores comprehensive payment metadata including amounts, timestamps, and status changes. Provides payment history retrieval for users and earnings calculation for therapists. Maintains refund status tracking with separate pending/completed/failed states.

---

### 7.2 PaymentService Class

**Attributes:**
- `PLATFORM_CHARGE_PERCENTAGE`: Number - Platform fee (10%)
- `MIN_AMOUNT`: Number - Minimum payment amount (₹500)
- `MAX_AMOUNT`: Number - Maximum payment amount (₹2000)
- `REFUND_PROCESSING_TIME`: Number - Refund processing time in hours (24)
- `FAKE_PAYMENT_DELAY`: Number - Simulated payment delay in ms (2000)

**Methods:**
- `createPayment(appointmentId: ObjectId, amount: Number)`: Promise<Payment> - Creates payment record
- `processFakePayment(paymentId: ObjectId)`: Promise<Payment> - Simulates payment processing
- `processRazorpayPayment(paymentId: ObjectId, razorpayData: Object)`: Promise<Payment> - Processes Razorpay payment (for future)
- `validatePaymentAmount(amount: Number, therapistId: ObjectId, duration: Number)`: Boolean - Validates amount matches therapist rate
- `calculateTotalAmount(therapistId: ObjectId, duration: Number)`: Promise<Number> - Calculates total based on therapist rate
- `initiateRefund(appointmentId: ObjectId, reason: String)`: Promise<Payment> - Initiates refund process
- `processRefund(paymentId: ObjectId)`: Promise<Payment> - Completes refund processing
- `calculatePlatformEarnings(startDate: Date, endDate: Date)`: Promise<Number> - Calculates platform earnings
- `calculateTherapistEarnings(therapistId: ObjectId, startDate: Date, endDate: Date)`: Promise<Object> - Calculates therapist earnings
- `generateInvoice(paymentId: ObjectId)`: Promise<String> - Generates payment invoice
- `sendPaymentConfirmation(paymentId: ObjectId)`: Promise<void> - Sends payment confirmation email
- `sendRefundConfirmation(paymentId: ObjectId)`: Promise<void> - Sends refund confirmation email
- `getPaymentStatus(transactionId: String)`: Promise<String> - Retrieves payment status
- `static getTransactionHistory(userId: ObjectId, limit: Number)`: Promise<Array> - Returns transaction history

**Functionality:**
Provides centralized payment processing service with fake payment simulation for demo environment. Implements payment flow including creation, validation, processing, and confirmation. Simulates Razorpay-like payment processing with 2-second delay to mimic real payment gateway. Validates payment amounts against therapist rates and session durations to prevent fraud. Calculates total amounts dynamically based on therapist's configured pricing and session duration. Handles refund initiation with eligibility checks (before session start time) and processes refunds with 10% platform charge deduction. Sends automated email confirmations for successful payments and processed refunds. Generates payment invoices with transaction details, amounts, and platform charges. Calculates platform earnings from all transactions in date range. Provides therapist earnings breakdown with total earned, platform charges, and net payout. Maintains transaction history with filtering and pagination support.

---

## 8. VIDEO CONFERENCE MODULE

### 8.1 VideoSession Class

**Attributes:**
- `_id`: ObjectId - Unique identifier for video session
- `appointmentId`: ObjectId - Reference to Appointment
- `meetingRoomId`: String - Jitsi meeting room ID
- `meetingLink`: String - Full Jitsi meeting URL
- `accessCode`: String - Optional access code for security
- `hostId`: ObjectId - Therapist ID (host)
- `participantId`: ObjectId - User ID (participant)
- `hostDisplayName`: String - Therapist's display name
- `participantDisplayName`: String - "Teen User" for anonymity
- `startTime`: Date - Scheduled start time
- `endTime`: Date - Scheduled end time
- `actualStartTime`: Date - Actual session start timestamp
- `actualEndTime`: Date - Actual session end timestamp
- `duration`: Number - Scheduled duration in minutes
- `actualDuration`: Number - Actual session duration in minutes
- `status`: String - Session status (scheduled/active/completed/cancelled)
- `accessWindow.start`: Date - Access allowed from (5 min before start)
- `accessWindow.end`: Date - Access allowed until (scheduled end time)
- `participants`: Array<Object> - Participant join/leave events
- `participants[].userId`: ObjectId - Participant user ID
- `participants[].joinedAt`: Date - Join timestamp
- `participants[].leftAt`: Date - Leave timestamp
- `recording.enabled`: Boolean - Recording enabled (default: false)
- `recording.url`: String - Recording URL if enabled
- `createdAt`: Date - Creation timestamp
- `updatedAt`: Date - Last update timestamp

**Methods:**
- `generateMeetingLink(appointmentId: ObjectId)`: String - Generates unique Jitsi meeting link
- `generateRoomId()`: String - Generates unique room ID
- `validateAccessTime()`: Boolean - Checks if current time is within access window
- `canUserJoin(userId: ObjectId)`: Boolean - Validates user can join session
- `startSession()`: Promise<VideoSession> - Marks session as active
- `endSession()`: Promise<VideoSession> - Marks session as completed
- `addParticipant(userId: ObjectId)`: Promise<VideoSession> - Records participant join
- `removeParticipant(userId: ObjectId)`: Promise<VideoSession> - Records participant leave
- `calculateActualDuration()`: Number - Calculates actual session duration
- `getSessionStatus()`: String - Returns current session status
- `generateAnonymousNames()`: Object - Generates display names (therapist name + "Teen User")
- `isSessionActive()`: Boolean - Checks if session is currently active
- `autoEndSession()`: Promise<VideoSession> - Auto-ends session after scheduled time

**Functionality:**
Manages Jitsi video conference sessions for therapy appointments with time-restricted access and anonymity preservation. Generates unique Jitsi meeting links using appointment ID and timestamp (format: https://meet.jit.si/zenmind-{appointmentId}-{timestamp}). Creates access windows allowing users to join 5 minutes before scheduled start and until scheduled end time for security. Implements display name anonymization where therapists see "Teen User" instead of actual teen name. Tracks participant join/leave events with timestamps for session monitoring. Validates user access by checking user ID matches appointment and current time is within access window. Automatically starts sessions when first participant joins and ends when scheduled end time is reached. Records actual session duration by calculating time between actualStartTime and actualEndTime. Supports optional session recording with URL storage (disabled by default for privacy). Provides session status tracking (scheduled/active/completed/cancelled) for UI display.

---

### 8.2 VideoConferenceService Class

**Attributes:**
- `JITSI_DOMAIN`: String - Jitsi server domain (meet.jit.si)
- `JITSI_APP_ID`: String - Application ID for Jitsi (optional)
- `SESSION_ACCESS_BUFFER`: Number - Minutes before session to allow access (5)
- `AUTO_END_DELAY`: Number - Minutes after scheduled end to auto-end (15)
- `RECORDING_ENABLED`: Boolean - Enable recording feature (false)

**Methods:**
- `createVideoSession(appointmentId: ObjectId)`: Promise<VideoSession> - Creates video session
- `generateJitsiConfig(sessionId: ObjectId)`: Object - Generates Jitsi configuration
- `getMeetingLink(sessionId: ObjectId)`: Promise<String> - Retrieves meeting link
- `validateSessionAccess(userId: ObjectId, sessionId: ObjectId)`: Promise<Boolean> - Validates access
- `startSessionTracking(sessionId: ObjectId, userId: ObjectId)`: Promise<void> - Tracks session start
- `endSessionTracking(sessionId: ObjectId, userId: ObjectId)`: Promise<void> - Tracks session end
- `enforceTimeRestrictions(sessionId: ObjectId)`: Promise<Boolean> - Enforces access window
- `autoEndExpiredSessions()`: Promise<void> - Auto-ends sessions past scheduled time
- `getActiveSession(appointmentId: ObjectId)`: Promise<VideoSession> - Returns active session
- `generateAnonymousDisplayNames(userId: ObjectId, therapistId: ObjectId)`: Promise<Object> - Generates display names
- `getSessionStatistics(therapistId: ObjectId)`: Promise<Object> - Returns session stats
- `getSessionRecording(sessionId: ObjectId)`: Promise<String> - Retrieves recording URL
- `enableRecording(sessionId: ObjectId)`: Promise<VideoSession> - Enables session recording
- `disableRecording(sessionId: ObjectId)`: Promise<VideoSession> - Disables recording

**Functionality:**
Provides comprehensive video conferencing service integrating Jitsi Meet for secure therapy sessions. Creates video sessions linked to appointments with automatic meeting link generation. Generates Jitsi configuration objects with customized settings (display name, audio/video defaults, toolbar options). Enforces strict time-restricted access allowing entry only 5 minutes before to scheduled end time. Validates user access by checking appointment ownership and access window. Tracks session participation with join/leave timestamps for billing and analytics. Implements automatic session ending 15 minutes after scheduled end time to prevent indefinite sessions. Preserves teen anonymity by setting display names as "Teen User" for all teen participants. Provides session statistics including total sessions, average duration, and completion rate. Supports optional recording functionality (disabled by default for privacy compliance). Generates anonymous display names where therapist sees "Teen User" and teen sees therapist's professional name.

---

## 9. EMAIL NOTIFICATION MODULE

### 9.1 EmailTemplate Class

**Attributes:**
- `_id`: ObjectId - Unique identifier for template
- `name`: String - Template name (booking-confirmation, reminder, cancellation, etc.)
- `subject`: String - Email subject line with variables
- `htmlBody`: String - HTML email body with variables
- `textBody`: String - Plain text email body
- `variables`: Array<String> - List of template variables (userName, therapistName, date, time, etc.)
- `category`: String - Template category (appointment/notification/alert)
- `isActive`: Boolean - Active status
- `createdAt`: Date - Creation timestamp
- `updatedAt`: Date - Last update timestamp

**Methods:**
- `renderTemplate(data: Object)`: String - Renders template with provided data
- `replaceVariables(template: String, data: Object)`: String - Replaces template variables
- `validateVariables(data: Object)`: Boolean - Validates all required variables present
- `previewTemplate(sampleData: Object)`: String - Generates preview with sample data
- `static getTemplateByName(name: String)`: Promise<EmailTemplate> - Retrieves template by name

**Functionality:**
Manages email templates with variable substitution for dynamic content. Stores HTML and plain text versions for email client compatibility. Implements variable replacement system using {{variableName}} syntax. Validates required variables are provided before sending. Supports multiple template categories for different email types. Provides template preview functionality for testing. Maintains active/inactive status for template versioning.

---

### 9.2 EmailNotificationService Class

**Attributes:**
- `SMTP_HOST`: String - SMTP server host (environment variable)
- `SMTP_PORT`: Number - SMTP server port (587)
- `SMTP_USER`: String - SMTP username (environment variable)
- `SMTP_PASS`: String - SMTP password (environment variable)
- `FROM_EMAIL`: String - Sender email address
- `FROM_NAME`: String - Sender name (ZEN-MIND Support)
- `TRANSPORTER`: Object - Nodemailer transporter instance

**Methods:**
- `sendBookingConfirmation(appointment: Appointment, user: User, therapist: Therapist)`: Promise<void> - Sends booking confirmation to user
- `sendTherapistBookingNotification(appointment: Appointment, therapist: Therapist)`: Promise<void> - Notifies therapist of new booking
- `sendSessionReminder(appointment: Appointment, user: User)`: Promise<void> - Sends reminder 24 hours before session
- `sendCancellationEmail(appointment: Appointment, user: User, reason: String)`: Promise<void> - Notifies cancellation
- `sendRefundConfirmation(payment: Payment, user: User)`: Promise<void> - Confirms refund processing
- `sendOTPEmail(email: String, otp: String, purpose: String)`: Promise<void> - Sends OTP code
- `sendWelcomeEmail(user: User)`: Promise<void> - Sends welcome email after registration
- `sendPasswordResetEmail(user: User, resetToken: String)`: Promise<void> - Sends password reset link
- `sendReviewRequest(appointment: Appointment, user: User)`: Promise<void> - Requests session review
- `sendCrisisAlert(user: User, message: String)`: Promise<void> - Sends crisis alert to support team
- `sendTherapistWelcome(therapist: Therapist)`: Promise<void> - Sends therapist onboarding email
- `sendMonthlyReport(user: User, reportData: Object)`: Promise<void> - Sends monthly wellness report
- `formatEmailData(appointment: Appointment, user: User, therapist: Therapist)`: Object - Formats data for templates
- `validateEmail(email: String)`: Boolean - Validates email format

**Functionality:**
Provides comprehensive email notification service using Nodemailer with SMTP configuration. Sends automated booking confirmations to teens with appointment details, therapist name (maintaining teen anonymity by not sharing teen details with therapist), meeting link, and date/time. Notifies therapists of new bookings with appointment ID, date/time, and session duration (without teen personal information). Sends reminder emails 24 hours before scheduled sessions with meeting link access instructions. Handles cancellation notifications with cancellation reason and refund status. Confirms refund processing with breakdown of platform charges and refunded amount. Sends OTP codes for email verification and password resets with 5-minute expiration notice. Implements welcome email flow for new user onboarding with platform features overview. Sends password reset emails with secure token links. Requests post-session reviews after appointment completion. Triggers crisis alerts to support team when AI detects concerning messages. Provides monthly wellness reports with mood trends, journal stats, and goal progress. Formats email data from appointment/user/therapist objects for template compatibility.

---

## 10. DATABASE SERVICE MODULE

### 10.1 DatabaseConnector Class

**Attributes:**
- `MONGODB_URI`: String - MongoDB connection string (environment variable)
- `DB_NAME`: String - Database name (zenmind-db)
- `connection`: Object - Mongoose connection instance
- `isConnected`: Boolean - Connection status
- `connectionOptions`: Object - Mongoose connection options
- `maxRetries`: Number - Maximum connection retry attempts (5)
- `retryDelay`: Number - Delay between retries in ms (5000)

**Methods:**
- `connect()`: Promise<Boolean> - Establishes database connection
- `disconnect()`: Promise<void> - Closes database connection
- `isConnectionAlive()`: Boolean - Checks connection health
- `reconnect()`: Promise<Boolean> - Reconnects to database
- `handleConnectionError(error: Error)`: void - Handles connection errors
- `createIndexes()`: Promise<void> - Creates database indexes
- `getConnectionStatus()`: String - Returns connection status string
- `static getInstance()`: DatabaseConnector - Returns singleton instance

**Functionality:**
Manages MongoDB Atlas database connections using Mongoose ODM. Implements connection pooling with automatic reconnection on failure. Creates essential indexes on User, Therapist, Appointment, Mood, Journal, and ChatMessage collections for query optimization. Handles connection errors with retry logic (5 attempts with 5-second delay). Provides singleton pattern for single connection instance across application. Monitors connection health and triggers reconnection when needed.

---

### 10.2 DataValidationService Class

**Attributes:**
- `EMAIL_REGEX`: RegExp - Email validation regex
- `PHONE_REGEX`: RegExp - Phone number validation regex
- `PASSWORD_REGEX`: RegExp - Password strength regex
- `URL_REGEX`: RegExp - URL validation regex
- `MONGOOSE_ID_REGEX`: RegExp - MongoDB ObjectId validation regex

**Methods:**
- `validateEmail(email: String)`: Boolean - Validates email format
- `validatePassword(password: String)`: Object - Validates password strength and returns errors
- `validatePhone(phone: String)`: Boolean - Validates phone number format
- `validateAge(age: Number)`: Boolean - Validates age is 13-19
- `validateObjectId(id: String)`: Boolean - Validates MongoDB ObjectId format
- `validateURL(url: String)`: Boolean - Validates URL format
- `sanitizeInput(input: String)`: String - Sanitizes user input to prevent XSS
- `validateDateRange(startDate: Date, endDate: Date)`: Boolean - Validates date range
- `validatePriceRange(price: Number)`: Boolean - Validates price is ₹500-₹1000
- `validateSessionDuration(duration: Number)`: Boolean - Validates duration is 30 or 60
- `validateMoodIntensity(intensity: Number)`: Boolean - Validates intensity is 1-10
- `validateRating(rating: Number)`: Boolean - Validates rating is 1-5
- `escapeHTML(html: String)`: String - Escapes HTML to prevent injection

**Functionality:**
Provides comprehensive data validation services for all user inputs. Validates email format using RFC 5322 compliant regex. Enforces password strength requirements (8+ chars, uppercase, lowercase, number, special char). Validates phone numbers in international format. Ensures age restrictions (13-19 for teens). Validates MongoDB ObjectId format before database queries. Sanitizes all user inputs to prevent XSS attacks by escaping HTML characters. Validates date ranges to ensure end date is after start date. Enforces business rules like price ranges (₹500-₹1000) and session durations (30 or 60 minutes). Validates mood intensity and rating scales.

---

### 10.3 ErrorHandler Class

**Attributes:**
- `errorLog`: Array<Object> - In-memory error log
- `maxLogSize`: Number - Maximum log entries (1000)
- `enableLogging`: Boolean - Enable error logging (true)

**Methods:**
- `handleError(error: Error, context: String)`: Object - Handles errors and returns formatted response
- `logError(error: Error, context: String)`: void - Logs error to database/file
- `formatErrorResponse(error: Error)`: Object - Formats error for API response
- `isOperationalError(error: Error)`: Boolean - Checks if error is operational vs programmer error
- `sendErrorNotification(error: Error)`: Promise<void> - Sends critical error notifications
- `getErrorLogs(startDate: Date, endDate: Date)`: Promise<Array> - Retrieves error logs
- `clearErrorLogs()`: Promise<void> - Clears old error logs
- `static handleMongooseError(error: Error)`: Object - Handles Mongoose-specific errors
- `static handleJWTError(error: Error)`: Object - Handles JWT-specific errors
- `static handleValidationError(error: Error)`: Object - Handles validation errors

**Functionality:**
Provides centralized error handling across the application. Categorizes errors into operational (expected) and programmer (bugs) errors. Formats error responses with appropriate HTTP status codes and user-friendly messages. Logs errors to database with context, stack trace, and timestamp. Implements error notification for critical errors via email/SMS. Handles Mongoose errors like validation failures, duplicate keys, and cast errors. Processes JWT errors like expired tokens and invalid signatures. Sanitizes error messages to prevent information leakage in production.

---

## 11. PLANTUML DIAGRAM CODE

Copy the following code to PlantUML online editor (http://www.plantuml.com/plantuml/) or use PlantUML extension in VS Code:

```plantuml
@startuml ZEN-MIND Class Diagram

' Color scheme
skinparam class {
    BackgroundColor<<User>> LightBlue
    BackgroundColor<<Therapist>> LightGreen
    BackgroundColor<<Appointment>> LightYellow
    BackgroundColor<<Mood>> LightPink
    BackgroundColor<<Journal>> LightCoral
    BackgroundColor<<Chat>> LightCyan
    BackgroundColor<<Payment>> LightGoldenRodYellow
    BackgroundColor<<Service>> Lavender
    BorderColor Black
    ArrowColor Black
}

' User Authentication Module
class User <<User>> {
    - _id: ObjectId
    - name: String
    - email: String
    - password: String
    - age: Number
    - avatar: String
    - role: String
    - profile: Object
    - settings: Object
    - subscription: Object
    - streakCount: Number
    - lastCheckIn: Date
    --
    + comparePassword(candidatePassword: String): Boolean
    + updateStreak(): Promise<User>
    + hashPassword(): void
    + validateEmail(email: String): Boolean
    + validatePassword(password: String): Boolean
    + getPublicProfile(): Object
    + updateSettings(settings: Object): Promise<User>
    + updateProfile(profile: Object): Promise<User>
    --
    **Functionality:**
    Manages user authentication, profile data,
    preferences, subscription plans, and
    engagement tracking through streak counts.
    Implements secure password hashing using
    bcrypt with automatic pre-save hooks.
}

class AuthenticationService <<Service>> {
    - JWT_SECRET: String
    - JWT_EXPIRE: String
    - SALT_ROUNDS: Number
    - OTP_EXPIRY: Number
    --
    + generateToken(userId, role): String
    + verifyToken(token): Object
    + refreshToken(token): String
    + hashPassword(password): Promise<String>
    + comparePassword(plain, hashed): Promise<Boolean>
    + authenticateUser(email, password): Promise<User>
    + authenticateTherapist(email, password): Promise<Therapist>
    + sendOTP(email): Promise<String>
    + verifyOTP(email, otp): Promise<Boolean>
    + resetPassword(email, newPassword, otp): Promise<Boolean>
    --
    **Functionality:**
    Provides secure authentication using JWT
    tokens with bcrypt password hashing.
    Implements separate authentication flows
    for teens and therapists with OTP support.
}

class OTP <<User>> {
    - _id: ObjectId
    - email: String
    - otp: String
    - purpose: String
    - expiresAt: Date
    - isUsed: Boolean
    - attempts: Number
    - maxAttempts: Number
    --
    + generateOTP(): String
    + verify(code): Boolean
    + markAsUsed(): Promise<OTP>
    + isExpired(): Boolean
    + incrementAttempts(): Promise<OTP>
    --
    **Functionality:**
    Manages one-time passwords for email
    verification and password resets with
    5-minute expiration and 3-attempt limit.
}

' Therapist Management Module
class Therapist <<Therapist>> {
    - _id: ObjectId
    - name: String
    - email: String
    - password: String
    - profilePicture: String
    - about: String
    - specializations: Array<String>
    - education: String
    - experience: Number
    - languages: Array<String>
    - pricePerSession: Number
    - sessionDuration: Number
    - currentSession: Object
    - availableSlots: Array<Object>
    - rating: Number
    - reviewCount: Number
    - reviews: Array<Object>
    - role: String
    --
    + comparePassword(candidatePassword): Promise<Boolean>
    + initializeDefaultSlots(): Promise<void>
    + getAvailableSlots(date): Array<Object>
    + bookSlot(date, startTime, userId, appointmentId): Promise<Object>
    + cancelSlot(date, startTime): Promise<void>
    + addReview(appointmentId, userId, rating, comment): Promise<Therapist>
    + updateRating(): Promise<Therapist>
    + updatePricing(pricePerSession): Promise<Therapist>
    + startSession(appointmentId): Promise<Therapist>
    + endSession(): Promise<Therapist>
    --
    **Functionality:**
    Manages therapist profiles with credentials,
    specializations, configurable pricing
    (₹500-₹1000), and dynamic availability slots.
    Handles real-time session tracking and
    maintains complete anonymity from teen data.
}

class TherapistService <<Service>> {
    - MIN_PRICE: Number
    - MAX_PRICE: Number
    - DEFAULT_SLOTS_PER_DAY: Number
    - EXPERIENCE_PRICE_MAP: Object
    --
    + getAllTherapists(): Promise<Array<Therapist>>
    + getTherapistById(therapistId): Promise<Therapist>
    + getTherapistsBySpecialization(specialization): Promise<Array>
    + getAvailableTherapists(date, time): Promise<Array>
    + calculateRecommendedPrice(experience): Number
    + validateSlotTiming(startTime, endTime): Boolean
    + checkSlotConflict(therapistId, date, startTime): Promise<Boolean>
    + getTherapistStats(therapistId): Promise<Object>
    --
    **Functionality:**
    Provides centralized therapist management
    with pricing logic, slot generation, and
    availability checking. Implements experience-
    based price recommendations (0-2yr: ₹500-600,
    3-5yr: ₹700-800, 6+yr: ₹900-1000).
}

' Appointment Booking Module
class Appointment <<Appointment>> {
    - _id: ObjectId
    - userId: ObjectId
    - therapistId: ObjectId
    - therapistName: String
    - therapistAvatar: String
    - date: Date
    - startTime: String
    - endTime: String
    - duration: Number
    - type: String
    - status: String
    - notes: String
    - reason: String
    - meetingLink: String
    - reminderSent: Boolean
    - payment: Object
    - cancellation: Object
    - review: Object
    - sessionNotes: String
    --
    + checkConflicts(): Promise<Boolean>
    + static getUpcoming(userId, userType): Promise<Array>
    + static getStats(userId, userType): Promise<Object>
    + generateMeetingLink(): String
    + sendReminder(): Promise<void>
    + canJoinSession(): Boolean
    + markAsCompleted(): Promise<Appointment>
    + cancel(cancelledBy, reason): Promise<Appointment>
    + processPayment(transactionId): Promise<Appointment>
    + processRefund(reason): Promise<Appointment>
    + addReview(rating, comment): Promise<Appointment>
    --
    **Functionality:**
    Manages therapy session bookings with conflict
    detection, payment processing, Jitsi meeting
    links, email notifications, and post-session
    reviews. Supports refunds with 10% platform
    charge and time-restricted session access.
}

class BookingService <<Service>> {
    - PLATFORM_CHARGE_PERCENTAGE: Number
    - MIN_BOOKING_ADVANCE: Number
    - SESSION_ACCESS_BUFFER: Number
    - REMINDER_HOURS: Number
    --
    + createBooking(userId, therapistId, date, startTime, duration, reason): Promise<Appointment>
    + validateBooking(therapistId, date, startTime, duration): Promise<Boolean>
    + checkTherapistAvailability(therapistId, date, startTime): Promise<Boolean>
    + calculateTotalPrice(therapistId, duration): Promise<Number>
    + processBookingPayment(appointmentId, paymentData): Promise<Appointment>
    + cancelBooking(appointmentId, cancelledBy, reason): Promise<Appointment>
    + rescheduleBooking(appointmentId, newDate, newStartTime): Promise<Appointment>
    + sendBookingConfirmation(appointmentId): Promise<void>
    + processRefund(appointmentId, reason): Promise<Object>
    --
    **Functionality:**
    Provides comprehensive booking management
    with validation, availability checking, price
    calculation, and refund processing. Enforces
    2-hour minimum advance booking and 5-minute
    pre-session access window.
}

' Mood Tracking Module
class Mood <<Mood>> {
    - _id: ObjectId
    - userId: ObjectId
    - mood: String
    - intensity: Number
    - emotions: Array<String>
    - activities: Array<String>
    - triggers: Array<String>
    - notes: String
    - energy: Number
    - sleep: Object
    - social: String
    - suggestion: Object
    - date: Date
    --
    + static getUserStats(userId, days): Promise<Object>
    + static getMoodTrends(userId, days): Promise<Array>
    + generateSuggestions(): Promise<Object>
    + analyzeMoodPattern(userId): Promise<Object>
    + getTriggerAnalysis(userId): Promise<Object>
    + getSleepCorrelation(userId): Promise<Object>
    + getEnergyCorrelation(userId): Promise<Object>
    + getEmotionDistribution(userId): Promise<Object>
    --
    **Functionality:**
    Tracks daily mood entries with emotional
    states, intensity (1-10), activities, and
    triggers. Provides AI-generated personalized
    suggestions and correlates mood with sleep,
    energy, and social interaction patterns.
}

class MoodAnalyticsService <<Service>> {
    - MOOD_SCORE_MAP: Object
    - SUGGESTION_DATABASE: Object
    - MIN_ENTRIES_FOR_ANALYSIS: Number
    --
    + getMoodScore(mood): Number
    + calculateAverageMood(userId, days): Promise<Number>
    + getMoodDistribution(userId, days): Promise<Object>
    + identifyMoodPatterns(userId): Promise<Object>
    + predictMoodTrend(userId): Promise<String>
    + generatePersonalizedSuggestions(mood, intensity, emotions, triggers): Promise<Object>
    + correlateSleepWithMood(userId): Promise<Object>
    + identifyTopTriggers(userId, limit): Promise<Array>
    + generateWeeklyReport(userId): Promise<Object>
    + detectAnomalies(userId): Promise<Array>
    --
    **Functionality:**
    Provides advanced mood analytics with
    numerical scoring (amazing=5, sad=2, angry=1),
    pattern identification, trend prediction, and
    AI-powered suggestions from database of 100+
    activities, books, songs, and exercises.
}

' Journal Management Module
class Journal <<Journal>> {
    - _id: ObjectId
    - userId: ObjectId
    - title: String
    - content: String
    - mood: String
    - tags: Array<String>
    - isPrivate: Boolean
    - isFavorite: Boolean
    - gratitude: Array<String>
    - goals: Array<Object>
    - aiInsights: Object
    - attachments: Array<Object>
    --
    + static getUserStats(userId): Promise<Object>
    + analyzeContent(): Promise<Object>
    + extractThemes(): Promise<Array<String>>
    + detectSentiment(): Promise<String>
    + generateInsights(): Promise<Object>
    + addTag(tag): Promise<Journal>
    + toggleFavorite(): Promise<Journal>
    + addGoal(goalText): Promise<Journal>
    + completeGoal(goalIndex): Promise<Journal>
    + searchContent(query): Promise<Array<Journal>>
    --
    **Functionality:**
    Manages private journaling with markdown
    support, AI sentiment analysis, theme
    extraction, gratitude lists, and goal
    tracking. Default isPrivate: true for
    privacy. Supports multimedia attachments.
}

class JournalAnalyticsService <<Service>> {
    - SENTIMENT_THRESHOLD_POSITIVE: Number
    - SENTIMENT_THRESHOLD_NEGATIVE: Number
    - THEME_EXTRACTION_MIN_FREQUENCY: Number
    --
    + analyzeSentiment(content): Promise<Object>
    + extractKeywords(content): Promise<Array<String>>
    + identifyThemes(userId): Promise<Array<Object>>
    + calculateWritingStreak(userId): Promise<Number>
    + getWritingFrequency(userId, period): Promise<Object>
    + getMoodCorrelation(userId): Promise<Object>
    + getTopTags(userId, limit): Promise<Array<Object>>
    + getGoalCompletionRate(userId): Promise<Number>
    + generateMonthlyReport(userId, year, month): Promise<Object>
    + suggestWritingPrompts(userId): Promise<Array<String>>
    --
    **Functionality:**
    Provides sentiment analysis (positive >0.3,
    negative <-0.3), theme extraction via TF-IDF,
    writing streak tracking, and mood correlation.
    Generates monthly reports and personalized
    writing prompts based on history.
}

' AI Chat Module
class ChatMessage <<Chat>> {
    - _id: ObjectId
    - conversationId: ObjectId
    - senderId: ObjectId
    - receiverId: ObjectId
    - message: String
    - type: String
    - isAI: Boolean
    - metadata: Object
    - attachments: Array<Object>
    - isRead: Boolean
    - readAt: Date
    --
    + markAsRead(): Promise<ChatMessage>
    + editMessage(newContent): Promise<ChatMessage>
    + detectCrisis(): Boolean
    + analyzeSentiment(): Promise<String>
    + categorizeMessage(): Promise<String>
    + suggestResources(): Promise<Array<String>>
    + static getConversationHistory(conversationId, limit): Promise<Array>
    --
    **Functionality:**
    Handles AI chatbot conversations with
    sentiment analysis and crisis detection.
    Detects crisis keywords (suicide, self-harm)
    and suggests resources. Categorizes messages
    as greeting/question/crisis/emotional-support.
}

class Conversation <<Chat>> {
    - _id: ObjectId
    - userId: ObjectId
    - title: String
    - category: String
    - isActive: Boolean
    - lastMessageAt: Date
    - messageCount: Number
    - unreadCount: Number
    - crisisDetected: Boolean
    --
    + addMessage(messageId): Promise<Conversation>
    + updateLastMessage(timestamp): Promise<Conversation>
    + markAllAsRead(): Promise<Conversation>
    + analyzeSentiment(): Promise<String>
    + detectCrisis(): Promise<Boolean>
    --
    **Functionality:**
    Manages AI chat conversations with metadata.
    Auto-generates titles, categorizes chats,
    tracks sentiment, and detects crisis patterns.
}

class AIService <<Service>> {
    - OPENAI_API_KEY: String
    - MODEL: String
    - MAX_TOKENS: Number
    - CRISIS_KEYWORDS: Array<String>
    - RESOURCE_DATABASE: Object
    --
    + generateResponse(message, conversationHistory): Promise<String>
    + analyzeMessage(message): Promise<Object>
    + detectCrisis(message): Boolean
    + suggestResources(category, sentiment): Array<String>
    + maintainContext(conversationId, maxMessages): Promise<Array>
    + handleCrisisResponse(message): Promise<Object>
    + provideEmotionalSupport(sentiment, emotions): Promise<String>
    + suggestCopingStrategies(mood, triggers): Promise<Array>
    --
    **Functionality:**
    Provides AI chatbot using OpenAI GPT with
    teen-focused mental health support. Generates
    contextual responses, detects crisis (suicide,
    self-harm), suggests resources, and provides
    coping strategies. Maintains 10-message history.
}

' Payment Processing Module
class Payment <<Payment>> {
    - _id: ObjectId
    - appointmentId: ObjectId
    - userId: ObjectId
    - therapistId: ObjectId
    - amount: Number
    - currency: String
    - platformCharge: Number
    - therapistPayout: Number
    - status: String
    - method: String
    - transactionId: String
    - refund: Object
    - paidAt: Date
    --
    + calculatePlatformCharge(amount): Number
    + calculateTherapistPayout(amount): Number
    + processFakePayment(): Promise<Payment>
    + processRefund(reason): Promise<Payment>
    + generateTransactionId(): String
    + markAsCompleted(transactionId): Promise<Payment>
    + calculateRefundAmount(totalAmount): Number
    --
    **Functionality:**
    Manages payment processing with fake payment
    simulation. Implements 10% platform charge
    with 90% therapist payout. Processes refunds
    deducting 10% platform fee (user gets 90%).
}

class PaymentService <<Service>> {
    - PLATFORM_CHARGE_PERCENTAGE: Number
    - MIN_AMOUNT: Number
    - MAX_AMOUNT: Number
    - REFUND_PROCESSING_TIME: Number
    --
    + createPayment(appointmentId, amount): Promise<Payment>
    + processFakePayment(paymentId): Promise<Payment>
    + validatePaymentAmount(amount, therapistId, duration): Boolean
    + calculateTotalAmount(therapistId, duration): Promise<Number>
    + initiateRefund(appointmentId, reason): Promise<Payment>
    + calculatePlatformEarnings(startDate, endDate): Promise<Number>
    + calculateTherapistEarnings(therapistId, startDate, endDate): Promise<Object>
    + generateInvoice(paymentId): Promise<String>
    + sendPaymentConfirmation(paymentId): Promise<void>
    --
    **Functionality:**
    Provides payment service with fake payment
    simulation (2-second delay). Validates amounts,
    processes refunds with 10% platform charge,
    generates invoices, and sends confirmations.
}

' Video Conference Module
class VideoSession <<Service>> {
    - _id: ObjectId
    - appointmentId: ObjectId
    - meetingRoomId: String
    - meetingLink: String
    - hostId: ObjectId
    - participantId: ObjectId
    - hostDisplayName: String
    - participantDisplayName: String
    - startTime: Date
    - endTime: Date
    - actualDuration: Number
    - status: String
    - accessWindow: Object
    - participants: Array<Object>
    --
    + generateMeetingLink(appointmentId): String
    + validateAccessTime(): Boolean
    + canUserJoin(userId): Boolean
    + startSession(): Promise<VideoSession>
    + endSession(): Promise<VideoSession>
    + addParticipant(userId): Promise<VideoSession>
    + generateAnonymousNames(): Object
    + autoEndSession(): Promise<VideoSession>
    --
    **Functionality:**
    Manages Jitsi video sessions with time-
    restricted access (5 min before to end time).
    Preserves anonymity ("Teen User" display).
    Tracks join/leave events and auto-ends after
    scheduled time.
}

class VideoConferenceService <<Service>> {
    - JITSI_DOMAIN: String
    - SESSION_ACCESS_BUFFER: Number
    - AUTO_END_DELAY: Number
    --
    + createVideoSession(appointmentId): Promise<VideoSession>
    + generateJitsiConfig(sessionId): Object
    + validateSessionAccess(userId, sessionId): Promise<Boolean>
    + enforceTimeRestrictions(sessionId): Promise<Boolean>
    + autoEndExpiredSessions(): Promise<void>
    + generateAnonymousDisplayNames(userId, therapistId): Promise<Object>
    + getSessionStatistics(therapistId): Promise<Object>
    --
    **Functionality:**
    Integrates Jitsi Meet for therapy sessions.
    Enforces 5-minute pre-access window, validates
    users, preserves anonymity with display names,
    and auto-ends sessions 15 min after end time.
}

' Email Notification Module
class EmailNotificationService <<Service>> {
    - SMTP_HOST: String
    - SMTP_PORT: Number
    - FROM_EMAIL: String
    - FROM_NAME: String
    --
    + sendBookingConfirmation(appointment, user, therapist): Promise<void>
    + sendTherapistBookingNotification(appointment, therapist): Promise<void>
    + sendSessionReminder(appointment, user): Promise<void>
    + sendCancellationEmail(appointment, user, reason): Promise<void>
    + sendRefundConfirmation(payment, user): Promise<void>
    + sendOTPEmail(email, otp, purpose): Promise<void>
    + sendWelcomeEmail(user): Promise<void>
    + sendReviewRequest(appointment, user): Promise<void>
    + sendCrisisAlert(user, message): Promise<void>
    + sendMonthlyReport(user, reportData): Promise<void>
    --
    **Functionality:**
    Provides email notifications using Nodemailer.
    Sends booking confirmations (maintains teen
    anonymity), reminders 24hr before, cancellation
    notices, refund confirmations, OTP codes,
    welcome emails, and crisis alerts.
}

' Database Service Module
class DatabaseConnector <<Service>> {
    - MONGODB_URI: String
    - DB_NAME: String
    - connection: Object
    - isConnected: Boolean
    - maxRetries: Number
    --
    + connect(): Promise<Boolean>
    + disconnect(): Promise<void>
    + isConnectionAlive(): Boolean
    + reconnect(): Promise<Boolean>
    + createIndexes(): Promise<void>
    + static getInstance(): DatabaseConnector
    --
    **Functionality:**
    Manages MongoDB Atlas connections using
    Mongoose ODM. Implements connection pooling,
    auto-reconnection (5 retries), and creates
    indexes on all collections.
}

class DataValidationService <<Service>> {
    - EMAIL_REGEX: RegExp
    - PASSWORD_REGEX: RegExp
    - PHONE_REGEX: RegExp
    --
    + validateEmail(email): Boolean
    + validatePassword(password): Object
    + validatePhone(phone): Boolean
    + validateAge(age): Boolean
    + validateObjectId(id): Boolean
    + sanitizeInput(input): String
    + validatePriceRange(price): Boolean
    + validateSessionDuration(duration): Boolean
    + validateMoodIntensity(intensity): Boolean
    + escapeHTML(html): String
    --
    **Functionality:**
    Provides comprehensive data validation.
    Validates email, password strength (8+ chars,
    uppercase, lowercase, number, special char),
    phone, age (13-19), ObjectId format. Sanitizes
    inputs to prevent XSS attacks.
}

' Relationships
User "1" --> "0..*" Appointment : books
User "1" --> "0..*" Mood : tracks
User "1" --> "0..*" Journal : writes
User "1" --> "0..*" ChatMessage : sends
User "1" --> "0..*" Conversation : has

Therapist "1" --> "0..*" Appointment : conducts
Therapist "1" --> "0..*" Payment : receives

Appointment "1" --> "1" Payment : has
Appointment "1" --> "1" VideoSession : has
Appointment "*" --> "1" User : belongs to
Appointment "*" --> "1" Therapist : with

Conversation "1" --> "0..*" ChatMessage : contains

AuthenticationService ..> User : authenticates
AuthenticationService ..> Therapist : authenticates
AuthenticationService ..> OTP : manages

TherapistService ..> Therapist : manages
BookingService ..> Appointment : manages
BookingService ..> TherapistService : uses
BookingService ..> PaymentService : uses

MoodAnalyticsService ..> Mood : analyzes
JournalAnalyticsService ..> Journal : analyzes

AIService ..> ChatMessage : generates
AIService ..> Conversation : manages

PaymentService ..> Payment : processes
PaymentService ..> EmailNotificationService : uses

VideoConferenceService ..> VideoSession : manages

EmailNotificationService ..> User : notifies
EmailNotificationService ..> Therapist : notifies

DatabaseConnector ..> User : stores
DatabaseConnector ..> Therapist : stores
DatabaseConnector ..> Appointment : stores
DatabaseConnector ..> Mood : stores
DatabaseConnector ..> Journal : stores
DatabaseConnector ..> ChatMessage : stores
DatabaseConnector ..> Payment : stores

DataValidationService ..> User : validates
DataValidationService ..> Therapist : validates
DataValidationService ..> Appointment : validates

@enduml
```

---

## 12. MERMAID DIAGRAM CODE

Copy this to Mermaid Live Editor (https://mermaid.live/):

```mermaid
classDiagram
    %% User Authentication Module
    class User {
        -ObjectId _id
        -String name
        -String email
        -String password
        -Number age
        -String avatar
        -String role
        -Object profile
        -Object settings
        -Object subscription
        -Number streakCount
        -Date lastCheckIn
        +comparePassword(candidatePassword String) Boolean
        +updateStreak() Promise~User~
        +hashPassword() void
        +validateEmail(email String) Boolean
        +getPublicProfile() Object
        +updateSettings(settings Object) Promise~User~
    }

    class AuthenticationService {
        -String JWT_SECRET
        -String JWT_EXPIRE
        -Number SALT_ROUNDS
        -Number OTP_EXPIRY
        +generateToken(userId ObjectId, role String) String
        +verifyToken(token String) Object
        +hashPassword(password String) Promise~String~
        +authenticateUser(email String, password String) Promise~User~
        +authenticateTherapist(email String, password String) Promise~Therapist~
        +sendOTP(email String) Promise~String~
        +verifyOTP(email String, otp String) Promise~Boolean~
        +resetPassword(email String, newPassword String, otp String) Promise~Boolean~
    }

    class OTP {
        -ObjectId _id
        -String email
        -String otp
        -String purpose
        -Date expiresAt
        -Boolean isUsed
        -Number attempts
        +generateOTP() String
        +verify(code String) Boolean
        +markAsUsed() Promise~OTP~
        +isExpired() Boolean
        +incrementAttempts() Promise~OTP~
    }

    %% Therapist Management Module
    class Therapist {
        -ObjectId _id
        -String name
        -String email
        -String password
        -String profilePicture
        -String about
        -Array~String~ specializations
        -Number experience
        -Number pricePerSession
        -Object currentSession
        -Array~Object~ availableSlots
        -Number rating
        -Number reviewCount
        -Array~Object~ reviews
        +comparePassword(candidatePassword String) Promise~Boolean~
        +initializeDefaultSlots() Promise~void~
        +getAvailableSlots(date String) Array~Object~
        +bookSlot(date String, startTime String, userId ObjectId, appointmentId ObjectId) Promise~Object~
        +cancelSlot(date String, startTime String) Promise~void~
        +addReview(appointmentId ObjectId, userId ObjectId, rating Number, comment String) Promise~Therapist~
        +updatePricing(pricePerSession Number) Promise~Therapist~
        +startSession(appointmentId ObjectId) Promise~Therapist~
    }

    class TherapistService {
        -Number MIN_PRICE
        -Number MAX_PRICE
        -Number DEFAULT_SLOTS_PER_DAY
        -Object EXPERIENCE_PRICE_MAP
        +getAllTherapists() Promise~Array~Therapist~~
        +getTherapistById(therapistId ObjectId) Promise~Therapist~
        +getTherapistsBySpecialization(specialization String) Promise~Array~
        +getAvailableTherapists(date String, time String) Promise~Array~
        +calculateRecommendedPrice(experience Number) Number
        +validateSlotTiming(startTime String, endTime String) Boolean
        +checkSlotConflict(therapistId ObjectId, date String, startTime String) Promise~Boolean~
        +getTherapistStats(therapistId ObjectId) Promise~Object~
    }

    %% Appointment Booking Module
    class Appointment {
        -ObjectId _id
        -ObjectId userId
        -ObjectId therapistId
        -String therapistName
        -Date date
        -String startTime
        -String endTime
        -Number duration
        -String status
        -String meetingLink
        -Object payment
        -Object review
        -String sessionNotes
        +checkConflicts() Promise~Boolean~
        +generateMeetingLink() String
        +canJoinSession() Boolean
        +markAsCompleted() Promise~Appointment~
        +cancel(cancelledBy String, reason String) Promise~Appointment~
        +processPayment(transactionId String) Promise~Appointment~
        +processRefund(reason String) Promise~Appointment~
        +addReview(rating Number, comment String) Promise~Appointment~
    }

    class BookingService {
        -Number PLATFORM_CHARGE_PERCENTAGE
        -Number MIN_BOOKING_ADVANCE
        -Number SESSION_ACCESS_BUFFER
        +createBooking(userId ObjectId, therapistId ObjectId, date Date, startTime String, duration Number, reason String) Promise~Appointment~
        +validateBooking(therapistId ObjectId, date Date, startTime String, duration Number) Promise~Boolean~
        +checkTherapistAvailability(therapistId ObjectId, date String, startTime String) Promise~Boolean~
        +calculateTotalPrice(therapistId ObjectId, duration Number) Promise~Number~
        +processBookingPayment(appointmentId ObjectId, paymentData Object) Promise~Appointment~
        +cancelBooking(appointmentId ObjectId, cancelledBy String, reason String) Promise~Appointment~
        +processRefund(appointmentId ObjectId, reason String) Promise~Object~
    }

    %% Mood Tracking Module
    class Mood {
        -ObjectId _id
        -ObjectId userId
        -String mood
        -Number intensity
        -Array~String~ emotions
        -Array~String~ activities
        -Array~String~ triggers
        -Number energy
        -Object sleep
        -String social
        -Object suggestion
        -Date date
        +getUserStats(userId ObjectId, days Number)$ Promise~Object~
        +getMoodTrends(userId ObjectId, days Number)$ Promise~Array~
        +generateSuggestions() Promise~Object~
        +analyzeMoodPattern(userId ObjectId) Promise~Object~
        +getTriggerAnalysis(userId ObjectId) Promise~Object~
        +getSleepCorrelation(userId ObjectId) Promise~Object~
    }

    class MoodAnalyticsService {
        -Object MOOD_SCORE_MAP
        -Object SUGGESTION_DATABASE
        -Number MIN_ENTRIES_FOR_ANALYSIS
        +getMoodScore(mood String) Number
        +calculateAverageMood(userId ObjectId, days Number) Promise~Number~
        +getMoodDistribution(userId ObjectId, days Number) Promise~Object~
        +identifyMoodPatterns(userId ObjectId) Promise~Object~
        +predictMoodTrend(userId ObjectId) Promise~String~
        +generatePersonalizedSuggestions(mood String, intensity Number, emotions Array, triggers Array) Promise~Object~
        +correlateSleepWithMood(userId ObjectId) Promise~Object~
        +identifyTopTriggers(userId ObjectId, limit Number) Promise~Array~
        +generateWeeklyReport(userId ObjectId) Promise~Object~
    }

    %% Journal Management Module
    class Journal {
        -ObjectId _id
        -ObjectId userId
        -String title
        -String content
        -String mood
        -Array~String~ tags
        -Boolean isPrivate
        -Boolean isFavorite
        -Array~String~ gratitude
        -Array~Object~ goals
        -Object aiInsights
        -Array~Object~ attachments
        +getUserStats(userId ObjectId)$ Promise~Object~
        +analyzeContent() Promise~Object~
        +extractThemes() Promise~Array~String~~
        +detectSentiment() Promise~String~
        +generateInsights() Promise~Object~
        +addTag(tag String) Promise~Journal~
        +toggleFavorite() Promise~Journal~
        +addGoal(goalText String) Promise~Journal~
        +searchContent(query String) Promise~Array~Journal~~
    }

    class JournalAnalyticsService {
        -Number SENTIMENT_THRESHOLD_POSITIVE
        -Number SENTIMENT_THRESHOLD_NEGATIVE
        -Number THEME_EXTRACTION_MIN_FREQUENCY
        +analyzeSentiment(content String) Promise~Object~
        +extractKeywords(content String) Promise~Array~String~~
        +identifyThemes(userId ObjectId) Promise~Array~Object~~
        +calculateWritingStreak(userId ObjectId) Promise~Number~
        +getWritingFrequency(userId ObjectId, period String) Promise~Object~
        +getMoodCorrelation(userId ObjectId) Promise~Object~
        +getTopTags(userId ObjectId, limit Number) Promise~Array~Object~~
        +getGoalCompletionRate(userId ObjectId) Promise~Number~
        +generateMonthlyReport(userId ObjectId, year Number, month Number) Promise~Object~
    }

    %% AI Chat Module
    class ChatMessage {
        -ObjectId _id
        -ObjectId conversationId
        -ObjectId senderId
        -String message
        -String type
        -Boolean isAI
        -Object metadata
        -Array~Object~ attachments
        -Boolean isRead
        +markAsRead() Promise~ChatMessage~
        +editMessage(newContent String) Promise~ChatMessage~
        +detectCrisis() Boolean
        +analyzeSentiment() Promise~String~
        +categorizeMessage() Promise~String~
        +suggestResources() Promise~Array~String~~
        +getConversationHistory(conversationId ObjectId, limit Number)$ Promise~Array~
    }

    class Conversation {
        -ObjectId _id
        -ObjectId userId
        -String title
        -String category
        -Boolean isActive
        -Date lastMessageAt
        -Number messageCount
        -Boolean crisisDetected
        +addMessage(messageId ObjectId) Promise~Conversation~
        +updateLastMessage(timestamp Date) Promise~Conversation~
        +markAllAsRead() Promise~Conversation~
        +analyzeSentiment() Promise~String~
        +detectCrisis() Promise~Boolean~
    }

    class AIService {
        -String OPENAI_API_KEY
        -String MODEL
        -Number MAX_TOKENS
        -Array~String~ CRISIS_KEYWORDS
        -Object RESOURCE_DATABASE
        +generateResponse(message String, conversationHistory Array) Promise~String~
        +analyzeMessage(message String) Promise~Object~
        +detectCrisis(message String) Boolean
        +suggestResources(category String, sentiment String) Array~String~
        +maintainContext(conversationId ObjectId, maxMessages Number) Promise~Array~
        +handleCrisisResponse(message String) Promise~Object~
        +provideEmotionalSupport(sentiment String, emotions Array) Promise~String~
        +suggestCopingStrategies(mood String, triggers Array) Promise~Array~String~~
    }

    %% Payment Processing Module
    class Payment {
        -ObjectId _id
        -ObjectId appointmentId
        -ObjectId userId
        -ObjectId therapistId
        -Number amount
        -String currency
        -Number platformCharge
        -Number therapistPayout
        -String status
        -String transactionId
        -Object refund
        +calculatePlatformCharge(amount Number) Number
        +calculateTherapistPayout(amount Number) Number
        +processFakePayment() Promise~Payment~
        +processRefund(reason String) Promise~Payment~
        +generateTransactionId() String
        +markAsCompleted(transactionId String) Promise~Payment~
        +calculateRefundAmount(totalAmount Number) Number
    }

    class PaymentService {
        -Number PLATFORM_CHARGE_PERCENTAGE
        -Number MIN_AMOUNT
        -Number MAX_AMOUNT
        +createPayment(appointmentId ObjectId, amount Number) Promise~Payment~
        +processFakePayment(paymentId ObjectId) Promise~Payment~
        +validatePaymentAmount(amount Number, therapistId ObjectId, duration Number) Boolean
        +calculateTotalAmount(therapistId ObjectId, duration Number) Promise~Number~
        +initiateRefund(appointmentId ObjectId, reason String) Promise~Payment~
        +processRefund(paymentId ObjectId) Promise~Payment~
        +calculatePlatformEarnings(startDate Date, endDate Date) Promise~Number~
        +generateInvoice(paymentId ObjectId) Promise~String~
        +sendPaymentConfirmation(paymentId ObjectId) Promise~void~
    }

    %% Video Conference Module
    class VideoSession {
        -ObjectId _id
        -ObjectId appointmentId
        -String meetingRoomId
        -String meetingLink
        -ObjectId hostId
        -ObjectId participantId
        -String hostDisplayName
        -String participantDisplayName
        -Date startTime
        -Date endTime
        -Number actualDuration
        -String status
        -Object accessWindow
        +generateMeetingLink(appointmentId ObjectId) String
        +validateAccessTime() Boolean
        +canUserJoin(userId ObjectId) Boolean
        +startSession() Promise~VideoSession~
        +endSession() Promise~VideoSession~
        +addParticipant(userId ObjectId) Promise~VideoSession~
        +generateAnonymousNames() Object
        +autoEndSession() Promise~VideoSession~
    }

    class VideoConferenceService {
        -String JITSI_DOMAIN
        -Number SESSION_ACCESS_BUFFER
        -Number AUTO_END_DELAY
        +createVideoSession(appointmentId ObjectId) Promise~VideoSession~
        +generateJitsiConfig(sessionId ObjectId) Object
        +validateSessionAccess(userId ObjectId, sessionId ObjectId) Promise~Boolean~
        +enforceTimeRestrictions(sessionId ObjectId) Promise~Boolean~
        +autoEndExpiredSessions() Promise~void~
        +generateAnonymousDisplayNames(userId ObjectId, therapistId ObjectId) Promise~Object~
        +getSessionStatistics(therapistId ObjectId) Promise~Object~
    }

    %% Email Notification Module
    class EmailNotificationService {
        -String SMTP_HOST
        -Number SMTP_PORT
        -String FROM_EMAIL
        -String FROM_NAME
        +sendBookingConfirmation(appointment Appointment, user User, therapist Therapist) Promise~void~
        +sendTherapistBookingNotification(appointment Appointment, therapist Therapist) Promise~void~
        +sendSessionReminder(appointment Appointment, user User) Promise~void~
        +sendCancellationEmail(appointment Appointment, user User, reason String) Promise~void~
        +sendRefundConfirmation(payment Payment, user User) Promise~void~
        +sendOTPEmail(email String, otp String, purpose String) Promise~void~
        +sendWelcomeEmail(user User) Promise~void~
        +sendReviewRequest(appointment Appointment, user User) Promise~void~
        +sendCrisisAlert(user User, message String) Promise~void~
    }

    %% Database Service Module
    class DatabaseConnector {
        -String MONGODB_URI
        -String DB_NAME
        -Object connection
        -Boolean isConnected
        -Number maxRetries
        +connect() Promise~Boolean~
        +disconnect() Promise~void~
        +isConnectionAlive() Boolean
        +reconnect() Promise~Boolean~
        +createIndexes() Promise~void~
        +getInstance()$ DatabaseConnector
    }

    class DataValidationService {
        -RegExp EMAIL_REGEX
        -RegExp PASSWORD_REGEX
        -RegExp PHONE_REGEX
        +validateEmail(email String) Boolean
        +validatePassword(password String) Object
        +validatePhone(phone String) Boolean
        +validateAge(age Number) Boolean
        +validateObjectId(id String) Boolean
        +sanitizeInput(input String) String
        +validatePriceRange(price Number) Boolean
        +validateSessionDuration(duration Number) Boolean
        +validateMoodIntensity(intensity Number) Boolean
        +escapeHTML(html String) String
    }

    %% Relationships
    User "1" --> "0..*" Appointment : books
    User "1" --> "0..*" Mood : tracks
    User "1" --> "0..*" Journal : writes
    User "1" --> "0..*" ChatMessage : sends
    User "1" --> "0..*" Conversation : has

    Therapist "1" --> "0..*" Appointment : conducts
    Therapist "1" --> "0..*" Payment : receives

    Appointment "1" --> "1" Payment : has
    Appointment "1" --> "1" VideoSession : has
    Appointment "*" --> "1" User : belongs to
    Appointment "*" --> "1" Therapist : with

    Conversation "1" --> "0..*" ChatMessage : contains

    AuthenticationService ..> User : authenticates
    AuthenticationService ..> Therapist : authenticates
    AuthenticationService ..> OTP : manages

    TherapistService ..> Therapist : manages
    BookingService ..> Appointment : manages
    MoodAnalyticsService ..> Mood : analyzes
    JournalAnalyticsService ..> Journal : analyzes
    AIService ..> ChatMessage : generates
    AIService ..> Conversation : manages
    PaymentService ..> Payment : processes
    VideoConferenceService ..> VideoSession : manages

    EmailNotificationService ..> User : notifies
    EmailNotificationService ..> Therapist : notifies

    DatabaseConnector ..> User : stores
    DatabaseConnector ..> Therapist : stores
    DatabaseConnector ..> Appointment : stores

    DataValidationService ..> User : validates
    DataValidationService ..> Appointment : validates
```

---

## INSTRUCTIONS FOR GENERATING DIAGRAMS

### For PlantUML:
1. Go to http://www.plantuml.com/plantuml/
2. Copy the entire PlantUML code from Section 11
3. Paste into the editor
4. Click "Submit" to generate diagram
5. Download as PNG/SVG

### For Mermaid:
1. Go to https://mermaid.live/
2. Copy the entire Mermaid code from Section 12
3. Paste into the editor
4. Diagram auto-generates
5. Download as PNG/SVG

### For ChatGPT/AI Tools:
Copy this prompt with the PlantUML or Mermaid code:

```
Generate a UML class diagram image from the following PlantUML/Mermaid code for a mental wellness application called ZEN-MIND. The diagram should show:
- 10 main modules (User, Therapist, Appointment, Mood, Journal, Chat, Payment, Video, Email, Database)
- All class attributes with data types
- All methods with parameters and return types
- Relationships between classes (one-to-many, many-to-one, dependencies)
- Color-coded boxes for different modules
- Functionality descriptions for each class

[Paste PlantUML or Mermaid code here]
```

---

**END OF CLASS DIAGRAMS COMPLETE SPECIFICATION**

This document contains comprehensive class diagrams for ALL sections of ZEN-MIND with:
✅ All attributes with data types
✅ All methods with parameters and return types
✅ Detailed functionality descriptions
✅ PlantUML code for diagram generation
✅ Mermaid code for diagram generation
✅ Instructions for generating visual diagrams

You can now feed this to ChatGPT, PlantUML, or Mermaid to generate professional UML class diagrams!
