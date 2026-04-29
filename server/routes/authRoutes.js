const express = require('express');
const router = express.Router();

// Placeholder — we'll add real routes next
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route works!' });
});

module.exports = router;