const express = require('express');
const router = express.Router();
const {
  getStudentDashboard,
  getMentorDashboard,
  getAdminDashboard
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/student', protect, authorize('student'), getStudentDashboard);
router.get('/mentor', protect, authorize('mentor'), getMentorDashboard);
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

module.exports = router;