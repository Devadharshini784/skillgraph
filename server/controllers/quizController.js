const pool = require('../config/db');

const submitQuiz = async (req, res) => {
  const { role, answers, skills } = req.body;
  const userId = req.user.id;

  try {
    // Calculate readiness score
    let totalWeight = 0;
    let earnedWeight = 0;

    skills.forEach((skillItem, index) => {
      const weight = skills.length - index;
      totalWeight += weight;
      const confidence = answers[skillItem.skill] ?? 0;
      earnedWeight += weight * (confidence / 2);
    });

    const readinessScore = Math.round((earnedWeight / totalWeight) * 100);

    // Save each skill to DB
    for (const skillItem of skills) {
      const confidence = answers[skillItem.skill] ?? 0;
      const status = confidence === 2 ? 'known' : confidence === 1 ? 'learning' : 'todo';

      // Find or create skill
      let skillRecord = await pool.query('SELECT id FROM skills WHERE name = $1', [skillItem.skill]);
      let skillId;

      if (skillRecord.rows.length === 0) {
        const newSkill = await pool.query(
          'INSERT INTO skills (name, frequency_score) VALUES ($1, $2) RETURNING id',
          [skillItem.skill, skillItem.count]
        );
        skillId = newSkill.rows[0].id;
      } else {
        skillId = skillRecord.rows[0].id;
      }

      // Save user skill
      await pool.query(`
        INSERT INTO user_skills (user_id, skill_id, status, confidence)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, skill_id)
        DO UPDATE SET status = $3, confidence = $4, updated_at = NOW()
      `, [userId, skillId, status, confidence]);
    }

    // Update target role
    await pool.query('UPDATE users SET target_role = $1 WHERE id = $2', [role, userId]);

    console.log(`Quiz saved for user ${userId} — score: ${readinessScore}%`);

    res.json({ message: 'Quiz submitted!', readinessScore });

  } catch (error) {
    console.error('Quiz submit error:', error.message);
    res.status(500).json({ message: 'Failed to save quiz results' });
  }
};

module.exports = { submitQuiz };