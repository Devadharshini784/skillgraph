import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const skills = location.state?.skills || [];
  const role = location.state?.role || '';

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // If no skills passed, go back
  useEffect(() => {
    if (skills.length === 0) navigate('/dashboard');
  }, []);

  const currentSkill = skills[current];
  const progress = ((current) / skills.length) * 100;

  const handleAnswer = (confidence) => {
    const newAnswers = { ...answers, [currentSkill.skill]: confidence };
    setAnswers(newAnswers);

    if (current < skills.length - 1) {
      setCurrent(current + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const res = await API.post('/skills/quiz', {
        role,
        answers: finalAnswers,
        skills
      });
      setScore(res.data.readinessScore);
      setSubmitted(true);
    } catch (err) {
      console.error('Quiz submit error:', err);
      // Calculate score locally as fallback
      const known = Object.values(finalAnswers).filter(v => v === 2).length;
      const learning = Object.values(finalAnswers).filter(v => v === 1).length;
      const localScore = Math.round(((known + learning * 0.5) / skills.length) * 100);
      setScore(localScore);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div style={styles.container}>
        <div style={styles.center}>
          <p style={styles.loadingText}>⚡ Calculating your readiness score...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.resultCard}>
          <div style={styles.scoreCircle}>
            <p style={styles.scoreNum}>{score}%</p>
            <p style={styles.scoreLabel}>Readiness</p>
          </div>
          <h2 style={styles.resultTitle}>
            {score >= 70 ? '🔥 You\'re well prepared!' :
             score >= 40 ? '💪 Good foundation!' :
             '🚀 Great time to start learning!'}
          </h2>
          <p style={styles.resultSub}>
            You know <strong style={{color: '#a78bfa'}}>{score}%</strong> of what
            the market demands for <strong style={{color: '#a78bfa'}}>"{role}"</strong> roles.
          </p>

          {/* Breakdown */}
          <div style={styles.breakdown}>
            <div style={styles.breakdownItem}>
              <span style={{...styles.dot, background: '#34d399'}}></span>
              <span style={styles.breakdownText}>
                Know it: {Object.values(answers).filter(v => v === 2).length} skills
              </span>
            </div>
            <div style={styles.breakdownItem}>
              <span style={{...styles.dot, background: '#fbbf24'}}></span>
              <span style={styles.breakdownText}>
                Learning: {Object.values(answers).filter(v => v === 1).length} skills
              </span>
            </div>
            <div style={styles.breakdownItem}>
              <span style={{...styles.dot, background: '#f87171'}}></span>
              <span style={styles.breakdownText}>
                Need to learn: {Object.values(answers).filter(v => v === 0).length} skills
              </span>
            </div>
          </div>

          <button
            style={styles.doneBtn}
            onClick={() => navigate('/dashboard', { state: { score, role } })}
          >
            View My Roadmap →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={{color: '#e8e8f0'}}>Skill</span>
          <span style={{color: '#6e56f8'}}>Graph</span>
        </div>
        <span style={styles.roleTag}>{role}</span>
      </div>

      {/* Progress bar */}
      <div style={styles.progressWrap}>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${progress}%`}} />
        </div>
        <span style={styles.progressText}>{current + 1} of {skills.length}</span>
      </div>

      {/* Question card */}
      <div style={styles.questionCard}>
        <p style={styles.questionNum}>Skill #{current + 1}</p>
        <h2 style={styles.skillName}>{currentSkill?.skill}</h2>
        <p style={styles.questionText}>How well do you know this skill?</p>

        <div style={styles.optionsCol}>
          <button
            style={{...styles.optionBtn, ...styles.optionGreen}}
            onClick={() => handleAnswer(2)}
          >
            <span style={styles.optionIcon}>✅</span>
            <div>
              <p style={styles.optionTitle}>I know this well</p>
              <p style={styles.optionDesc}>I've used it in projects or work</p>
            </div>
          </button>

          <button
            style={{...styles.optionBtn, ...styles.optionAmber}}
            onClick={() => handleAnswer(1)}
          >
            <span style={styles.optionIcon}>📖</span>
            <div>
              <p style={styles.optionTitle}>I'm learning this</p>
              <p style={styles.optionDesc}>I know the basics but need more practice</p>
            </div>
          </button>

          <button
            style={{...styles.optionBtn, ...styles.optionRed}}
            onClick={() => handleAnswer(0)}
          >
            <span style={styles.optionIcon}>❌</span>
            <div>
              <p style={styles.optionTitle}>I don't know this yet</p>
              <p style={styles.optionDesc}>Haven't learned it yet</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0d0d0f', fontFamily: 'sans-serif', padding: '0' },
  center: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
  loadingText: { color: '#a78bfa', fontSize: '18px' },

  // Header
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #2a2a35' },
  logo: { fontSize: '20px', fontWeight: '700' },
  roleTag: { background: '#1a1040', color: '#a78bfa', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', border: '1px solid #3a2a8a' },

  // Progress
  progressWrap: { padding: '24px 40px 0', display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '700px', margin: '0 auto' },
  progressBar: { flex: 1, height: '6px', background: '#2a2a35', borderRadius: '3px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#6e56f8', borderRadius: '3px', transition: 'width 0.3s ease' },
  progressText: { color: '#7a7a90', fontSize: '13px', whiteSpace: 'nowrap', fontFamily: 'monospace' },

  // Question
  questionCard: { maxWidth: '700px', margin: '32px auto', padding: '0 40px' },
  questionNum: { color: '#7a7a90', fontSize: '12px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '8px' },
  skillName: { color: '#e8e8f0', fontSize: '36px', fontWeight: '700', marginBottom: '8px', textTransform: 'capitalize' },
  questionText: { color: '#7a7a90', fontSize: '15px', marginBottom: '32px' },

  // Options
  optionsCol: { display: 'flex', flexDirection: 'column', gap: '12px' },
  optionBtn: { display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', borderRadius: '12px', border: '1px solid', cursor: 'pointer', textAlign: 'left', transition: 'opacity 0.15s' },
  optionIcon: { fontSize: '24px', flexShrink: 0 },
  optionTitle: { color: '#e8e8f0', fontSize: '15px', fontWeight: '500', margin: '0 0 2px' },
  optionDesc: { color: '#7a7a90', fontSize: '12px', margin: 0 },
  optionGreen: { background: '#0d2a1e', borderColor: '#1d5c3a' },
  optionAmber: { background: '#2a1a00', borderColor: '#5c3a00' },
  optionRed: { background: '#2a0d0d', borderColor: '#5c1a1a' },

  // Result
  resultCard: { maxWidth: '600px', margin: '60px auto', padding: '40px', background: '#16161a', border: '1px solid #2a2a35', borderRadius: '20px', textAlign: 'center' },
  scoreCircle: { width: '140px', height: '140px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a1040, #0d0d0f)', border: '4px solid #6e56f8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' },
  scoreNum: { color: '#6e56f8', fontSize: '40px', fontWeight: '800', margin: 0 },
  scoreLabel: { color: '#7a7a90', fontSize: '12px', margin: 0 },
  resultTitle: { color: '#e8e8f0', fontSize: '22px', fontWeight: '700', marginBottom: '12px' },
  resultSub: { color: '#7a7a90', fontSize: '15px', marginBottom: '28px', lineHeight: '1.6' },
  breakdown: { display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' },
  breakdownItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' },
  breakdownText: { color: '#7a7a90', fontSize: '13px' },
  doneBtn: { background: '#6e56f8', color: 'white', border: 'none', borderRadius: '10px', padding: '14px 32px', fontSize: '15px', cursor: 'pointer', fontWeight: '500' },
};