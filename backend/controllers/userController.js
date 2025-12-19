const User = require('../models/User');
const Student = require('../models/Student');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = { isActive: true };

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .populate('assignedMentor', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all mentors
// @route   GET /api/users/mentors
// @access  Private (Admin)
const getAllMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor', isActive: true })
      .select('name email phone');

    res.json({
      success: true,
      count: mentors.length,
      mentors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Admin)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone
    });

    // If student, create student profile
    if (user.role === 'student') {
      await Student.create({
        userId: user._id,
        studentId: `STU${Date.now().toString().slice(-8)}`,
        currentGrade: 'Not Set',
        gpa: 0,
        attendance: 0,
        parentalSupport: 'medium',
        familyIncome: 'medium',
        studyHoursPerWeek: 0
      });
    }

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const { name, email, role, phone, isActive, assignedMentor } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (phone !== undefined) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;
    if (assignedMentor !== undefined) user.assignedMentor = assignedMentor || null;

    await user.save();

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Assign mentor to student
// @route   PUT /api/users/:studentId/assign-mentor
// @access  Private (Admin)
const assignMentor = async (req, res) => {
  try {
    const { mentorId } = req.body;
    const studentId = req.params.studentId;

    const student = await User.findById(studentId);
    const mentor = await User.findById(mentorId);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    student.assignedMentor = mentorId;
    await student.save();

    res.json({
      success: true,
      message: 'Mentor assigned successfully',
      student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getAllMentors,
  createUser,
  updateUser,
  deleteUser,
  assignMentor
};