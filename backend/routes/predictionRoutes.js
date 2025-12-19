const express = require('express');
const router = express.Router();
const {
  createPrediction,
  getPredictionHistory,
  getLatestPrediction,
  getPredictionById,
  exportPredictionsCSV
} = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('student'), createPrediction);
router.get('/history', protect, getPredictionHistory);
router.get('/latest', protect, authorize('student'), getLatestPrediction);
router.get('/export/csv', protect, authorize('mentor', 'admin'), exportPredictionsCSV);
router.get('/:id', protect, getPredictionById);

module.exports = router;