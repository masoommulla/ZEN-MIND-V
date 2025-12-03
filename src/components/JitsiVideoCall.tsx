import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Phone, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { API_URL } from '../config';

interface JitsiVideoCallProps {
  roomName: string;
  userName: string;
  onEndCall: () => void;
  duration: number;
  sessionEndTime: Date;
  appointmentId?: string;
}

export function JitsiVideoCall({ roomName, userName, onEndCall, duration, sessionEndTime, appointmentId }: JitsiVideoCallProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isEndingRef = useRef(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const endCall = useCallback(() => {
    if (isEndingRef.current) {
      console.log('⚠️ Session end already in progress');
      return;
    }
    isEndingRef.current = true;
    
    if (appointmentId) {
      const token = localStorage.getItem('token');
      
      const attemptEndSession = async (retryCount = 0) => {
        try {
          const response = await fetch(`${API_URL}/api/booking/end-session/${appointmentId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error(`Failed to end session: ${response.status}`);
          }
          
          console.log('✅ Session ended successfully via API');
        } catch (error) {
          console.error(`❌ Failed to end session (attempt ${retryCount + 1}/3):`, error);
          
          if (retryCount < 2) {
            const delay = Math.pow(2, retryCount) * 1000;
            console.log(`🔄 Retrying in ${delay}ms...`);
            setTimeout(() => attemptEndSession(retryCount + 1), delay);
          }
        }
      };
      
      attemptEndSession();
    }
    onEndCall();
  }, [appointmentId, onEndCall]);

  // Countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endTime = new Date(sessionEndTime);
      const remaining = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
      
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        console.log('⏰ Session time ended');
        endCall();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [sessionEndTime, endCall]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  // Build Jitsi iframe URL with all necessary parameters to bypass lobby
  const sanitizedRoomName = roomName.trim().replace(/[^a-zA-Z0-9-_]/g, '-');
  const encodedUserName = encodeURIComponent(userName);
  
  // CRITICAL: These URL parameters bypass lobby and authentication
  const jitsiUrl = `https://meet.jit.si/${sanitizedRoomName}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false&userInfo.displayName="${encodedUserName}"`;

  console.log('🔄 Loading Jitsi with URL:', jitsiUrl);

  // Handle iframe load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Listen for postMessage from iframe (when user leaves via Jitsi UI)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from Jitsi domain
      if (!event.origin.includes('jitsi') && !event.origin.includes('8x8.vc')) {
        return;
      }

      const data = event.data;
      
      // Check for various exit events
      if (data?.event === 'videoConferenceLeft' || 
          data?.event === 'readyToClose' ||
          data?.type === 'conference-left') {
        console.log('📤 Jitsi iframe sent exit event');
        endCall();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [endCall]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Jitsi iframe - NO LOBBY with URL parameters */}
      <iframe
        ref={iframeRef}
        src={jitsiUrl}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="w-full h-full border-0"
        style={{ border: 'none' }}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-40 pointer-events-none">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">Connecting to session...</p>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
        <Card className={`backdrop-blur-lg border-gray-700 p-4 ${
          timeRemaining < 300 ? 'bg-red-900/90 animate-pulse' : 'bg-gray-900/90'
        }`}>
          <div className="text-center">
            <p className="text-white text-sm mb-1">Session Time Remaining</p>
            <p className={`text-3xl font-mono ${
              timeRemaining < 300 ? 'text-red-200' : 'text-white'
            }`}>
              {formatTime(timeRemaining)}
            </p>
            {timeRemaining < 300 && (
              <p className="text-red-200 text-xs mt-1">Session ending soon!</p>
            )}
          </div>
        </Card>
      </div>

      {/* End Call Button */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <Button
          onClick={endCall}
          variant="destructive"
          size="lg"
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 shadow-lg"
        >
          <PhoneOff className="w-7 h-7" />
        </Button>
      </motion.div>
    </div>
  );
}
