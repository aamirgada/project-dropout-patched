const Session = require('../models/Session');
const User = require('../models/User');
const Student = require('../models/Student');

// @desc    Create a counseling session (student)
// @route   POST /api/sessions
// @access  Private (Student)
const createSession = async (req, res) => {
  try {
    const { sessionType, date, time, notes } = req.body;

    const studentUser = await User.findById(req.user.id);
    if (!studentUser) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (!studentUser.assignedMentor) {
      return res.status(400).json({ success: false, message: 'No mentor assigned' });
    }

    if (!date || !time) {
      return res.status(400).json({ success: false, message: 'Date and time are required' });
    }

    // Combine date and time into a single Date
    const scheduledDate = new Date(`${date}T${time}`);
    if (Number.isNaN(scheduledDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date or time' });
    }

    const session = await Session.create({
      studentId: studentUser._id,
      mentorId: studentUser.assignedMentor,
      scheduledDate,
      duration: 60,
      topic: sessionType || 'Session',
      notes: notes || '',
      status: 'pending'
    });

    const populatedSession = await Session.findById(session._id)
      .populate('mentorId', 'name email phone')
      .populate('studentId', 'name email');

    res.status(201).json({ success: true, session: populatedSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a session for a student (admin/mentor)
// @route   POST /api/sessions/book
// @access  Private (Mentor, Admin)
const createSessionForStudent = async (req, res) => {
  try {
    const { studentId, mentorId, scheduledDate, duration, topic, notes, meetingLink } = req.body;

    if (!studentId || !scheduledDate || !topic) {
      return res.status(400).json({
        success: false,
        message: 'studentId, scheduledDate and topic are required'
      });
    }

    const student = await Student.findById(studentId).populate('userId', 'assignedMentor name email');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const studentUser = await User.findById(student.userId._id);
    if (!studentUser) {
      return res.status(404).json({ success: false, message: 'Student user not found' });
    }

    // Mentors can only book sessions for their assigned students. Admins bypass.
    if (req.user.role === 'mentor') {
      if (studentUser.assignedMentor?.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to book for this student'
        });
      }
    }

    // Determine mentor to use
    let mentorUserId = mentorId || studentUser.assignedMentor;
    if (req.user.role === 'mentor') {
      mentorUserId = req.user.id;
    }

    if (!mentorUserId) {
      return res.status(400).json({ success: false, message: 'No mentor specified or assigned to student' });
    }

    const mentorUser = await User.findById(mentorUserId);
    if (!mentorUser || mentorUser.role !== 'mentor') {
      return res.status(400).json({ success: false, message: 'Invalid mentor provided' });
    }

    const parsedDate = new Date(scheduledDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid scheduledDate' });
    }

    const session = await Session.create({
      studentId: studentUser._id,
      mentorId: mentorUser._id,
      scheduledDate: parsedDate,
      duration: duration || 60,
      topic: topic || 'Session',
      notes: notes || '',
      meetingLink: meetingLink || '',
      status: 'scheduled'
    });

    const populatedSession = await Session.findById(session._id)
      .populate('mentorId', 'name email phone')
      .populate('studentId', 'name email');

    res.status(201).json({ success: true, session: populatedSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get upcoming sessions for a student
// @route   GET /api/sessions/student
// @access  Private (Student)
const getStudentSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      studentId: req.user.id,
      status: { $in: ['pending', 'scheduled'] },
    })
      .sort({ createdAt: -1 })
      .populate('mentorId', 'name email phone');

    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get upcoming sessions for a mentor
// @route   GET /api/sessions/mentor
// @access  Private (Mentor)
const getMentorSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      mentorId: req.user.id,
      status: { $in: ['pending', 'scheduled'] },
    })
      .sort({ createdAt: -1 })
      .populate('studentId', 'name email');

    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pending sessions for a mentor
// @route   GET /api/sessions/mentor/pending
// @access  Private (Mentor)
const getPendingSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      mentorId: req.user.id,
      status: 'pending',
    })
      .sort({ createdAt: -1 })
      .populate('studentId', 'name email studentId');

    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve a session request
// @route   PUT /api/sessions/:id/approve
// @access  Private (Mentor)
const approveSession = async (req, res) => {
  try {
    const { scheduledDate, duration } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.mentorId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (session.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Session already processed' });
    }

    // Update session with approved date/time or keep original
    if (scheduledDate) {
      session.scheduledDate = new Date(scheduledDate);
    }
    if (duration) {
      session.duration = duration;
    }
    session.status = 'scheduled';

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('studentId', 'name email')
      .populate('mentorId', 'name email');

    res.json({ success: true, session: populatedSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject a session request
// @route   PUT /api/sessions/:id/reject
// @access  Private (Mentor)
const rejectSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.mentorId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (session.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Session already processed' });
    }

    session.status = 'cancelled';
    await session.save();

    res.json({ success: true, message: 'Session request rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSession,
  createSessionForStudent,
  getStudentSessions,
  getMentorSessions,
  getPendingSessions,
  approveSession,
  rejectSession,
};

