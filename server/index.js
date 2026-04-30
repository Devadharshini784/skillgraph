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