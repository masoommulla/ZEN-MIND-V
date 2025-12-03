import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  Settings,
  LogOut,
  Video,
  DollarSign,
  User,
  Mail,
  Lock,
  Camera,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { PageTransition3D } from './3DGraphics';
import { JitsiVideoCall } from './JitsiVideoCall';
import { toast } from 'sonner@2.0.3';
import axios from 'axios';
import { API_URL } from '../config';

interface TherapistPortalProps {
  therapist: any;
  token: string;
  onLogout: () => void;
}

export function TherapistPortal({ therapist: initialTherapist, token, onLogout }: TherapistPortalProps) {
  const [activeTab, setActiveTab] = useState<'sessions' | 'profile' | 'settings'>('sessions');
  const [therapist, setTherapist] = useState(initialTherapist);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Profile edit state
  const [profileData, setProfileData] = useState({
    name: therapist.name || '',
    email: therapist.email || '',
    profilePicture: therapist.profilePicture || '',
    about: therapist.about || '',
    education: therapist.education || '',
    experience: therapist.experience || 0,
    languages: therapist.languages?.join(', ') || '',
    specializations: therapist.specializations?.join(', ') || ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot Password States
  const [forgotPasswordMode, setForgotPasswordMode] = useState<'email' | 'otp' | 'reset' | null>(null);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPasswordForgot, setNewPasswordForgot] = useState('');
  const [confirmNewPasswordForgot, setConfirmNewPasswordForgot] = useState('');
  const [showNewPasswordForgot, setShowNewPasswordForgot] = useState(false);
  const [showConfirmPasswordForgot, setShowConfirmPasswordForgot] = useState(false);

  // Pricing state
  const [pricingData, setPricingData] = useState({
    pricePerSession: therapist.pricePerSession || 500
  });

  // Slots management
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dateSlots, setDateSlots] = useState<any[]>([]);
  const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '' });

  // Set default date to today on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/therapist/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
    }
  }, [token]); // CRITICAL: Memoize to prevent recreation on every render

  const fetchSlots = useCallback(async () => {
    if (!selectedDate) return; // Don't fetch if no date selected
    
    try {
      const response = await axios.get(`${API_URL}/api/therapist/slots`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        // Find slots for selected date
        const slots = response.data.data.find((ds: any) => ds.date === selectedDate);
        setDateSlots(slots?.slots || []);
      }
    } catch (error: any) {
      console.error('Error fetching slots:', error);
    }
  }, [token, selectedDate]); // Memoize with both dependencies

  useEffect(() => {
    fetchAppointments();
    fetchSlots();

    // Update time every second for countdown timer
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for accurate countdown

    return () => clearInterval(interval);
  }, [fetchAppointments, fetchSlots]); // Both are now memoized
  
  // Update profile data when therapist data changes (to persist values)
  useEffect(() => {
    if (therapist) {
      setProfileData({
        name: therapist.name || '',
        email: therapist.email || '',
        profilePicture: therapist.profilePicture || '',
        about: therapist.about || '',
        education: therapist.education || '',
        experience: therapist.experience || 0,
        languages: therapist.languages?.join(', ') || '',
        specializations: therapist.specializations?.join(', ') || ''
      });
      setPricingData({
        pricePerSession: therapist.pricePerSession || 500
      });
    }
  }, [therapist]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      
      const response = await axios.put(
        `${API_URL}/api/therapist/profile`,
        {
          name: profileData.name,
          email: profileData.email,
          profilePicture: profileData.profilePicture,
          about: profileData.about,
          education: profileData.education,
          experience: Number(profileData.experience),
          languages: profileData.languages.split(',').map(l => l.trim()),
          specializations: profileData.specializations.split(',').map(s => s.trim())
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setTherapist(response.data.data);
        localStorage.setItem('currentTherapist', JSON.stringify(response.data.data));
        toast.success('Profile updated successfully!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfileData({ ...profileData, profilePicture: base64String });
      toast.success('Profile picture selected! Click Save to update.');
    };
    reader.readAsDataURL(file);
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.put(
        `${API_URL}/api/therapist/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  // Forgot Password Handlers
  const handleForgotPasswordEmail = async () => {
    const emailToUse = forgotEmail || therapist?.email || '';
    
    if (!emailToUse.trim() || !emailToUse.includes('@')) {
      toast.error('Valid email is required');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/therapist-auth/forgot-password`, { email: emailToUse });
      toast.success('OTP sent to your email!');
      setForgotEmail(emailToUse);
      setForgotPasswordMode('otp');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/therapist-auth/verify-otp`, { email: forgotEmail, otp });
      toast.success('OTP verified successfully!');
      setForgotPasswordMode('reset');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordReset = async () => {
    if (!newPasswordForgot) {
      toast.error('New password is required');
      return;
    }
    if (newPasswordForgot.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPasswordForgot !== confirmNewPasswordForgot) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/therapist-auth/reset-password`, { 
        email: forgotEmail, 
        newPassword: newPasswordForgot 
      });
      toast.success('Password reset successfully! 🔐');
      setForgotPasswordMode(null);
      setForgotEmail('');
      setOtp('');
      setNewPasswordForgot('');
      setConfirmNewPasswordForgot('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePricing = async () => {
    try {
      setLoading(true);
      
      const response = await axios.put(
        `${API_URL}/api/therapist/pricing`,
        {
          perSession: Number(pricingData.pricePerSession),
          duration: 30
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Pricing updated successfully!');
        // Update local state with new pricing
        const updatedTherapist = { ...therapist, pricing: { ...therapist.pricing, perSession: pricingData.pricePerSession } };
        setTherapist(updatedTherapist);
        localStorage.setItem('currentTherapist', JSON.stringify(updatedTherapist));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update pricing');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async () => {
    if (!newSlot.startTime || !newSlot.endTime) {
      toast.error('Please enter both start and end times');
      return;
    }

    const updatedSlots = [...dateSlots, {
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      isBooked: false
    }];

    try {
      setLoading(true);
      
      const response = await axios.put(
        `${API_URL}/api/therapist/slots`,
        {
          date: selectedDate,
          slots: updatedSlots
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Slot added successfully!');
        setNewSlot({ startTime: '', endTime: '' });
        fetchSlots();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add slot');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (slotIndex: number) => {
    const slot = dateSlots[slotIndex];
    
    if (slot.isBooked) {
      toast.error('Cannot delete a booked slot');
      return;
    }

    const updatedSlots = dateSlots.filter((_, i) => i !== slotIndex);

    try {
      setLoading(true);
      
      const response = await axios.put(
        `${API_URL}/api/therapist/slots`,
        {
          date: selectedDate,
          slots: updatedSlots
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Slot deleted successfully!');
        fetchSlots();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete slot');
    } finally {
      setLoading(false);
    }
  };

  const canJoinSession = (appointment: any) => {
    // CRITICAL: Validate date before processing
    if (!appointment.date) {
      console.error('❌ Appointment has no date:', appointment._id);
      return false;
    }
    
    // The appointment.date field is the full datetime when the session starts (5 min from booking)
    // Therapist can join when currentTime >= appointment.date
    const sessionStart = new Date(appointment.date);
    
    // CRITICAL: Check if date is valid
    if (isNaN(sessionStart.getTime())) {
      console.error('❌ Invalid appointment date:', appointment.date);
      return false;
    }
    
    const sessionEnd = new Date(sessionStart.getTime() + appointment.duration * 60000);
    const now = currentTime;
    
    // Can join from session start time until session end time
    return now >= sessionStart && now <= sessionEnd;
  };

  const handleJoinSession = async (appointment: any) => {
    console.log('👨‍⚕️ Therapist attempting to join session:', appointment._id);
    
    if (!canJoinSession(appointment)) {
      console.error('❌ Cannot join session - validation failed');
      toast.error('Please wait for the 5-minute preparation period to complete');
      return;
    }

    try {
      console.log('📞 Calling join-session API...');
      // Call join-session API to validate
      const response = await axios.post(
        `${API_URL}/api/booking/join-session/${appointment._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Join-session API response:', response.data);

      if (response.data.success) {
        // Extract room name from meetingLink
        const meetingLink = response.data.data.meetingLink || appointment.meetingLink;
        console.log('🔗 Meeting link:', meetingLink);
        
        const roomName = meetingLink 
          ? meetingLink.replace(/\/$/, '').split('/').pop() || `session-${appointment._id}`
          : `session-${appointment._id}`;
        
        console.log('🏠 Room name extracted:', roomName);
        
        // Calculate session end time
        const sessionStart = new Date(appointment.date);
        const sessionEndTime = new Date(sessionStart.getTime() + appointment.duration * 60000);
        
        console.log('⏰ Session timing:', {
          start: sessionStart.toISOString(),
          end: sessionEndTime.toISOString(),
          duration: appointment.duration
        });
        
        // Store room name in appointment for video call
        setActiveSession({ ...appointment, roomName });
        setIsInCall(true);
        
        console.log('✅ Joining video call as therapist...');
      } else {
        console.error('❌ Failed to join session:', response.data.message);
        toast.error(response.data.message || 'Failed to join session');
      }
    } catch (error: any) {
      console.error('❌ Error joining session:', error);
      toast.error(error.response?.data?.message || 'Failed to join session');
    }
  };

  // Get countdown timer text for session
  const getSessionTimerText = (appointment: any) => {
    const sessionStart = new Date(appointment.date);
    const sessionEnd = new Date(sessionStart.getTime() + appointment.duration * 60000);
    const now = currentTime;

    // If session has ended
    if (now > sessionEnd) {
      return 'Session Ended';
    }

    // If session is ongoing
    if (now >= sessionStart && now <= sessionEnd) {
      const diff = sessionEnd.getTime() - now.getTime();
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      return `Ends in ${mins}m ${secs}s`;
    }

    // If waiting for session start
    const diff = sessionStart.getTime() - now.getTime();
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    
    if (mins > 0) {
      return `Available in ${mins}m ${secs}s`;
    }
    return `Available in ${secs}s`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    if (!time || typeof time !== 'string' || !time.includes(':')) {
      return 'N/A';
    }
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return 'N/A';
    }
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-IN', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // Get today and tomorrow dates
  const getAvailableDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return [
      { value: today.toISOString().split('T')[0], label: 'Today' },
      { value: tomorrow.toISOString().split('T')[0], label: 'Tomorrow' }
    ];
  };

  // Filter appointments for today only
  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    const aptDate = new Date(apt.date).toISOString().split('T')[0];
    return aptDate === today;
  }).sort((a, b) => a.startTime.localeCompare(b.startTime));

  // CRITICAL: Memoize onEndCall to prevent JitsiVideoCall from reinitializing
  const handleEndCall = useCallback(() => {
    setIsInCall(false);
    setActiveSession(null);
    fetchAppointments(); // Call memoized function directly
  }, [fetchAppointments]); // Now fetchAppointments is stable

  if (isInCall && activeSession) {
    // Calculate session end time based on the appointment.date (session start) + duration
    const sessionStart = new Date(activeSession.date);
    const sessionEndTime = new Date(sessionStart.getTime() + activeSession.duration * 60000);

    return (
      <JitsiVideoCall
        roomName={activeSession.roomName || `session-${activeSession._id}`}
        userName={therapist.name}
        onEndCall={handleEndCall}
        duration={activeSession.duration}
        sessionEndTime={sessionEndTime}
        appointmentId={activeSession._id}
      />
    );
  }

  return (
    <PageTransition3D>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-8 pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Therapist Portal
              </h1>
              <p className="text-gray-600">Welcome back, {therapist.name}!</p>
            </div>
            
            <Button
              onClick={onLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'sessions'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              <Calendar className="w-4 h-4 inline-block mr-2" />
              Sessions
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'profile'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              <User className="w-4 h-4 inline-block mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'settings'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              <Settings className="w-4 h-4 inline-block mr-2" />
              Settings
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <motion.div
                key="sessions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Today's Sessions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      Today's Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {todayAppointments.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No sessions scheduled for today</p>
                    ) : (
                      <div className="space-y-3">
                        {todayAppointments.map(apt => {
                          const canJoin = canJoinSession(apt);
                          const timerText = getSessionTimerText(apt);
                          
                          return (
                            <div key={apt._id} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-100">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white">
                                  <User className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="font-medium">Session with Teen User</p>
                                  <p className="text-sm text-gray-600">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                                  </p>
                                  <p className="text-xs text-purple-600 font-medium mt-1">
                                    {timerText}
                                  </p>
                                </div>
                              </div>
                              {canJoin ? (
                                <Button
                                  onClick={() => handleJoinSession(apt)}
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
                                  size="lg"
                                >
                                  <Video className="w-5 h-5 mr-2" />
                                  Join Now
                                </Button>
                              ) : (
                                <Badge variant="outline" className="text-sm py-2 px-4">
                                  {timerText}
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Profile Picture */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Profile Picture URL</label>
                      <div className="flex items-center gap-4">
                        <img
                          src={profileData.profilePicture || 'https://via.placeholder.com/100'}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-200"
                        />
                        <Input
                          value={profileData.profilePicture}
                          onChange={(e) => setProfileData({ ...profileData, profilePicture: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                          id="profile-picture-upload"
                        />
                        <label
                          htmlFor="profile-picture-upload"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg cursor-pointer"
                        >
                          Upload
                        </label>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input 
                        value={profileData.email} 
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">For demonstration purposes, email is editable</p>
                    </div>

                    {/* About */}
                    <div>
                      <label className="block text-sm font-medium mb-2">About</label>
                      <Textarea
                        value={profileData.about}
                        onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                        rows={3}
                      />
                    </div>

                    {/* Education */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Education</label>
                      <Input
                        value={profileData.education}
                        onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                      />
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Experience (years)</label>
                      <Input
                        type="number"
                        value={profileData.experience}
                        onChange={(e) => setProfileData({ ...profileData, experience: Number(e.target.value) })}
                      />
                    </div>

                    {/* Languages */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Languages (comma-separated)</label>
                      <Input
                        value={profileData.languages}
                        onChange={(e) => setProfileData({ ...profileData, languages: e.target.value })}
                        placeholder="English, Hindi, Tamil"
                      />
                    </div>

                    {/* Specializations */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Specializations (comma-separated)</label>
                      <Input
                        value={profileData.specializations}
                        onChange={(e) => setProfileData({ ...profileData, specializations: e.target.value })}
                        placeholder="Anxiety, Depression, Stress"
                      />
                    </div>

                    <Button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                      size="lg"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price Per Session (₹)</label>
                      <Input
                        type="number"
                        value={pricingData.pricePerSession}
                        onChange={(e) => setPricingData({ pricePerSession: Number(e.target.value) })}
                        min="100"
                        max="5000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: ₹400 - ₹1000</p>
                    </div>

                    <Button
                      onClick={handleUpdatePricing}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Update Pricing
                    </Button>
                  </CardContent>
                </Card>

                {/* Change Password */}
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password</label>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={handleUpdatePassword}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </CardContent>
                </Card>

                {/* Forgot Password Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Forgot Password</span>
                      {!forgotPasswordMode && (
                        <Button
                          onClick={() => {
                            setForgotPasswordMode('email');
                            setForgotEmail(therapist?.email || '');
                          }}
                          variant="outline"
                          className="border-purple-500 text-purple-500"
                        >
                          <KeyRound className="w-4 h-4 mr-2" />
                          Reset Password
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {forgotPasswordMode === 'email' ? (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <Input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={handleForgotPasswordEmail}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                          >
                            {loading ? 'Sending...' : 'Send OTP'}
                          </Button>
                          <Button
                            onClick={() => setForgotPasswordMode(null)}
                            variant="outline"
                            disabled={loading}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : forgotPasswordMode === 'otp' ? (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium mb-2">Enter OTP</label>
                          <Input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                          />
                          <p className="text-xs text-gray-500">OTP sent to {forgotEmail}</p>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={handleForgotPasswordOtp}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                          >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                          </Button>
                          <Button
                            onClick={() => setForgotPasswordMode(null)}
                            variant="outline"
                            disabled={loading}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : forgotPasswordMode === 'reset' ? (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium mb-2">New Password</label>
                          <div className="relative">
                            <Input
                              type={showNewPasswordForgot ? 'text' : 'password'}
                              value={newPasswordForgot}
                              onChange={(e) => setNewPasswordForgot(e.target.value)}
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              onClick={() => setShowNewPasswordForgot(!showNewPasswordForgot)}
                            >
                              {showNewPasswordForgot ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                          <div className="relative">
                            <Input
                              type={showConfirmPasswordForgot ? 'text' : 'password'}
                              value={confirmNewPasswordForgot}
                              onChange={(e) => setConfirmNewPasswordForgot(e.target.value)}
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              onClick={() => setShowConfirmPasswordForgot(!showConfirmPasswordForgot)}
                            >
                              {showConfirmPasswordForgot ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={handleForgotPasswordReset}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                          >
                            {loading ? 'Resetting...' : 'Reset Password'}
                          </Button>
                          <Button
                            onClick={() => setForgotPasswordMode(null)}
                            variant="outline"
                            disabled={loading}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600">
                        Click "Reset Password" to receive an OTP via email and reset your password.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition3D>
  );
}