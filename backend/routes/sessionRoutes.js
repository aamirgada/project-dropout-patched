const express = require('express');
const router = express.Router();
const {
  createSession,
  createSessionForStudent,
  getStudentSessions,
  getMentorSessions,
  getPendingSessions,
  approveSession,
  rejectSession,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('student'), createSession);
router.post('/book', protect, authorize('mentor', 'admin'), createSessionForStudent);
router.get('/student', protect, authorize('student'), getStudentSessions);
router.get('/mentor', protect, authorize('mentor'), getMentorSessions);
router.get('/mentor/pending', protect, authorize('mentor'), getPendingSessions);
router.put('/:id/approve', protect, authorize('mentor'), approveSession);
router.put('/:id/reject', protect, authorize('mentor'), rejectSession);

module.exports = router;

