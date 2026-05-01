const pool = require('../config/db');
const dependencies = require('../data/dependencies.json');
const resources = require('../data/resources.json');

const getResources = (skillName) => {
  const key = skillName.toLowerCase();
  return resources[key] || resources['default'].map(r => ({
    ...r,
    url: r.url + skillName
  }));
};

 const generateRoadmap = async (req, res) => {
  const userId = req.user.id;
  const skills = req.body?.skills || [];
  const role = req.body?.role || '';

  try {
    await pool.query('DELETE FROM roadmap_weeks WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM user_skills WHERE user_id = $1', [userId]); 
    if (!skills || skills.length === 0) {
      return res.json({ message: 'No skills provided', weeks: [] });
    }

    const skillNames = skills.map(s => s.skill);
    const orderedSkills = topologicalSort(skillNames);
    const weeks = [];
    let weekNum = 1;

    for (let i = 0; i < orderedSkills.length && weekNum <= 12; i++) {
      const skillName = orderedSkills[i];
      const skillItem = skills.find(s => s.skill === skillName);
      if (!skillItem) continue;

      let skillRecord = await pool.query('SELECT id FROM skills WHERE name = $1', [skillName]);
      let skillId;
      if (skillRecord.rows.length === 0) {
        const newSkill = await pool.query(
          'INSERT INTO skills (name, frequency_score) VALUES ($1, $2) RETURNING id',
          [skillName, skillItem.count || 0]
        );
        skillId = newSkill.rows[0].id;
      } else {
        skillId = skillRecord.rows[0].id;
      }

      await pool.query(
        'INSERT INTO roadmap_weeks (user_id, week_no, skill_id, resource_url) VALUES ($1, $2, $3, $4)',
        [userId, weekNum, skillId, getResources(skillName)[0]?.url || '']
      );

      weeks.push({
        week: weekNum,
        skills: [{ skill: skillName, resources: getResources(skillName) }],
        completed: false
      });
      weekNum++;
    }

    await pool.query('UPDATE users SET target_role = $1 WHERE id = $2', [role, userId]);
    res.json({ totalWeeks: weeks.length, weeks });

  } catch (error) {
    console.error('Generate roadmap error:', error.message);
    res.status(500).json({ message: 'Failed to generate roadmap' });
  }
};

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

    if (result.rows.length === 0) return res.json({ weeks: [] });

    const weeksMap = {};
    result.rows.forEach(row => {
      if (!weeksMap[row.week_no]) {
        weeksMap[row.week_no] = { week: row.week_no, completed: row.completed, skills: [] };
      }
      weeksMap[row.week_no].skills.push({
        skill: row.skill_name,
        resources: getResources(row.skill_name)
      });
    });

    res.json({ totalWeeks: Object.keys(weeksMap).length, weeks: Object.values(weeksMap) });
  } catch (error) {
    console.error('Get roadmap error:', error.message);
    res.status(500).json({ message: 'Failed to get roadmap' });
  }
};

const completeWeek = async (req, res) => {
  const userId = req.user.id;
  const { weekNo } = req.params;
  try {
    await pool.query(
      'UPDATE roadmap_weeks SET completed = true WHERE user_id = $1 AND week_no = $2',
      [userId, weekNo]
    );
    res.json({ message: 'Week ' + weekNo + ' marked as complete!' });
  } catch (error) {
    console.error('Complete week error:', error.message);
    res.status(500).json({ message: 'Failed to update week' });
  }
};

const topologicalSort = (skills) => {
  const visited = new Set();
  const result = [];
  const visit = (skill) => {
    if (visited.has(skill)) return;
    visited.add(skill);
    const deps = dependencies[skill.toLowerCase()] || [];
    deps.forEach(dep => { if (skills.includes(dep)) visit(dep); });
    result.push(skill);
  };
  skills.forEach(skill => visit(skill));
  return result;
};

module.exports = { generateRoadmap, getRoadmap, completeWeek };