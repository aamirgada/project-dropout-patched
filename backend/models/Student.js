const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  // Academic Information
  currentGrade: {
    type: String,
    default: 'Not Set'
  },
  gpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  attendance: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  previousGrades: [{
    semester: String,
    gpa: Number
  }],
  
  // Behavioral Indicators
  disciplinaryActions: {
    type: Number,
    default: 0,
    min: 0
  },
  extracurricularActivities: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Family & Social Support
  parentalSupport: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  familyIncome: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  workingHours: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Health & Wellbeing
  healthIssues: {
    type: Boolean,
    default: false
  },
  mentalHealthSupport: {
    type: Boolean,
    default: false
  },
  
  // Academic Support
  tutoringHours: {
    type: Number,
    default: 0,
    min: 0
  },
  studyHoursPerWeek: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Transportation & Access
  transportationIssues: {
    type: Boolean,
    default: false
  },
  internetAccess: {
    type: Boolean,
    default: true
  },
  
  // Other
  notes: {
    type: String,
    default: ''
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Student', studentSchema);