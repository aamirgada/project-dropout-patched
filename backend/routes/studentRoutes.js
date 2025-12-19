const express = require('express');
const router = express.Router();
const {
  getStudentProfile,
  updateStudentProfile,
  getAllStudents,
  getStudentById,
  deleteStudent
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/profile', protect, authorize('student'), getStudentProfile);
router.post('/profile', protect, authorize('student'), updateStudentProfile);
router.get('/', protect, authorize('mentor', 'admin'), getAllStudents);
router.get('/:id', protect, authorize('mentor', 'admin'), getStudentById);
router.delete('/:id', protect, authorize('mentor', 'admin'), deleteStudent);

module.exports = router;