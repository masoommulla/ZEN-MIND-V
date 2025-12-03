import cron from 'node-cron';
import Appointment from '../models/Appointment.js';
import TherapistAuth from '../models/TherapistAuth.js';

/**
 * Auto-end sessions that have exceeded their duration
 * Runs every 30 seconds to check for expired sessions
 */
export const startSessionAutoEndService = () => {
  console.log('🔄 Session Auto-End Service started');

  // Run every 30 seconds for faster response time
  cron.schedule('*/30 * * * * *', async () => {
    try {
      const now = new Date();

      // Find all active appointments that should have ended
      const expiredSessions = await Appointment.find({
        status: 'scheduled',
        date: { $lte: now }
      });

      for (const session of expiredSessions) {
        try {
          // The appointment.date field is the full datetime when the session starts
          const sessionStart = new Date(session.date);
          const sessionEnd = new Date(sessionStart.getTime() + session.duration * 60000);

          // If session has ended, mark as completed
          if (now > sessionEnd) {
            console.log(`⏰ Auto-ending session ${session._id}`);
            
            session.status = 'completed';
            await session.save();

            // Clear therapist's current session - NO BUFFER, make available immediately
            const therapist = await TherapistAuth.findById(session.therapistId);
            if (therapist && therapist.currentSession && therapist.currentSession.isActive) {
              if (therapist.currentSession.appointmentId && therapist.currentSession.appointmentId.toString() === session._id.toString()) {
                // Make therapist available immediately - NO BUFFER
                therapist.currentSession = {
                  isActive: false,
                  appointmentId: null,
                  startedAt: null,
                  endsAt: null
                };
                await therapist.save();
                console.log(`✅ Session ended for ${therapist.name}, therapist is now available immediately`);
              }
            }
          }
        } catch (error) {
          // Skip invalid appointments (e.g., with invalid therapistId from old test data)
          console.warn(`⚠️  Skipping invalid appointment ${session._id}:`, error.message);
          // Delete the invalid appointment to prevent future errors
          try {
            await Appointment.deleteOne({ _id: session._id });
            console.log(`🗑️  Deleted invalid appointment ${session._id}`);
          } catch (deleteError) {
            console.error(`❌ Failed to delete invalid appointment ${session._id}:`, deleteError.message);
          }
        }
      }

      // Also clear any stale sessions with endsAt in the past (legacy cleanup)
      const therapists = await TherapistAuth.find({
        'currentSession.isActive': true,
        'currentSession.endsAt': { $ne: null }
      });

      for (const therapist of therapists) {
        if (!therapist.currentSession.endsAt) continue;
        
        const sessionEndsAt = new Date(therapist.currentSession.endsAt);

        if (now > sessionEndsAt) {
          console.log(`⏰ Clearing stale session for therapist ${therapist.name}, now available`);
          therapist.currentSession = {
            isActive: false,
            appointmentId: null,
            startedAt: null,
            endsAt: null
          };
          await therapist.save();
        }
      }
    } catch (error) {
      console.error('❌ Session auto-end service error:', error);
    }
  });

  console.log('✅ Session Auto-End Service is running (every 30 seconds)');
};