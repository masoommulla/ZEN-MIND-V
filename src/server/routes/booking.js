import express from 'express';
import TherapistAuth from '../models/TherapistAuth.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { sendAppointmentEmail, sendTherapistAppointmentEmail } from '../utils/emailService.js';

const router = express.Router();

// @route   POST /api/booking/instant-book
// @desc    Instant booking - no slot selection, book immediately
// @access  Private
router.post('/instant-book', protect, async (req, res) => {
  try {
    const { therapistId, duration = 30 } = req.body;

    // Validation
    if (!therapistId || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Therapist ID and duration are required'
      });
    }

    // Validate duration (30 or 60 minutes only)
    if (![30, 60].includes(duration)) {
      return res.status(400).json({
        success: false,
        message: 'Duration must be 30 or 60 minutes'
      });
    }

    // CRITICAL: Validate MongoDB ObjectId format before querying
    if (!therapistId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid therapist ID format'
      });
    }

    // Find therapist
    const therapist = await TherapistAuth.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    // Validate therapist has pricing configured
    if (!therapist.pricing || !therapist.pricing.perSession) {
      return res.status(400).json({
        success: false,
        message: 'Therapist pricing is not configured'
      });
    }

    // Check if therapist is currently busy
    if (therapist.currentSession && therapist.currentSession.isActive) {
      const now = new Date();
      
      // If endsAt is not set, clear the invalid session
      if (!therapist.currentSession.endsAt) {
        therapist.currentSession = {
          isActive: false,
          appointmentId: null,
          startedAt: null,
          endsAt: null
        };
        await therapist.save();
      } else {
        const sessionEndsAt = new Date(therapist.currentSession.endsAt);
        
        // Check if session is still active
        if (now < sessionEndsAt) {
          return res.status(400).json({
            success: false,
            message: 'Therapist is currently busy. Please try again later.',
            availableAt: sessionEndsAt
          });
        } else {
          // Session expired - clear it
          therapist.currentSession = {
            isActive: false,
            appointmentId: null,
            startedAt: null,
            endsAt: null
          };
          await therapist.save();
        }
      }
    }

    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get current time
    const now = new Date();
    
    // Store the booking time (when the session was booked)
    const bookingTime = now;
    
    // Session start time is 5 minutes from booking
    const sessionStart = new Date(bookingTime.getTime() + 5 * 60000);
    
    // Calculate end time based on session start + duration
    const sessionEnd = new Date(sessionStart.getTime() + duration * 60000);
    
    // Format times (HH:MM format)
    const startTime = `${String(sessionStart.getHours()).padStart(2, '0')}:${String(sessionStart.getMinutes()).padStart(2, '0')}`;
    const endTime = `${String(sessionEnd.getHours()).padStart(2, '0')}:${String(sessionEnd.getMinutes()).padStart(2, '0')}`;

    // Calculate amount based on therapist's per-minute rate
    const perMinuteRate = therapist.pricing.perSession / 30;
    const amount = Math.ceil(perMinuteRate * duration);

    // Generate fake transaction ID
    const fakeTransactionId = `FAKE_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create appointment - IMPORTANT: date should be sessionStart, not just the date component
    const appointment = await Appointment.create({
      userId: req.user.id,
      therapistId: therapist._id,
      therapistName: therapist.name,
      therapistAvatar: therapist.profilePicture,
      date: sessionStart, // Full datetime when session starts (5 min from booking)
      startTime,
      endTime,
      duration,
      type: 'video',
      status: 'scheduled',
      payment: {
        amount: amount,
        currency: 'INR',
        status: 'completed',
        transactionId: fakeTransactionId,
        paidAt: new Date(),
        method: 'fake_payment'
      },
      meetingLink: `https://meet.jit.si/zenmind-${Date.now()}-${Math.random().toString(36).substring(7)}`
    });

    // CRITICAL: Atomic update to prevent race conditions when multiple users book simultaneously
    // Only update if therapist is still available (currentSession.isActive is false or endsAt has passed)
    const updateResult = await TherapistAuth.findOneAndUpdate(
      {
        _id: therapist._id,
        $or: [
          { 'currentSession.isActive': false },
          { 'currentSession.isActive': { $exists: false } },
          { 'currentSession.endsAt': { $lt: now } }
        ]
      },
      {
        $set: {
          'currentSession.isActive': true,
          'currentSession.appointmentId': appointment._id,
          'currentSession.startedAt': sessionStart,
          'currentSession.endsAt': sessionEnd
        }
      },
      { new: true }
    );

    // If update failed, another booking happened simultaneously - rollback
    if (!updateResult) {
      await Appointment.findByIdAndDelete(appointment._id);
      return res.status(400).json({
        success: false,
        message: 'Therapist was just booked by another user. Please try again.'
      });
    }

    // Send email notification to teen
    try {
      await sendAppointmentEmail(
        user.email,
        user.name,
        {
          therapistName: therapist.name,
          date: sessionStart.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          startTime,
          endTime,
          duration,
          amount: amount,
          appointmentId: appointment._id
        }
      );
      console.log('✅ Appointment confirmation email sent to teen:', user.email);
    } catch (emailError) {
      console.error('⚠️ Failed to send email to teen, but booking succeeded:', emailError);
    }

    // Send email notification to therapist
    try {
      if (therapist.email) {
        await sendTherapistAppointmentEmail(
          therapist.email,
          therapist.name,
          {
            teenName: 'Anonymous Teen',
            date: sessionStart.toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            startTime,
            endTime,
            duration,
            amount: amount,
            appointmentId: appointment._id
          }
        );
        console.log('✅ Appointment notification email sent to therapist:', therapist.email);
      }
    } catch (emailError) {
      console.error('⚠️ Failed to send email to therapist, but booking succeeded:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Session booked successfully! You can join in 5 minutes.',
      data: {
        appointment,
        canJoinAt: sessionStart
      }
    });
  } catch (error) {
    console.error('❌ Error creating instant booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// @route   GET /api/booking/therapist-status/:therapistId
// @desc    Check if therapist is available
// @access  Public
router.get('/therapist-status/:therapistId', async (req, res) => {
  try {
    // CRITICAL: Validate MongoDB ObjectId format before querying
    if (!req.params.therapistId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid therapist ID format'
      });
    }

    const therapist = await TherapistAuth.findById(req.params.therapistId);
    
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    const now = new Date();
    let isAvailable = true;
    let availableAt = null;

    if (therapist.currentSession && therapist.currentSession.isActive) {
      // If endsAt is not set, clear the invalid session
      if (!therapist.currentSession.endsAt) {
        therapist.currentSession = {
          isActive: false,
          appointmentId: null,
          startedAt: null,
          endsAt: null
        };
        await therapist.save();
      } else {
        const sessionEndsAt = new Date(therapist.currentSession.endsAt);
        
        // Check if session is still active
        if (now < sessionEndsAt) {
          isAvailable = false;
          availableAt = sessionEndsAt;
        } else {
          // Session expired - clear it
          therapist.currentSession = {
            isActive: false,
            appointmentId: null,
            startedAt: null,
            endsAt: null
          };
          await therapist.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        isAvailable,
        availableAt,
        currentSession: therapist.currentSession
      }
    });
  } catch (error) {
    console.error('❌ Error checking therapist status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking therapist status',
      error: error.message
    });
  }
});

// @route   POST /api/booking/join-session/:appointmentId
// @desc    Join video session
// @access  Private
router.post('/join-session/:appointmentId', protect, async (req, res) => {
  try {
    // CRITICAL: Validate MongoDB ObjectId format before querying
    if (!req.params.appointmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID format'
      });
    }

    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate('therapistId')
      .populate('userId');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Verify user is part of this appointment
    const isUser = appointment.userId._id.toString() === req.user.id;
    const isTherapist = appointment.therapistId._id.toString() === req.user.id;

    if (!isUser && !isTherapist) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to join this session'
      });
    }

    // Check if session can be joined
    // User/Therapist can join AFTER the appointment date (which is already 5 min from booking)
    // and BEFORE the session ends
    const now = new Date();
    const sessionStart = new Date(appointment.date); // This is already 5 min from booking
    const sessionEnd = new Date(sessionStart.getTime() + appointment.duration * 60000);

    // Can join from session start time (which is 5 min after booking) until session end
    if (now < sessionStart) {
      const waitTime = Math.ceil((sessionStart - now) / 1000); // in seconds
      return res.status(400).json({
        success: false,
        message: `Session can be joined in ${Math.floor(waitTime / 60)}m ${waitTime % 60}s`,
        canJoinAt: sessionStart
      });
    }

    if (now > sessionEnd) {
      return res.status(400).json({
        success: false,
        message: 'This session has ended'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        meetingLink: appointment.meetingLink,
        appointment,
        participantInfo: {
          isTherapist,
          otherParticipant: isTherapist ? {
            name: 'Anonymous Teen',
            avatar: appointment.userId.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=teen'
          } : {
            name: appointment.therapistName,
            avatar: appointment.therapistAvatar
          }
        }
      }
    });
  } catch (error) {
    console.error('❌ Error joining session:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining session',
      error: error.message
    });
  }
});

// @route   POST /api/booking/end-session/:appointmentId
// @desc    End a session (auto-called or manual)
// @access  Private
router.post('/end-session/:appointmentId', protect, async (req, res) => {
  try {
    // CRITICAL: Validate MongoDB ObjectId format before querying
    if (!req.params.appointmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID format'
      });
    }

    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate('therapistId');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // IDEMPOTENCY: If already completed, just return success (avoid duplicate processing)
    if (appointment.status === 'completed') {
      return res.status(200).json({
        success: true,
        message: 'Session already ended'
      });
    }

    // Update appointment status
    appointment.status = 'completed';
    await appointment.save();

    // Update therapist's current session - NO BUFFER, make therapist available immediately
    const therapist = appointment.therapistId;
    
    // Safety check: Ensure therapist exists and is populated
    if (therapist && therapist._id) {
      if (therapist.currentSession && therapist.currentSession.appointmentId && therapist.currentSession.appointmentId.toString() === appointment._id.toString()) {
        // Clear session immediately - therapist becomes available right away
        therapist.currentSession = {
          isActive: false,
          appointmentId: null,
          startedAt: null,
          endsAt: null
        };
        await therapist.save();
      }
    } else {
      // Therapist not populated, fetch directly
      const therapistDoc = await TherapistAuth.findById(appointment.therapistId);
      if (therapistDoc && therapistDoc.currentSession && therapistDoc.currentSession.appointmentId && therapistDoc.currentSession.appointmentId.toString() === appointment._id.toString()) {
        therapistDoc.currentSession = {
          isActive: false,
          appointmentId: null,
          startedAt: null,
          endsAt: null
        };
        await therapistDoc.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Session ended successfully'
    });
  } catch (error) {
    console.error('❌ Error ending session:', error);
    res.status(500).json({
      success: false,
      message: 'Error ending session',
      error: error.message
    });
  }
});

export default router;