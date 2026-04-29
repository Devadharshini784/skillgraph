import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExtract = async () => {
    if (!role.trim()) return;
    setLoading(true);
    setError('');
    setSkills([]);
    try {
      const res = await API.get(`/skills/extract?role=${role}`);
      setSkills(res.data.skills);
      setSearched(true);
    } catch (err) {
      setError('Failed to fetch skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoText}>Skill</span>
          <span style={styles.logoAccent}>Graph</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.userEmail}>{user?.email}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.main}>
        {/* Welcome banner */}
        <div style={styles.banner}>
          <div>
            <h1 style={styles.bannerTitle}>Welcome back, {user?.name}! 👋</h1>
            <p style={styles.bannerSub}>Enter your target role to get your personalized skill roadmap.</p>
          </div>
          <div style={styles.readinessBox}>
            <p style={styles.readinessNum}>{skills.length > 0 ? skills.length : 0}</p>
            <p style={styles.readinessLabel}>Skills Found</p>
          </div>
        </div>

        {/* Role input */}
        <div style={styles.searchBox}>
          <h2 style={styles.searchTitle}>🎯 What role are you targeting?</h2>
          <p style={styles.searchSub}>Examples: "Backend Engineer", "Frontend Developer", "Full Stack Developer"</p>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g. Backend Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
            />
            <button
              style={loading ? {...styles.searchBtn, opacity: 0.7} : styles.searchBtn}
              onClick={handleExtract}
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Role →'}
            </button>
          </div>
          {error && <p style={styles.error}>{error}</p>}
        </div>

        {/* Loading state */}
        {loading && (
          <div style={styles.loadingBox}>
            <p style={styles.loadingText}>🔍 Scraping job descriptions and extracting skills...</p>
          </div>
        )}

        {/* Skills results */}
        {searched && !loading && skills.length > 0 && (
          <div style={styles.resultsBox}>
            <h2 style={styles.resultsTitle}>
              Top skills for <span style={{color: '#a78bfa'}}>"{role}"</span>
            </h2>
            <p style={styles.resultsSub}>Based on real job descriptions — sorted by demand</p>
            <div style={styles.skillsGrid}>
              {skills.map((item, index) => (
                <div key={index} style={styles.skillCard}>
                  <div style={styles.skillRank}>#{index + 1}</div>
                  <div style={styles.skillName}>{item.skill}</div>
                  <div style={styles.skillBar}>
                    <div style={{
                      ...styles.skillBarFill,
                      width: `${Math.min((item.count / skills[0].count) * 100, 100)}%`
                    }}/>
                  </div>
                  <div style={styles.skillCount}>{item.count} mentions</div>
                </div>
              ))}
            </div>
            <button 
  style={styles.quizBtn} 
  onClick={() => navigate('/quiz', { state: { skills, role } })}
>
  Take Skill Gap Quiz →
</button>
          </div>
        )}

        {/* How it works — show only before search */}
        {!searched && (
          <div style={styles.bottomCard}>
            <h3 style={styles.bottomTitle}>📈 How SkillGraph works</h3>
            <div style={styles.steps}>
              <div style={styles.step}>
                <div style={styles.stepNum}>1</div>
                <p style={styles.stepText}>Enter your target job role</p>
              </div>
              <div style={styles.stepArrow}>→</div>
              <div style={styles.step}>
                <div style={styles.stepNum}>2</div>
                <p style={styles.stepText}>We scrape real job descriptions</p>
              </div>
              <div style={styles.stepArrow}>→</div>
              <div style={styles.step}>
                <div style={styles.stepNum}>3</div>
                <p style={styles.stepText}>Take a skill gap quiz</p>
              </div>
              <div style={styles.stepArrow}>→</div>
              <div style={styles.step}>
                <div style={styles.stepNum}>4</div>
                <p style={styles.stepText}>Get your 12-week roadmap</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0d0d0f', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #2a2a35' },
  logo: { fontSize: '22px', fontWeight: '700' },
  logoText: { color: '#e8e8f0' },
  logoAccent: { color: '#6e56f8' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  userEmail: { color: '#7a7a90', fontSize: '14px' },
  logoutBtn: { background: 'transparent', border: '1px solid #2a2a35', color: '#7a7a90', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  main: { padding: '40px', maxWidth: '1100px', margin: '0 auto' },
  banner: { background: 'linear-gradient(135deg, #1a1040 0%, #16161a 100%)', border: '1px solid #3a2a8a', borderRadius: '16px', padding: '32px 40px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  bannerTitle: { color: '#e8e8f0', fontSize: '28px', fontWeight: '700', marginBottom: '8px' },
  bannerSub: { color: '#7a7a90', fontSize: '15px' },
  readinessBox: { textAlign: 'center', background: '#0d0d0f', borderRadius: '12px', padding: '20px 32px', border: '1px solid #2a2a35' },
  readinessNum: { color: '#6e56f8', fontSize: '36px', fontWeight: '800', margin: '0' },
  readinessLabel: { color: '#7a7a90', fontSize: '12px', margin: '4px 0 0' },
  searchBox: { background: '#16161a', border: '1px solid #2a2a35', borderRadius: '16px', padding: '32px', marginBottom: '24px' },
  searchTitle: { color: '#e8e8f0', fontSize: '20px', fontWeight: '600', marginBottom: '8px' },
  searchSub: { color: '#7a7a90', fontSize: '13px', marginBottom: '20px' },
  inputRow: { display: 'flex', gap: '12px' },
  input: { flex: 1, padding: '12px 16px', background: '#0d0d0f', border: '1px solid #2a2a35', borderRadius: '8px', color: '#e8e8f0', fontSize: '15px' },
  searchBtn: { background: '#6e56f8', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' },
  error: { color: '#f87171', fontSize: '13px', marginTop: '8px' },
  loadingBox: { background: '#16161a', border: '1px solid #2a2a35', borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '24px' },
  loadingText: { color: '#a78bfa', fontSize: '14px' },
  resultsBox: { background: '#16161a', border: '1px solid #2a2a35', borderRadius: '16px', padding: '32px', marginBottom: '24px' },
  resultsTitle: { color: '#e8e8f0', fontSize: '20px', fontWeight: '600', marginBottom: '6px' },
  resultsSub: { color: '#7a7a90', fontSize: '13px', marginBottom: '24px' },
  skillsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', marginBottom: '24px' },
  skillCard: { background: '#0d0d0f', border: '1px solid #2a2a35', borderRadius: '10px', padding: '14px 16px' },
  skillRank: { fontSize: '11px', color: '#7a7a90', fontFamily: 'monospace', marginBottom: '4px' },
  skillName: { color: '#e8e8f0', fontSize: '15px', fontWeight: '500', marginBottom: '8px', textTransform: 'capitalize' },
  skillBar: { background: '#2a2a35', borderRadius: '4px', height: '4px', marginBottom: '6px', overflow: 'hidden' },
  skillBarFill: { background: '#6e56f8', height: '100%', borderRadius: '4px', transition: 'width 0.5s ease' },
  skillCount: { fontSize: '11px', color: '#7a7a90' },
  quizBtn: { background: '#6e56f8', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' },
  bottomCard: { background: '#16161a', border: '1px solid #2a2a35', borderRadius: '16px', padding: '28px 40px' },
  bottomTitle: { color: '#e8e8f0', fontSize: '16px', fontWeight: '600', marginBottom: '24px' },
  steps: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  step: { display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '140px' },
  stepNum: { background: '#6e56f8', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: '0' },
  stepText: { color: '#7a7a90', fontSize: '13px', lineHeight: '1.4' },
  stepArrow: { color: '#3a3a48', fontSize: '20px', flexShrink: '0' },
};