const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'SkillGraph API is running 🚀' });
});

const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/roadmap', roadmapRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Keep alive ping — prevents Render free tier from sleeping
const https = require('https');
setInterval(() => {
  https.get('https://skillgraph-api.onrender.com', (res) => {
    console.log('Keep alive ping sent');
  }).on('error', (err) => {
    console.log('Keep alive error:', err.message);
  });
}, 14 * 60 * 1000);