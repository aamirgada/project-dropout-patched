const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  factors: {
    academic: { type: Number, default: 0 },
    behavioral: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    support: { type: Number, default: 0 }
  },
  recommendations: [{
    category: String,
    suggestion: String,
    priority: String
  }],
  inputData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
predictionSchema.index({ userId: 1, createdAt: -1 });
predictionSchema.index({ riskLevel: 1 });

module.exports = mongoose.model('Prediction', predictionSchema);