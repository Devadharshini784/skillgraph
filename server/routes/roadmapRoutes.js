const express = require('express');
const router = express.Router();
const { generateRoadmap, getRoadmap, completeWeek } = require('../controllers/roadmapController');
const protect = require('../middleware/authMiddleware');

router.post('/generate', protect, generateRoadmap);
router.get('/', protect, getRoadmap);
router.patch('/complete/:weekNo', protect, completeWeek);

module.exports = router;