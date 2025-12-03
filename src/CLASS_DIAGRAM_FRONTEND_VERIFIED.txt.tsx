================================================================================
CLASS 1: USER
================================================================================

ATTRIBUTES:
-name: String
-email: String
-password: String
-age: Number
-profile.phone: String
-profile.gender: String
-createdAt: Date
-updatedAt: Date

METHODS:
+register(name, email, password, age): User - Creates new user account with validation
+login(email, password): Token - Authenticates user and returns JWT token
+comparePassword(candidatePassword): Boolean - Validates password during login
+updateProfile(name, email, phone, gender): User - Updates user profile from Settings page
+changePassword(currentPassword, newPassword): User - Changes user password from Settings

FUNCTIONALITY:
Manages user registration with age validation (13-19 years). Handles login authentication with JWT tokens. Stores basic profile info (name, email, phone, gender). Allows profile updates and password changes from Settings page.

================================================================================
CLASS 2: MOOD
================================================================================

ATTRIBUTES:
-userId: ObjectId
-mood: String
-intensity: Number
-emotions: Array<String>
-notes: String
-date: Date
-createdAt: Date

METHODS:
+create(mood, intensity, emotions, notes): Mood - Logs new mood entry
+getAll(userId): Array<Mood> - Retrieves all mood entries for user
+getStats(userId, days): Object - Calculates mood statistics and averages
+update(moodId, userId, data): Mood - Updates existing mood entry
+delete(moodId, userId): void - Deletes mood entry from history

FUNCTIONALITY:
Tracks daily mood with 1-10 intensity scale slider. User selects emotions from predefined list (Happy, Sad, Anxious, Angry, Calm, Stressed, Excited, Lonely, Confused, Energetic). Optional notes field for additional context. Generates AI suggestion popup after saving mood (activity, book, song recommendations). Displays mood history with statistics.

================================================================================
CLASS 3: JOURNAL
================================================================================

ATTRIBUTES:
-userId: ObjectId
-title: String
-content: String
-mood: String
-tags: Array<String>
-isFavorite: Boolean
-createdAt: Date
-updatedAt: Date

METHODS:
+create(title, content, mood, tags): Journal - Creates new journal entry
+getAll(userId): Array<Journal> - Retrieves all journal entries for user
+getStats(userId): Object - Returns journal statistics and top tags
+search(userId, query): Array<Journal> - Searches journals by text content
+toggleFavorite(journalId, userId): Journal - Marks/unmarks entry as favorite
+update(journalId, userId, data): Journal - Updates journal entry
+delete(journalId, userId): void - Deletes journal entry

FUNCTIONALITY:
Manages personal journal entries with title and content. Supports mood selection and custom tags for organization. Toggle favorite feature for important entries. Displays journal prompts for writing inspiration. Shows entries in calendar view. Search functionality to find specific entries. Statistics show total entries and most used tags.

================================================================================
CLASS 4: TODO
================================================================================

ATTRIBUTES:
-userId: ObjectId
-text: String
-completed: Boolean
-category: String
-priority: String
-createdAt: Date
-updatedAt: Date

METHODS:
+create(text, category, priority): Todo - Creates new todo item
+getAll(userId, completed, category): Array<Todo> - Retrieves filtered todos
+getStats(userId): Object - Returns completion statistics
+update(todoId, userId, data): Todo - Updates todo details
+toggleComplete(todoId, userId): Todo - Marks todo as complete/incomplete
+delete(todoId, userId): void - Deletes todo from list

FUNCTIONALITY:
Manages todo list with task text, category (personal, study, health, other), and priority (low, medium, high). Toggle completion checkbox for each task. Filter todos by category and completion status. Shows completion statistics. Integrates with calendar view alongside journals and study plans.

================================================================================
CLASS 5: STUDYPLAN
================================================================================

ATTRIBUTES:
-userId: ObjectId
-subject: String
-topic: String
-duration: Number
-notes: String
-completed: Boolean
-createdAt: Date
-updatedAt: Date

METHODS:
+create(subject, topic, duration, notes): StudyPlan - Creates new study plan
+getAll(userId, completed): Array<StudyPlan> - Retrieves filtered study plans
+getStats(userId): Object - Returns total study time statistics
+update(planId, userId, data): StudyPlan - Updates study plan details
+toggleComplete(planId, userId): StudyPlan - Marks plan as complete/incomplete
+delete(planId, userId): void - Deletes study plan

FUNCTIONALITY:
Manages study sessions with subject name, topic, duration (in minutes), and optional notes. Duration selector allows choosing study time. Toggle completion status for each session. Shows total study time statistics. Displays in calendar view with other activities. Helps students organize study schedule.

================================================================================
CLASS 6: THERAPIST
================================================================================

ATTRIBUTES:
-_id: ObjectId
-name: String
-email: String
-profilePicture: String
-about: String
-specializations: Array<String>
-education: String
-experience: Number
-languages: Array<String>
-pricing.perSession: Number
-rating: Number
-reviewCount: Number
-reviews: Array<Object>
-currentSession.isActive: Boolean
-currentSession.sessionEndTime: Date

METHODS:
+getAll(isActive): Array<Therapist> - Gets all active therapists for listing
+getFeatured(): Array<Therapist> - Gets top-rated therapists sorted by rating
+getById(therapistId): Therapist - Gets single therapist profile with reviews
+checkStatus(therapistId): Object - Checks if therapist is available or in session
+search(query): Array<Therapist> - Searches therapists by name or specialization

FUNCTIONALITY:
Displays therapist profiles with name, photo, about, specializations (Anxiety, Depression, Stress Management, Teen Counseling, etc.), education, experience, languages, and pricing (₹500-1000 per session). Shows rating and review count. Real-time availability check using currentSession status. Users browse therapists, view profiles, read reviews, and book instant sessions. Featured section shows top-rated therapists.

================================================================================
CLASS 7: APPOINTMENT
================================================================================

ATTRIBUTES:
-_id: ObjectId
-userId: ObjectId
-therapistId: ObjectId
-therapistName: String
-date: Date
-startTime: String
-duration: Number
-status: String
-meetingLink: String
-payment.amount: Number
-payment.status: String
-payment.transactionId: String
-payment.method: String
-review.rating: Number
-review.comment: String
-createdAt: Date
-updatedAt: Date

METHODS:
+instantBook(therapistId, duration): Appointment - Books instant appointment after payment
+getAll(userId, status): Array<Appointment> - Gets filtered appointments
+getUpcoming(userId): Array<Appointment> - Gets upcoming scheduled appointments
+getById(appointmentId, userId): Appointment - Gets single appointment details
+cancel(appointmentId, userId, reason): Appointment - Cancels appointment
+markComplete(appointmentId): Appointment - Marks appointment as completed
+addReview(appointmentId, rating, comment): Appointment - Adds post-session review

FUNCTIONALITY:
Manages appointment lifecycle. User selects therapist and duration (30/45/60 minutes). Fake payment modal processes payment via UPI or Credit Card. After successful payment, creates appointment with "scheduled" status and generates Jitsi meeting link. 5-minute wait enforced before user can join session. Session starts when user clicks "Join Now". After session ends, user submits rating and review. Shows upcoming and past appointments separately. Cancel feature available for scheduled appointments.

================================================================================
CLASS 8: CHAT (BOTPRESS INTEGRATION)
================================================================================

ATTRIBUTES:
-BOTPRESS_WEBCHAT_URL: String
-BOTPRESS_CONFIG_URL: String
-userId: String
-userEmail: String
-conversationHistory: Array

METHODS:
+initializeChat(userId, userEmail): void - Initializes Botpress chat iframe
+sendMessage(message): void - Sends user message to Botpress chatbot
+receiveResponse(): void - Receives AI response from Botpress
+clearUserData(): void - Clears chat history when user logs out

FUNCTIONALITY:
Integrates Botpress AI chatbot via embedded iframe. User-specific conversations identified by base64-encoded email. Chatbot provides 24/7 mental health support, coping strategies, emotional guidance, and platform help. Chat interface embedded as full-screen iframe. Conversation history maintained by Botpress cloud platform. No backend MongoDB storage - entirely frontend integration. Auto-clears previous user data on login for privacy.

================================================================================
CLASS 9: RESOURCES
================================================================================

ATTRIBUTES:
-id: String
-title: String
-description: String
-youtubeId: String
-spotifyUrl: String
-category: String
-duration: String
-mood: String
-thumbnail: String

METHODS:
+getVideos(): Array<Resource> - Retrieves hardcoded video resources
+getMusic(): Array<Resource> - Retrieves hardcoded music resources
+getGames(): void - Launches mini-games component
+filterByCategory(category): Array<Resource> - Filters resources by category

FUNCTIONALITY:
Displays mental wellness resources in three tabs: Videos (motivational videos, meditation guides, anxiety management), Music (calming playlists, nature sounds, focus music), and Games (Tic-Tac-Toe, Memory Match, Breathing Exercise). Videos embedded from YouTube. Music links to Spotify and YouTube. Games are interactive browser-based activities. All resources are hardcoded in frontend - no backend API. Resources categorized by mood/purpose (relaxation, motivation, meditation, stress-relief).

================================================================================

RELATIONSHIPS:

User (1) ───────► Mood (many)
User (1) ───────► Journal (many)
User (1) ───────► Todo (many)
User (1) ───────► StudyPlan (many)
User (1) ───────► Appointment (many)

Therapist (1) ───────► Appointment (many)

Appointment (1) ───────► User (1)
Appointment (1) ───────► Therapist (1)

Chat ───────► Botpress Cloud (external service)

Resources ───────► Frontend Only (hardcoded data)

================================================================================

NOTES:
✅ ALL attributes verified from actual frontend form submissions
✅ ALL methods verified from actual API calls in frontend components
❌ Removed unused attributes like sleep, energy, social from Mood
❌ Removed unused attributes like gratitude, goals, aiInsights from Journal
❌ Removed unused attributes like dueDate, completedAt from Todo
❌ Removed unused attributes like date from StudyPlan (uses createdAt)
❌ Removed complex nested structures not used in UI
✅ Botpress is frontend-only integration (no backend ChatMessage model)
✅ Resources are hardcoded in frontend (no backend Resource model)

================================================================================
