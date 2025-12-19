const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllMentors,
  createUser,
  updateUser,
  deleteUser,
  assignMentor
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.get('/mentors', getAllMentors);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:studentId/assign-mentor', assignMentor);

module.exports = router;