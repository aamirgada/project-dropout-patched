const User = require('../models/User');
const Student = require('../models/Student');
const Prediction = require('../models/Prediction');
const Session = require('../models/Session');

// @desc    Get student dashboard stats
// @route   GET /api/dashboard/student
// @access  Private (Student)
const getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    
    if (!student) {
      return res.json({
        success: true,
        stats: {
          profileComplete: false,
          message: 'Complete your profile to generate predictions'
        }
      });
    }

    // Get latest prediction
    const latestPrediction = await Prediction.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 });

    // Get prediction history count
    const totalPredictions = await Prediction.countDocuments({ userId: req.user.id });

    // Get prediction trend (last 5 predictions)
    const predictionTrend = await Prediction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('riskScore riskLevel createdAt factors');

    // Get mentor info
    const user = await User.findById(req.user.id).populate('assignedMentor', 'name email phone');

    // Upcoming sessions for student (pending and scheduled)
    const sessions = await Session.find({
      studentId: req.user.id,
      status: { $in: ['pending', 'scheduled'] }
    })
      .sort({ createdAt: -1 })
      .populate('mentorId', 'name email phone');

    res.json({
      success: true,
      stats: {
        profileComplete: true,
        gpa: student.gpa,
        attendance: student.attendance,
        currentRisk: latestPrediction?.riskLevel || 'unknown',
        currentRiskScore: latestPrediction?.riskScore || 0,
        totalPredictions,
        mentor: user.assignedMentor,
        recommendations: latestPrediction?.recommendations || [],
        predictionTrend: predictionTrend.reverse(),
        counselingSessions: sessions,
        latestPredictionFactors: latestPrediction?.factors || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get mentor dashboard stats
// @route   GET /api/dashboard/mentor
// @access  Private (Mentor)
const getMentorDashboard = async (req, res) => {
  try {
    // Get assigned students
    // TEMP / SIMPLE: get all active student users (no assignedMentor filter)
const activeStudentUsers = await User.find({
  role: 'student',
  isActive: true,
}).select('_id');

// their userIds
const studentIds = activeStudentUsers.map((s) => s._id);

// Get student profiles for those users
const students = await Student.find({
  userId: { $in: studentIds },
}).populate({
  path: 'userId',
  select: 'name email assignedMentor',
});


    // Get latest predictions for each student
    const studentsWithRisk = await Promise.all(
      students.map(async (student) => {
        const latestPrediction = await Prediction.findOne({ 
          userId: student.userId._id 
        }).sort({ createdAt: -1 });

        return {
          id: student._id,
          name: student.userId.name,
          email: student.userId.email,
          studentId: student.studentId,
        gpa: student.gpa,
          attendance: student.attendance,
        userId: student.userId._id,
        assignedMentor: student.userId.assignedMentor,
          riskLevel: latestPrediction?.riskLevel || 'unknown',
          riskScore: latestPrediction?.riskScore || 0,
          lastUpdated: student.updatedAt
        };
      })
    );

    // Calculate risk distribution
    const riskDistribution = {
      low: studentsWithRisk.filter(s => s.riskLevel === 'low').length,
      medium: studentsWithRisk.filter(s => s.riskLevel === 'medium').length,
      high: studentsWithRisk.filter(s => s.riskLevel === 'high').length,
      unknown: studentsWithRisk.filter(s => s.riskLevel === 'unknown').length
    };

    // Get high-risk students
    const highRiskStudents = studentsWithRisk
      .filter(s => s.riskLevel === 'high')
      .sort((a, b) => b.riskScore - a.riskScore);

    // Calculate average metrics
    const avgGPA = students.length > 0 
      ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)
      : 0;
    
    const avgAttendance = students.length > 0
      ? (students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1)
      : 0;

    // Get pending and scheduled sessions for mentor
    const pendingSessions = await Session.find({
      mentorId: req.user.id,
      status: 'pending'
    })
      .sort({ createdAt: -1 })
      .populate('studentId', 'name email studentId');

    const scheduledSessions = await Session.find({
      mentorId: req.user.id,
      status: 'scheduled',
      scheduledDate: { $gte: new Date() }
    })
      .sort({ scheduledDate: 1 })
      .populate('studentId', 'name email');

    res.json({
      success: true,
      stats: {
        totalStudents: studentsWithRisk.length,
        riskDistribution,
        highRiskStudents,
        avgGPA: parseFloat(avgGPA),
        avgAttendance: parseFloat(avgAttendance),
        students: studentsWithRisk,
        pendingSessions,
        sessions: scheduledSessions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
const getAdminDashboard = async (req, res) => {
  try {
    // Get user counts
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalMentors = await User.countDocuments({ role: 'mentor', isActive: true });
    const totalAdmins = await User.countDocuments({ role: 'admin', isActive: true });

    // Get all students
    const students = await Student.find({}).populate('userId', 'name email');

    // Get all predictions
    const predictions = await Prediction.find({});

    // Calculate risk distribution
    const latestPredictions = {};
    predictions.forEach(pred => {
      const userId = pred.userId.toString();
      if (!latestPredictions[userId] || 
          pred.createdAt > latestPredictions[userId].createdAt) {
        latestPredictions[userId] = pred;
      }
    });

    const riskDistribution = {
      low: 0,
      medium: 0,
      high: 0,
      unknown: totalStudents - Object.keys(latestPredictions).length
    };

    Object.values(latestPredictions).forEach(pred => {
      riskDistribution[pred.riskLevel]++;
    });

    // Calculate system-wide metrics
    const avgGPA = students.length > 0 
      ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)
      : 0;
    
    const avgAttendance = students.length > 0
      ? (students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1)
      : 0;

    // Get recent activity
    const recentPredictions = await Prediction.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email')
      .populate('studentId', 'studentId');

    // Get students needing attention (high risk)
    const highRiskPredictions = Object.values(latestPredictions)
      .filter(p => p.riskLevel === 'high')
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10);

    const highRiskStudents = await Promise.all(
      highRiskPredictions.map(async (pred) => {
        const student = await Student.findOne({ userId: pred.userId })
          .populate('userId', 'name email');
        return {
          id: student._id,
          name: student.userId.name,
          email: student.userId.email,
          studentId: student.studentId,
          riskLevel: pred.riskLevel,
          riskScore: pred.riskScore
        };
      })
    );

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalMentors,
        totalAdmins,
        totalPredictions: predictions.length,
        riskDistribution,
        avgGPA: parseFloat(avgGPA),
        avgAttendance: parseFloat(avgAttendance),
        recentActivity: recentPredictions,
        highRiskStudents
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getStudentDashboard,
  getMentorDashboard,
  getAdminDashboard
};