const express = require('express');
const router = express.Router();
const { extractSkills } = require('../controllers/skillController');
const { submitQuiz } = require('../controllers/quizController');
const protect = require('../middleware/authMiddleware');

router.get('/extract', protect, extractSkills);
router.post('/quiz', protect, submitQuiz);

module.exports = router;