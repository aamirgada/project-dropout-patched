const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'mentor', 'admin']).withMessage('Invalid role')
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const validateStudent = [
  body('studentId').trim().notEmpty().withMessage('Student ID is required'),
  body('gpa').isFloat({ min: 0, max: 10 }).withMessage('GPA must be between 0 and 10'),
  body('attendance').isFloat({ min: 0, max: 100 }).withMessage('Attendance must be between 0 and 100'),
  body('parentalSupport').isIn(['low', 'medium', 'high']).withMessage('Invalid parental support value'),
  body('familyIncome').isIn(['low', 'medium', 'high']).withMessage('Invalid family income value'),
  body('studyHoursPerWeek').isFloat({ min: 0 }).withMessage('Study hours must be positive')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateStudent,
  handleValidationErrors
};