# USER CLASS - FRONTEND VERIFIED

## Complete Class Diagram for User Entity

---

## ATTRIBUTES

| Attribute | Type | Description |
|-----------|------|-------------|
| `name` | String | User's full name |
| `email` | String | User's email address (unique) |
| `password` | String | Hashed password |
| `age` | Number | User's age (13-19 validation) |
| `profile.phone` | String | User's phone number (optional) |
| `profile.gender` | String | User's gender (optional) |
| `createdAt` | Date | Account creation timestamp |
| `updatedAt` | Date | Last profile update timestamp |

---

## METHODS

### 1. register(name, email, password, age): User
**Description:** Creates new user account with validation

**Frontend Location:** `/components/UserSignup.tsx` (Line 76)

**Frontend Code:**
```javascript
await register(formData.name, formData.email, formData.password, parseInt(formData.age));
```

**What Gets Sent:**
- `name` - Full name (min 2 characters)
- `email` - Valid email format
- `password` - Min 8 chars with uppercase, lowercase, number, special char
- `age` - Integer between 13-19

---

### 2. login(email, password): Token
**Description:** Authenticates user and returns JWT token

**Frontend Location:** `/components/UserLogin.tsx`

**Frontend Code:**
```javascript
await login(formData.email, formData.password);
```

**What Gets Sent:**
- `email` - User's email
- `password` - User's password

**Returns:** JWT token stored in localStorage

---

### 3. comparePassword(candidatePassword): Boolean
**Description:** Validates password during login

**Backend Method:** Called internally during login process

**Purpose:** Compares hashed password with user input

---

### 4. updateProfile(name, email, phone, gender): User
**Description:** Updates user profile from Settings page

**Frontend Location:** `/components/Settings.tsx` (Lines 103-110)

**Frontend Code:**
```javascript
await updateUser({
  name: tempProfile.name,
  email: tempProfile.email,
  profile: {
    phone: tempProfile.phone,
    gender: tempProfile.gender,
  }
});
```

**What Gets Sent:**
- `name` - Updated name
- `email` - Updated email
- `profile.phone` - Updated phone (10 digits, starts with 6/7/8/9)
- `profile.gender` - Updated gender

---

### 5. changePassword(currentPassword, newPassword): User
**Description:** Changes user password from Settings page

**Frontend Location:** `/components/Settings.tsx` (Lines 137-140)

**Frontend Code:**
```javascript
await userAPI.changePassword({
  currentPassword: passwordData.currentPassword,
  newPassword: passwordData.newPassword,
});
```

**What Gets Sent:**
- `currentPassword` - Current password for verification
- `newPassword` - New password (min 6 characters)

---

## FUNCTIONALITY

The User class manages the complete user lifecycle in ZEN-MIND:

1. **Registration Flow:**
   - User fills signup form with name, email, password, age
   - Age validation: Must be 13-19 years (teen-focused app)
   - Password validation: Min 8 chars, uppercase, lowercase, number, special char
   - Account created with JWT token authentication

2. **Login Flow:**
   - User enters email and password
   - Password compared with hashed version in database
   - JWT token generated and stored in localStorage
   - User redirected to dashboard

3. **Profile Management:**
   - User accesses Settings page
   - Can update: name, email, phone, gender
   - Phone validation: 10 digits, starts with 6/7/8/9 (Indian format)
   - Profile updated in real-time

4. **Password Management:**
   - User can change password from Settings
   - Must provide current password for verification
   - New password must be minimum 6 characters
   - Password hashed before storage

---

## RELATIONSHIPS

```
User (1) ───────► Mood (many)
User (1) ───────► Journal (many)
User (1) ───────► Todo (many)
User (1) ───────► StudyPlan (many)
User (1) ───────► Appointment (many)
```

---

## VALIDATION RULES (Frontend Verified)

### Registration:
- ✅ Name: Min 2 characters
- ✅ Email: Valid email format (includes @)
- ✅ Password: Min 8 chars, must have uppercase, lowercase, number, special char (@$!%*?&)
- ✅ Age: 13-19 years only
- ✅ Terms & Conditions: Must be accepted

### Profile Update:
- ✅ Name: Cannot be empty
- ✅ Email: Valid email format
- ✅ Phone: Optional, but if provided must be 10 digits starting with 6/7/8/9
- ✅ Gender: Optional

### Password Change:
- ✅ Current Password: Required for verification
- ✅ New Password: Min 6 characters
- ✅ Confirm Password: Must match new password

---

## UNUSED ATTRIBUTES (Removed from Verification)

These exist in backend model but are **NOT used** in frontend:

- ❌ `avatar` - No avatar upload functionality in UI
- ❌ `role` - All users have same role (no admin/moderator)
- ❌ `subscription` - No subscription system implemented
- ❌ `streakCount` - No daily streak tracking in UI
- ❌ `lastLoginDate` - Not displayed or used

---

## FRONTEND FILES VERIFIED

| File | Purpose | Lines Checked |
|------|---------|---------------|
| `/components/UserSignup.tsx` | Registration form | 14-76 |
| `/components/UserLogin.tsx` | Login form | All |
| `/components/Settings.tsx` | Profile & password update | 47-150 |
| `/contexts/AuthContext.tsx` | Auth state management | All |
| `/services/api.ts` | API calls | userAPI methods |

---

**✅ 100% VERIFIED FROM ACTUAL FRONTEND CODE**

**Last Updated:** November 28, 2024
