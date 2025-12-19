const Student = require('../models/Student');
const User = require('../models/User');
const Prediction = require('../models/Prediction');
const Session = require('../models/Session');

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private (Student)
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).populate('userId', 'name email phone');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.json({
      success: true,
      student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create/Update student profile
// @route   POST /api/students/profile
// @access  Private (Student)
const updateStudentProfile = async (req, res) => {
  try {
    const studentData = { ...req.body, userId: req.user.id };

    let student = await Student.findOne({ userId: req.user.id });

    if (student) {
      // Update existing
      student = await Student.findOneAndUpdate(
        { userId: req.user.id },
        studentData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      student = await Student.create(studentData);
    }

    res.json({
      success: true,
      student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all students (for mentor/admin)
// @route   GET /api/students
// @access  Private (Mentor, Admin)
const getAllStudents = async (req, res) => {
  try {
    const { riskLevel, search } = req.query;
    let query = {};

    // If mentor, only show assigned students
    if (req.user.role === 'mentor') {
      const assignedStudents = await User.find({ 
        assignedMentor: req.user.id,
        role: 'student' 
      }).select('_id');
      
      query.userId = { $in: assignedStudents.map(s => s._id) };
    }

    const students = await Student.find(query)
      .populate({
        path: 'userId',
        select: 'name email phone assignedMentor',
        populate: { path: 'assignedMentor', select: 'name email phone' }
      })
      .sort({ updatedAt: -1 });

    // Get latest predictions for filtering
    const studentsWithRisk = await Promise.all(
      students.map(async (student) => {
        const latestPrediction = await Prediction.findOne({ 
          studentId: student._id 
        }).sort({ createdAt: -1 });

        return {
          ...student.toObject(),
          latestRisk: latestPrediction ? latestPrediction.riskLevel : null,
          latestRiskScore: latestPrediction ? latestPrediction.riskScore : null
        };
      })
    );

    // Filter by risk level if specified
    let filteredStudents = studentsWithRisk;
    if (riskLevel) {
      filteredStudents = studentsWithRisk.filter(s => s.latestRisk === riskLevel);
    }

    // Search by name if specified
    if (search) {
      filteredStudents = filteredStudents.filter(s => 
        s.userId.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      success: true,
      count: filteredStudents.length,
      students: filteredStudents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private (Mentor, Admin)
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate({
        path: 'userId',
        select: 'name email phone assignedMentor',
        populate: { path: 'assignedMentor', select: 'name email phone' }
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check authorization for mentors
    if (req.user.role === 'mentor' && 
        student.userId.assignedMentor?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this student'
      });
    }

    // Get prediction history
    const predictions = await Prediction.find({ studentId: student._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      student,
      predictions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete student (and related data)
// @route   DELETE /api/students/:id
// @access  Private (Mentor, Admin)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('userId');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentUser = await User.findById(student.userId._id);
    if (!studentUser) {
      return res.status(404).json({
        success: false,
        message: 'Student user not found'
      });
    }

    // Mentors can only delete their assigned students
    if (
      req.user.role === 'mentor' &&
      studentUser.assignedMentor?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this student'
      });
    }

    await Prediction.deleteMany({ userId: studentUser._id });
    await Session.deleteMany({ studentId: studentUser._id });
    await Student.deleteOne({ _id: student._id });
    await User.deleteOne({ _id: studentUser._id });

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  getAllStudents,
  getStudentById,
  deleteStudent
};