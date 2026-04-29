const express = require('express');
const router = express.Router();
const { extractSkills } = require('../controllers/skillController');
const protect = require('../middleware/authMiddleware');

router.get('/extract', protect, extractSkills);

module.exports = router;