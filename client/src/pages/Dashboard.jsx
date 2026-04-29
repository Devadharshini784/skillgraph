import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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

      {/* Main content */}
      <div style={styles.main}>
        {/* Welcome banner */}
        <div style={styles.banner}>
          <div>
            <h1 style={styles.bannerTitle}>Welcome back, {user?.name}! 👋</h1>
            <p style={styles.bannerSub}>Let's build your personalized skill roadmap today.</p>
          </div>
          <div style={styles.readinessBox}>
            <p style={styles.readinessNum}>0%</p>
            <p style={styles.readinessLabel}>Readiness Score</p>
          </div>
        </div>

        {/* Cards row */}
        <div style={styles.cardRow}>
          <div style={styles.card}>
            <div style={styles.cardIcon}>🎯</div>
            <h3 style={styles.cardTitle}>Set Target Role</h3>
            <p style={styles.cardDesc}>Tell us what job you're aiming for and we'll analyse real job descriptions for you.</p>
            <button style={styles.cardBtn}>Get Started →</button>
          </div>

          <div style={styles.card}>
            <div style={styles.cardIcon}>📊</div>
            <h3 style={styles.cardTitle}>Skill Gap Quiz</h3>
            <p style={styles.cardDesc}>Answer 10 quick questions to identify which skills you already know and which you need.</p>
            <button style={{...styles.cardBtn, ...styles.cardBtnDisabled}} disabled>Coming soon</button>
          </div>

          <div style={styles.card}>
            <div style={styles.cardIcon}>🗺️</div>
            <h3 style={styles.cardTitle}>Your Roadmap</h3>
            <p style={styles.cardDesc}>Get a week-by-week learning plan with curated free resources for each skill.</p>
            <button style={{...styles.cardBtn, ...styles.cardBtnDisabled}} disabled>Coming soon</button>
          </div>
        </div>

        {/* Bottom section */}
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
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0d0d0f', fontFamily: 'sans-serif' },
  
  // Header
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #2a2a35' },
  logo: { fontSize: '22px', fontWeight: '700' },
  logoText: { color: '#e8e8f0' },
  logoAccent: { color: '#6e56f8' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  userEmail: { color: '#7a7a90', fontSize: '14px' },
  logoutBtn: { background: 'transparent', border: '1px solid #2a2a35', color: '#7a7a90', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },

  // Main
  main: { padding: '40px', maxWidth: '1100px', margin: '0 auto' },

  // Banner
  banner: { background: 'linear-gradient(135deg, #1a1040 0%, #16161a 100%)', border: '1px solid #3a2a8a', borderRadius: '16px', padding: '32px 40px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  bannerTitle: { color: '#e8e8f0', fontSize: '28px', fontWeight: '700', marginBottom: '8px' },
  bannerSub: { color: '#7a7a90', fontSize: '15px' },
  readinessBox: { textAlign: 'center', background: '#0d0d0f', borderRadius: '12px', padding: '20px 32px', border: '1px solid #2a2a35' },
  readinessNum: { color: '#6e56f8', fontSize: '36px', fontWeight: '800', margin: '0' },
  readinessLabel: { color: '#7a7a90', fontSize: '12px', margin: '4px 0 0' },

  // Cards
  cardRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' },
  card: { background: '#16161a', border: '1px solid #2a2a35', borderRadius: '16px', padding: '28px' },
  cardIcon: { fontSize: '28px', marginBottom: '16px' },
  cardTitle: { color: '#e8e8f0', fontSize: '17px', fontWeight: '600', marginBottom: '10px' },
  cardDesc: { color: '#7a7a90', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' },
  cardBtn: { background: '#6e56f8', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' },
  cardBtnDisabled: { background: '#2a2a35', color: '#7a7a90', cursor: 'not-allowed' },

  // Bottom
  bottomCard: { background: '#16161a', border: '1px solid #2a2a35', borderRadius: '16px', padding: '28px 40px' },
  bottomTitle: { color: '#e8e8f0', fontSize: '16px', fontWeight: '600', marginBottom: '24px' },
  steps: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  step: { display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '140px' },
  stepNum: { background: '#6e56f8', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: '0' },
  stepText: { color: '#7a7a90', fontSize: '13px', lineHeight: '1.4' },
  stepArrow: { color: '#3a3a48', fontSize: '20px', flexShrink: '0' },
};