# ZEN-MIND USE CASE DIAGRAM
## Complete Use Case Analysis (Frontend + Backend Verified)

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

1. **Register** - Create new account with name, email, password, age (13-19)
2. **Login** - Access existing account with credentials
3. **View Landing Page** - Browse platform information and features

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
35. **View Therapist Profile** - See details: about, education, experience, pricing, reviews
36. **Check Therapist Availability** - See real-time session status
37. **Select Session Duration** - Choose 30/45/60 minute session
38. **Make Payment** - Complete fake payment via UPI or Credit Card
39. **Book Instant Session** - Create appointment after payment
40. **View Appointments** - See upcoming and past appointments
41. **Join Video Session** - Enter Jitsi meeting after 5-minute wait
42. **Cancel Appointment** - Cancel scheduled sessions
43. **Submit Review** - Rate therapist and leave comment after session
44. **View Session History** - See completed appointments

---

### THERAPIST CAN:

#### Authentication & Profile
45. **Login** - Authenticate with therapist credentials
46. **Update Profile** - Modify name, email, photo, about, education, experience, languages, specializations
47. **Change Password** - Update account password
48. **Logout** - End current session

#### Appointment Management
49. **View Appointments** - See scheduled and completed sessions
50. **View Session Details** - See user info, duration, status
51. **Join Video Session** - Enter Jitsi meeting to conduct session
52. **Monitor Active Session** - Track session duration in real-time

#### Availability & Pricing
53. **Set Pricing** - Update price per session (₹500-1000)
54. **Add Time Slots** - Create availability slots for specific dates/times
55. **Delete Time Slots** - Remove unboooked availability slots
56. **View Slot Status** - See which slots are booked/available

#### Reviews
57. **View Reviews** - See ratings and comments from users

---

## SYSTEM USE CASES

These are automated system processes:

58. **Generate Meeting Link** - System creates Jitsi link when appointment is booked
59. **Enforce 5-Minute Wait** - System prevents joining session before wait period
60. **Update Session Status** - System marks appointments as scheduled/completed
61. **Calculate Statistics** - System generates mood, journal, todo, study stats
62. **Generate AI Suggestions** - System provides activity/book/song recommendations after mood log
63. **Verify Payment** - System processes fake payment and creates appointment
64. **Update Therapist Availability** - System marks slots as booked when appointment created
65. **Release Slot on Cancellation** - System frees slot when appointment cancelled

---

## RELATIONSHIPS & INCLUDES

### Register → Login
- After registration, user must login

### Book Instant Session → Make Payment
- Payment is required before booking

### Make Payment → Generate Meeting Link
- System creates Jitsi link after successful payment

### Book Instant Session → Update Therapist Availability
- System marks therapist slot as booked

### Cancel Appointment → Release Slot
- System frees therapist's time slot

### Join Video Session → Enforce 5-Minute Wait
- System checks if wait period has passed

### Submit Review → View Reviews (Therapist)
- User reviews appear in therapist's review list

---

## SYSTEM BOUNDARIES

**Inside ZEN-MIND System:**
- User authentication
- Mood tracking
- Journaling
- Todo/Study management
- Appointment booking
- Payment processing (fake)
- Profile management

**External Systems:**
- **Botpress Cloud** - AI chatbot service
- **Jitsi** - Video conferencing
- **YouTube** - Embedded videos
- **Spotify** - Music streaming links
- **MongoDB Atlas** - Database backend

---

## USE CASE DIAGRAM DESCRIPTION

This diagram illustrates the ZEN-MIND mental wellness platform for teenagers. The system has three main actors:

**Unregistered Users** can register or login to access the platform.

**Users (Teens)** have extensive capabilities once logged in. They can manage their mental wellness through mood tracking with intensity scales and emotion selection, journaling with tags and favorites, and productivity tools including todos with categories/priorities and study plans. They can chat with an AI companion (Botpress) for 24/7 support, browse mental wellness resources (videos, music, games), and access therapeutic services. For therapy, users browse therapist profiles, check real-time availability, select session duration, complete payment, book instant sessions, and join video calls via Jitsi after a 5-minute wait. After sessions, they submit ratings and reviews. Users also manage their profile settings and passwords.

**Therapists** have a separate portal where they login, manage their professional profile (education, specializations, experience, languages, pricing), set availability by adding/deleting time slots, view scheduled appointments, conduct video sessions, and view ratings/reviews from users.

The system automates several processes: generating Jitsi meeting links upon booking, enforcing 5-minute wait periods before sessions, calculating statistics for mood/journal/study data, providing AI-driven suggestions after mood logs, processing payments, managing slot availability, and releasing slots upon cancellations.

The platform creates a comprehensive ecosystem where teens access mental health support through AI, self-tracking tools, educational resources, and professional therapy, while therapists manage their practice and deliver services efficiently.

---

## FRONTEND FILES VERIFIED

✅ `/components/UserSignup.tsx` - Registration
✅ `/components/UserLogin.tsx` - User login
✅ `/components/MoodTracker.tsx` - Mood tracking
✅ `/components/Journal.tsx` - Journal, Todos, Study plans
✅ `/components/AIChat.tsx` - Botpress chatbot
✅ `/components/Resources.tsx` - Videos, music, games
✅ `/components/TherapistDashboardNew.tsx` - Browse/search therapists
✅ `/components/BookingModalNew.tsx` - Instant booking
✅ `/components/FakePaymentModal.tsx` - Payment processing
✅ `/components/AppointmentsNew.tsx` - View appointments
✅ `/components/JitsiVideoCall.tsx` - Video sessions
✅ `/components/Settings.tsx` - User settings
✅ `/components/TherapistLogin.tsx` - Therapist login
✅ `/components/TherapistPortal.tsx` - Therapist dashboard

---

## BACKEND ROUTES VERIFIED

✅ User routes: register, login, profile update, password change
✅ Mood routes: create, getAll, getStats, update, delete
✅ Journal routes: create, getAll, search, toggleFavorite, update, delete
✅ Todo routes: create, getAll, toggleComplete, update, delete
✅ StudyPlan routes: create, getAll, toggleComplete, update, delete
✅ Therapist routes: getAll, getById, search, profile update, slots management
✅ Appointment routes: instantBook, getAll, cancel, addReview
✅ Booking routes: therapist-status, instant-book

---

**Last Verified:** November 28, 2024
**Status:** 100% Accurate from Frontend + Backend Code
