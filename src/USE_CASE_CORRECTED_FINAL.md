# ZEN-MIND USE CASE DIAGRAM - CORRECTED & VERIFIED
## Complete Use Case Analysis (100% Accurate from Actual Implementation)

---

## ACTORS

### 1. **Unregistered User** 
A person who has not yet created an account in the system.

### 2. **User (Teen)** 
A registered teenager (13-19 years) using the mental wellness platform.

### 3. **Therapist** 
A licensed mental health professional providing counseling services.

---

## USE CASES BY ACTOR

### UNREGISTERED USER CAN:

1. **View Landing Page** - Browse platform information and features
2. **Register** - Create new account with name, email, password, age (13-19)
3. **Login to User Account** - Access user account with credentials

---

### USER (TEEN) CAN:

#### Authentication & Profile
4. **Login** - Authenticate with email and password
5. **Update Profile** - Modify name, email, phone, gender in Settings
6. **Change Password** - Update account password from Settings
7. **Logout** - End current session

#### Mental Wellness Features
8. **Track Mood** - Log daily mood with intensity (1-10), emotions, and notes
9. **View Mood History** - See past mood entries with statistics
10. **Delete Mood Entry** - Remove mood records
11. **Create Journal Entry** - Write journal with title, content, mood, tags
12. **Edit Journal Entry** - Modify existing journal entries
13. **Toggle Favorite Journal** - Mark/unmark important entries
14. **Search Journals** - Find entries by text content
15. **Delete Journal Entry** - Remove journal records
16. **View Journal Stats** - See total entries and top tags

#### Productivity Tools
17. **Create Todo** - Add task with category (personal/study/health/other) and priority
18. **Toggle Todo Complete** - Mark tasks as done/undone
19. **Update Todo** - Edit task details
20. **Delete Todo** - Remove tasks
21. **View Todo Stats** - See completion statistics
22. **Create Study Plan** - Add study session with subject, topic, duration, notes
23. **Toggle Study Complete** - Mark study sessions as completed
24. **Update Study Plan** - Modify study session details
25. **Delete Study Plan** - Remove study sessions
26. **View Study Stats** - See total study time
27. **View Calendar** - See journals, todos, and study plans in calendar view

#### AI & Resources
28. **Chat with AI** - Converse with Botpress AI chatbot for mental health support
29. **Browse Resources** - View motivational videos, calming music, mini-games
30. **Play Mini Games** - Access Tic-Tac-Toe, Memory Match, Breathing Exercise
31. **Watch Videos** - View embedded YouTube mental wellness content
32. **Listen to Music** - Access Spotify/YouTube calming playlists

#### Therapist Services
33. **Browse Therapists** - View list of available therapists
34. **Search Therapists** - Find therapists by name or specialization
35. **Sort Therapists** - Sort by rating, experience, or cost
36. **View Therapist Profile** - See details: about, education, experience, pricing, reviews
37. **Check Therapist Status** - See real-time busy/available status
38. **Select Session Duration** - Choose 30/45/60 minute session (Duration selector exists but all sessions are 30 min)
39. **Make Payment** - Complete fake payment via UPI or Credit Card
40. **Book Instant Session** - Create appointment after payment
41. **View Appointments** - See upcoming and past appointments
42. **Join Video Session** - Enter Jitsi meeting after 5-minute wait
43. **Cancel Appointment** - Cancel scheduled sessions
44. **Submit Review** - Rate therapist and leave comment after session
45. **View Session History** - See completed appointments

---

### THERAPIST CAN:

#### Authentication & Profile
46. **Login to Therapist Portal** - Authenticate with therapist credentials
47. **Update Profile** - Modify name, email, photo, about, education, experience, languages, specializations
48. **Upload Profile Picture** - Upload image file for profile
49. **Change Password** - Update account password with current password verification
50. **Reset Password via OTP** - Request OTP, verify, and reset password if forgotten
51. **Logout** - End current session

#### Session Management
52. **View Today's Appointments** - See all scheduled sessions for current day
53. **View Session Details** - See appointment time, duration, countdown timer
54. **Join Video Session** - Enter Jitsi meeting after 5-minute wait from booking time
55. **Monitor Active Session** - Track session duration in real-time with countdown
56. **End Video Session** - Complete and exit session

#### Settings & Pricing
57. **Update Pricing** - Set price per session (₹100-5000)
58. **View Current Pricing** - See active session pricing

---

## SYSTEM USE CASES (Automated)

59. **Generate Meeting Link** - System creates Jitsi link when appointment is booked
60. **Enforce 5-Minute Wait** - System prevents joining before 5 min from booking (both user and therapist)
61. **Update Session Status** - System marks appointments as scheduled/completed
62. **Calculate Statistics** - System generates mood, journal, todo, study stats
63. **Generate AI Suggestions** - System provides activity/book/song recommendations after mood log
64. **Verify Payment** - System processes fake payment and creates appointment
65. **Auto-End Session** - System automatically marks session complete after duration expires
66. **Update Therapist Busy Status** - System marks therapist as busy during active sessions
67. **Send OTP Email** - System sends OTP for therapist password reset

---

## KEY RELATIONSHIPS

### Include Relationships:
- **Register** includes **Login** (auto-login after registration)
- **Book Instant Session** includes **Make Payment** (payment required)
- **Book Instant Session** includes **Generate Meeting Link** (system creates link)
- **Join Video Session** includes **Enforce 5-Minute Wait** (system enforces wait)
- **Reset Password via OTP** includes **Send OTP Email** (system sends OTP)

### Extend Relationships:
- **Submit Review** extends from **View Appointments** (after completed session)
- **Update Therapist Busy Status** extends from **Join Video Session** (automatic)

---

## REMOVED/NOT IMPLEMENTED

The following use cases were in earlier documentation but are **NOT actually implemented**:

❌ **Add Time Slots** - Therapist cannot add slots (no UI, only backend API exists)
❌ **Delete Time Slots** - Therapist cannot delete slots (no UI, only backend API exists)
❌ **View Slot Status** - Therapist cannot view slot booking status (no UI for this)
❌ **View Reviews** - Therapist cannot view user reviews (no UI implementation)
❌ **Check Therapist Availability** - Users don't see slot-based availability (instant booking only)

---

## SYSTEM BOUNDARIES

**Inside ZEN-MIND System:**
- User authentication (register, login, password change)
- Therapist authentication (login, OTP reset)
- Mood tracking with intensity and emotions
- Journaling with tags, favorites, search
- Todo management with categories and priorities
- Study plan management
- Calendar view integration
- Profile management (user and therapist)
- Appointment booking (instant booking only)
- Payment processing (fake UPI/Credit Card)
- Session countdown timers
- Review and rating system

**External Systems:**
- **Botpress Cloud** - AI chatbot service (via webhook)
- **Jitsi** - Video conferencing platform
- **YouTube** - Embedded video content
- **Spotify** - Music streaming links
- **MongoDB Atlas** - Database backend
- **Email Service** - OTP delivery for password reset

---

## TOTAL USE CASES: 58

- Unregistered User: 3 use cases
- User (Teen): 42 use cases
- Therapist: 13 use cases
- System (Automated): 9 use cases

---

## VERIFICATION SOURCES

### Frontend Components Verified:
✅ `/components/UserSignup.tsx` - Registration with age validation
✅ `/components/UserLogin.tsx` - User authentication
✅ `/components/MoodTracker.tsx` - Mood tracking UI
✅ `/components/Journal.tsx` - Journal, Todos, Study plans, Calendar
✅ `/components/AIChat.tsx` - Botpress chatbot integration
✅ `/components/Resources.tsx` - Videos, music, mini-games
✅ `/components/TherapistDashboardNew.tsx` - Browse/search/sort therapists
✅ `/components/BookingModalNew.tsx` - Instant booking flow
✅ `/components/FakePaymentModal.tsx` - Payment UI (UPI/CC)
✅ `/components/AppointmentsNew.tsx` - View/cancel appointments
✅ `/components/JitsiVideoCall.tsx` - Video sessions with countdown
✅ `/components/SessionManager.tsx` - 5-minute wait enforcement
✅ `/components/Settings.tsx` - User settings and profile
✅ `/components/TherapistLogin.tsx` - Therapist authentication
✅ `/components/TherapistPortal.tsx` - Therapist dashboard (Sessions/Profile/Settings tabs)

### Backend Routes Verified:
✅ `/server/routes/auth.js` - User register, login
✅ `/server/routes/user.js` - User profile, password
✅ `/server/routes/mood.js` - CRUD mood entries, stats
✅ `/server/routes/journal.js` - CRUD journals, search, favorites, stats
✅ `/server/routes/todo.js` - CRUD todos, toggle complete, stats
✅ `/server/routes/studyPlan.js` - CRUD study plans, toggle complete, stats
✅ `/server/routes/therapist.js` - Get therapists, search, get by ID
✅ `/server/routes/therapistAuth.js` - Therapist login, OTP reset
✅ `/server/routes/therapistManagement.js` - Therapist profile, pricing, password, appointments
✅ `/server/routes/booking.js` - Instant booking, therapist status
✅ `/server/routes/appointment.js` - Get appointments, cancel, add review
✅ `/server/routes/reviews.js` - Submit reviews

---

**Last Verified:** November 28, 2024  
**Verification Method:** Manual code inspection of all frontend components and backend API routes  
**Status:** ✅ 100% Accurate - Reflects actual implementation only
