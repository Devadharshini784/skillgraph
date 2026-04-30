const pool = require('../config/db');
const dependencies = require('../data/dependencies.json');
const resources = require('../data/resources.json');

// Get resources for a skill
const getResources = (skillName) => {
  const key = skillName.toLowerCase();
  return resources[key] || resources['default'].map(r => ({
    ...r,
    url: r.url + skillName
  }));
};

// Generate 12-week roadmap from user's skill gaps
const generateRoadmap = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get user's skill gaps (todo + learning skills)
    const gapSkills = await pool.query(`
      SELECT us.skill_id, us.status, us.confidence, s.name, s.frequency_score
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.user_id = $1 AND us.status != 'known'
      ORDER BY s.frequency_score DESC
    `, [userId]);

    if (gapSkills.rows.length === 0) {
      return res.json({
        message: 'No skill gaps found. Take the quiz first!',
        weeks: []
      });
    }

    // Sort skills respecting dependencies
    const skillNames = gapSkills.rows.map(r => r.name);
    const orderedSkills = topologicalSort(skillNames);

    // Assign skills to weeks (1-2 skills per week)
    const weeks = [];
    let weekNum = 1;
    let i = 0;

    while (i < orderedSkills.length && weekNum <= 12) {
      const weekSkills = orderedSkills.slice(i, i + 1); // 1 skill per week
      const skillData = weekSkills.map(skillName => {
        const skillInfo = gapSkills.rows.find(r => r.name === skillName);
        return {
          skill: skillName,
          status: skillInfo?.status || 'todo',
          resources: getResources(skillName)
        };
      });

      weeks.push({
        week: weekNum,
        skills: skillData,
        completed: false
      });

      // Save to roadmap_weeks table
      for (const skill of weekSkills) {
        const skillInfo = gapSkills.rows.find(r => r.name === skill);
        if (skillInfo) {
          await pool.query(`
            INSERT INTO roadmap_weeks (user_id, week_no, skill_id, resource_url)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
          `, [userId, weekNum, skillInfo.skill_id, getResources(skill)[0]?.url || '']);
        }
      }

      i++;
      weekNum++;
    }

    res.json({
      totalWeeks: weeks.length,
      weeks
    });

  } catch (error) {
    console.error('Generate roadmap error:', error.message);
    res.status(500).json({ message: 'Failed to generate roadmap' });
  }
};

// Get saved roadmap
const getRoadmap = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(`
      SELECT rw.week_no, rw.completed, rw.resource_url, s.name as skill_name
      FROM roadmap_weeks rw
      JOIN skills s ON rw.skill_id = s.id
      WHERE rw.user_id = $1
      ORDER BY rw.week_no ASC
    `, [userId]);

    if (result.rows.length === 0) {
      return res.json({ weeks: [] });
    }

    // Group by week
    const weeksMap = {};
    result.rows.forEach(row => {
      if (!weeksMap[row.week_no]) {
        weeksMap[row.week_no] = {
          week: row.week_no,
          completed: row.completed,
          skills: []
        };
      }
      weeksMap[row.week_no].skills.push({
        skill: row.skill_name,
        resources: getResources(row.skill_name),
        resourceUrl: row.resource_url
      });
    });

    const weeks = Object.values(weeksMap);
    res.json({ totalWeeks: weeks.length, weeks });

  } catch (error) {
    console.error('Get roadmap error:', error.message);
    res.status(500).json({ message: 'Failed to get roadmap' });
  }
};

// Mark a week as complete
const completeWeek = async (req, res) => {
  const userId = req.user.id;
  const { weekNo } = req.params;

  try {
    await pool.query(`
      UPDATE roadmap_weeks SET completed = true
      WHERE user_id = $1 AND week_no = $2
    `, [userId, weekNo]);

    res.json({ message: `Week ${weekNo} marked as complete!` });
  } catch (error) {
    console.error('Complete week error:', error.message);
    res.status(500).json({ message: 'Failed to update week' });
  }
};

// Simple topological sort for skill dependencies
const topologicalSort = (skills) => {
  const visited = new Set();
  const result = [];

  const visit = (skill) => {
    if (visited.has(skill)) return;
    visited.add(skill);
    const deps = dependencies[skill.toLowerCase()] || [];
    deps.forEach(dep => {
      if (skills.includes(dep)) visit(dep);
    });
    result.push(skill);
  };

  skills.forEach(skill => visit(skill));
  return result;
};

module.exports = { generateRoadmap, getRoadmap, completeWeek };