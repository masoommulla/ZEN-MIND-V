import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Video, 
  User,
  XCircle,
  Home,
  Trash2
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PageTransition3D } from './3DGraphics';
import { toast } from 'sonner@2.0.3';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI, refundAPI } from '../services/api';
import { JitsiVideoCall } from './JitsiVideoCall';
import { SessionReviewModal } from './SessionReviewModal';
import { API_URL } from '../config';

interface TherapySession {
  _id: string;
  therapistId: any;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  payment: {
    amount: number;
    status: string;
  };
  createdAt: string;
  meetingLink?: string;
  roomName?: string; // Room name extracted from meetingLink for Jitsi
}

export function AppointmentsNew() {
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<TherapySession | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [joiningSession, setJoiningSession] = useState<string | null>(null); // Track which session is being joined
  const navigate = useNavigate();

  useEffect(() => {
    loadAppointments();
    
    // Update current time every second for real-time validation
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for real-time responsiveness

    return () => clearInterval(interval);
  }, []);

  // Auto-reload appointments every 30 seconds (reduced from 10) to detect status changes
  useEffect(() => {
    const reloadInterval = setInterval(() => {
      // Only reload if not currently in a call
      if (!isInCall) {
        loadAppointments();
      }
    }, 30000); // Reload every 30 seconds (reduced frequency)

    return () => clearInterval(reloadInterval);
  }, [isInCall]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentAPI.getAll();
      if (response.success) {
        setSessions(response.data);
      }
    } catch (error: any) {
      console.error('Error loading appointments:', error);
      toast.error(error.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  // Check if user can join session (within 5 minutes before start time)
  const canJoinSession = (session: TherapySession) => {
    // CRITICAL: Validate date before processing
    if (!session.date) {
      console.error('❌ Session has no date:', session._id);
      return false;
    }
    
    // The appointment.date field is the full datetime when the session starts (5 min from booking)
    // We can join when currentTime >= appointment.date
    const sessionStart = new Date(session.date);
    
    // CRITICAL: Check if date is valid
    if (isNaN(sessionStart.getTime())) {
      console.error('❌ Invalid session date:', session.date);
      return false;
    }
    
    const sessionEnd = new Date(sessionStart.getTime() + session.duration * 60000);
    const now = currentTime;
    
    // Can join from session start time until session end time
    return now >= sessionStart && now <= sessionEnd && session.status === 'scheduled';
  };

  // Get countdown text for join button
  const getCountdownText = (session: TherapySession) => {
    const sessionStart = new Date(session.date); // This is when we can join (5 min from booking)
    const now = currentTime;

    if (now >= sessionStart) {
      return 'Join Now';
    }

    const diff = sessionStart.getTime() - now.getTime();
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    
    if (mins > 0) {
      return `Available in ${mins}m ${secs}s`;
    }
    return `Available in ${secs}s`;
  };

  // Check if session has expired (past end time)
  const isSessionExpired = (session: TherapySession) => {
    const sessionStart = new Date(session.date);
    const sessionEnd = new Date(sessionStart.getTime() + session.duration * 60000);
    
    return currentTime > sessionEnd;
  };

  // Filter sessions
  const upcomingSessions = sessions.filter(session => {
    const sessionStart = new Date(session.date);
    const sessionEnd = new Date(sessionStart.getTime() + session.duration * 60000);
    
    return session.status === 'scheduled' && sessionEnd >= currentTime;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastSessions = sessions.filter(session => {
    const sessionStart = new Date(session.date);
    const sessionEnd = new Date(sessionStart.getTime() + session.duration * 60000);
    
    return session.status === 'completed' || session.status === 'cancelled' || sessionEnd < currentTime;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCancelSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to cancel this session? You will receive a refund with 10% deduction.')) {
      return;
    }

    try {
      const response = await refundAPI.cancelWithRefund(sessionId, 'Cancelled by user');
      if (response.success) {
        toast.success('Session cancelled. Refund processed with 10% deduction.');
        loadAppointments(); // Reload
      }
    } catch (error: any) {
      console.error('Cancel error:', error);
      toast.error(error.message || 'Failed to cancel session');
    }
  };

  const handleJoinSession = async (session: TherapySession) => {
    console.log('🚀 Attempting to join session:', session._id);
    
    if (!canJoinSession(session)) {
      console.error('❌ Cannot join session - validation failed');
      toast.error('Please wait for the 5-minute preparation period to complete');
      return;
    }

    setJoiningSession(session._id); // Set the session being joined

    try {
      console.log('📞 Calling join-session API...');
      const response = await appointmentAPI.joinSession(session._id);
      console.log('✅ Join-session API response:', response);
      
      if (response.success) {
        // Extract room name from meetingLink (e.g., "https://meet.jit.si/zenmind-123" -> "zenmind-123")
        const meetingLink = response.data.meetingLink || session.meetingLink;
        console.log('🔗 Meeting link:', meetingLink);
        
        const roomName = meetingLink 
          ? meetingLink.replace(/\/$/, '').split('/').pop() || `session-${session._id}`
          : `session-${session._id}`;
        
        console.log('🏠 Room name extracted:', roomName);
        
        // Calculate session end time
        const sessionStart = new Date(session.date);
        const sessionEndTime = new Date(sessionStart.getTime() + session.duration * 60000);
        
        console.log('⏰ Session timing:', {
          start: sessionStart.toISOString(),
          end: sessionEndTime.toISOString(),
          duration: session.duration
        });
        
        // Store room name in session for video call
        setActiveSession({ ...session, roomName });
        setIsInCall(true);
        
        console.log('✅ Joining video call...');
      } else {
        console.error('❌ Failed to join session:', response.message);
        toast.error(response.message || 'Failed to join session');
      }
    } catch (error: any) {
      console.error('❌ Error joining session:', error);
      toast.error(error.message || 'Failed to join session');
    } finally {
      setJoiningSession(null); // Reset joining session
    }
  };

  const handleEndCall = useCallback(() => {
    setIsInCall(false);
    // CRITICAL: Use activeSession from the current closure, not dependency
    // This prevents handleEndCall from being recreated when activeSession changes
    setReviewModalOpen(true);
  }, []); // Empty deps - activeSession is accessed from closure when handleEndCall is called

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

  if (isInCall && activeSession) {
    // Calculate session end time based on the appointment.date (session start) + duration
    const sessionStart = new Date(activeSession.date);
    const sessionEndTime = new Date(sessionStart.getTime() + activeSession.duration * 60000);

    return (
      <JitsiVideoCall
        roomName={activeSession.roomName || `session-${activeSession._id}`}
        userName="Teen User"
        onEndCall={handleEndCall}
        duration={activeSession.duration}
        sessionEndTime={sessionEndTime}
        appointmentId={activeSession._id}
      />
    );
  }

  return (
    <PageTransition3D>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                My Appointments
              </h1>
              <p className="text-gray-600">Manage your therapy sessions</p>
            </motion.div>

            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              Upcoming ({upcomingSessions.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === 'past'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              Past ({pastSessions.length})
            </button>
          </div>

          {/* Sessions List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading appointments...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {activeTab === 'upcoming' && (
                  <motion.div
                    key="upcoming"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {upcomingSessions.length === 0 ? (
                      <Card className="p-12 text-center border-2 border-purple-100">
                        <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">No upcoming appointments</p>
                        <Button
                          onClick={() => navigate('/dashboard/therapists')}
                          className="bg-gradient-to-r from-purple-500 to-pink-500"
                        >
                          Book a Session
                        </Button>
                      </Card>
                    ) : (
                      upcomingSessions.map((session, index) => (
                        <motion.div
                          key={session._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  {/* Therapist Info */}
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl">
                                    {session.therapistId?.profilePicture ? (
                                      <img
                                        src={session.therapistId.profilePicture}
                                        alt={session.therapistId.name}
                                        className="w-full h-full rounded-full object-cover"
                                      />
                                    ) : (
                                      <User className="w-8 h-8" />
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <h3 className="text-lg mb-1">
                                      {session.therapistId?.name || 'Therapist'}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(session.date)}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                        ₹{session.payment.amount}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                  {canJoinSession(session) ? (
                                    <Button
                                      onClick={() => handleJoinSession(session)}
                                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 animate-pulse"
                                    >
                                      <Video className="w-4 h-4 mr-2" />
                                      Join Session Now
                                    </Button>
                                  ) : (
                                    <div className="flex flex-col items-end">
                                      <div className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
                                        {getCountdownText(session)}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        Join button unlocks soon
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === 'past' && (
                  <motion.div
                    key="past"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {pastSessions.length === 0 ? (
                      <Card className="p-12 text-center border-2 border-purple-100">
                        <p className="text-gray-600">No past appointments</p>
                      </Card>
                    ) : (
                      pastSessions.map((session, index) => (
                        <motion.div
                          key={session._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-2 border-gray-100 opacity-75">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl">
                                    {session.therapistId?.profilePicture ? (
                                      <img
                                        src={session.therapistId.profilePicture}
                                        alt={session.therapistId.name}
                                        className="w-full h-full rounded-full object-cover"
                                      />
                                    ) : (
                                      <User className="w-8 h-8" />
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <h3 className="text-lg mb-1">
                                      {session.therapistId?.name || 'Therapist'}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(session.date)}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatTime(session.startTime)}</span>
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <Badge 
                                        variant="secondary" 
                                        className={
                                          session.status === 'completed' 
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                        }
                                      >
                                        {session.status.toUpperCase()}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Delete Button for Past Sessions */}
                                <Button
                                  onClick={async () => {
                                    try {
                                      const token = localStorage.getItem('token');
                                      const response = await fetch(`${API_URL}/api/appointments/${session._id}`, {
                                        method: 'DELETE',
                                        headers: {
                                          'Authorization': `Bearer ${token}`
                                        }
                                      });
                                      const data = await response.json();
                                      if (data.success) {
                                        toast.success('Session deleted from history');
                                        loadAppointments();
                                      } else {
                                        toast.error(data.message || 'Failed to delete session');
                                      }
                                    } catch (error: any) {
                                      console.error('Delete error:', error);
                                      toast.error('Failed to delete session');
                                    }
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Review Modal */}
        {reviewModalOpen && activeSession && (
          <SessionReviewModal
            sessionId={activeSession._id}
            therapistId={
              typeof activeSession.therapistId === 'object' 
                ? activeSession.therapistId._id 
                : activeSession.therapistId
            }
            onClose={() => {
              setReviewModalOpen(false);
              setActiveSession(null);
              loadAppointments();
            }}
          />
        )}
      </div>
    </PageTransition3D>
  );
}