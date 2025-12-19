const Prediction = require('../models/Prediction');
const Student = require('../models/Student');
const { calculateRiskScore, getRiskLevel, generateRecommendations } = require('../utils/riskEngine');

// @desc    Create new prediction
// @route   POST /api/predictions
// @access  Private
const createPrediction = async (req, res) => {
  try {
    // Get student profile
    const student = await Student.findOne({ userId: req.user.id });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found. Please complete your profile first.'
      });
    }

    // Calculate risk score
    const { riskScore, factors } = calculateRiskScore(student.toObject());
    const riskLevel = getRiskLevel(riskScore);
    const recommendations = generateRecommendations(student.toObject(), riskScore, factors);

    // Create prediction
    const prediction = await Prediction.create({
      studentId: student._id,
      userId: req.user.id,
      riskLevel,
      riskScore,
      factors,
      recommendations,
      inputData: student.toObject()
    });

    res.status(201).json({
      success: true,
      prediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get prediction history
// @route   GET /api/predictions/history
// @access  Private
const getPredictionHistory = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Students see only their own predictions
    if (req.user.role === 'student') {
      query.userId = req.user.id;
    }
    // Mentors see predictions of assigned students
    else if (req.user.role === 'mentor') {
      const User = require('../models/User');
      const assignedStudents = await User.find({ 
        assignedMentor: req.user.id,
        role: 'student' 
      }).select('_id');
      query.userId = { $in: assignedStudents.map(s => s._id) };
    }
    // Admins see all

    const predictions = await Prediction.find(query)
      .populate('userId', 'name email')
      .populate('studentId', 'studentId currentGrade')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Prediction.countDocuments(query);

    res.json({
      success: true,
      count: predictions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      predictions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get latest prediction
// @route   GET /api/predictions/latest
// @access  Private (Student)
const getLatestPrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('studentId', 'studentId currentGrade gpa attendance');

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'No predictions found. Generate your first prediction.'
      });
    }

    res.json({
      success: true,
      prediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get prediction by ID
// @route   GET /api/predictions/:id
// @access  Private
const getPredictionById = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('studentId', 'studentId currentGrade gpa attendance');

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    // Authorization check
    if (req.user.role === 'student' && prediction.userId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      prediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Export predictions to CSV
// @route   GET /api/predictions/export/csv
// @access  Private (Mentor, Admin)
const exportPredictionsCSV = async (req, res) => {
  try {
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const path = require('path');
    const fs = require('fs');

    let query = {};
    if (req.user.role === 'mentor') {
      const User = require('../models/User');
      const assignedStudents = await User.find({ 
        assignedMentor: req.user.id,
        role: 'student' 
      }).select('_id');
      query.userId = { $in: assignedStudents.map(s => s._id) };
    }

    const predictions = await Prediction.find(query)
      .populate('userId', 'name email')
      .populate('studentId', 'studentId currentGrade gpa attendance')
      .sort({ createdAt: -1 });

    const csvPath = path.join(__dirname, '..', 'exports', `predictions_${Date.now()}.csv`);
    
    // Ensure exports directory exists
    const exportDir = path.join(__dirname, '..', 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    const csvWriter = createCsvWriter({
      path: csvPath,
      header: [
        { id: 'studentId', title: 'Student ID' },
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'riskLevel', title: 'Risk Level' },
        { id: 'riskScore', title: 'Risk Score' },
        { id: 'gpa', title: 'GPA' },
        { id: 'attendance', title: 'Attendance' },
        { id: 'date', title: 'Prediction Date' }
      ]
    });

    const records = predictions.map(p => ({
      studentId: p.studentId?.studentId || 'N/A',
      name: p.userId?.name || 'N/A',
      email: p.userId?.email || 'N/A',
      riskLevel: p.riskLevel,
      riskScore: p.riskScore,
      gpa: p.studentId?.gpa || 'N/A',
      attendance: p.studentId?.attendance || 'N/A',
      date: p.createdAt.toISOString().split('T')[0]
    }));

    await csvWriter.writeRecords(records);

    res.download(csvPath, `predictions_${Date.now()}.csv`, (err) => {
      if (err) {
        console.error(err);
      }
      // Clean up file after download
      fs.unlinkSync(csvPath);
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createPrediction,
  getPredictionHistory,
  getLatestPrediction,
  getPredictionById,
  exportPredictionsCSV
};