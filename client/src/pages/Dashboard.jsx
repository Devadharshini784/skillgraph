import { useState, useEffect } from 'react';
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
  const [savedRoadmap, setSavedRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(true);

  useEffect(() => {
    fetchSavedRoadmap();
  }, []);

  const fetchSavedRoadmap = async () => {
    try {
      const res = await API.get('/roadmap');
      if (res.data.weeks && res.data.weeks.length > 0) {
        setSavedRoadmap(res.data);
      }
    } catch (err) {
      console.error('Fetch roadmap error:', err);
    } finally {
      setRoadmapLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleExtract = async () => {
    if (!role.trim()) return;
    setLoading(true);
    setError('');
    setSkills([]);
    setSearched(false);
    try {
      const res = await API.get('/skills/extract?role=' + role);
      if (res.data.skills.length === 0) {
        setError(res.data.message || 'Role not recognized. Try: Backend Engineer, Frontend Developer');
      } else {
        setSkills(res.data.skills);
        setSearched(true);
      }
    } catch (err) {
      setError('Failed to fetch skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const completedCount = savedRoadmap ? savedRoadmap.weeks.filter(w => w.completed).length : 0;
  const totalWeeks = savedRoadmap ? savedRoadmap.weeks.length : 0;
  const progressPercent = totalWeeks > 0 ? Math.round((completedCount / totalWeeks) * 100) : 0;

  return (
    <div style={{minHeight:'100vh',background:'#0d0d0f',fontFamily:'sans-serif'}}>

      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',borderBottom:'1px solid #2a2a35'}}>
        <div style={{fontSize:'22px',fontWeight:'700'}}>
          <span style={{color:'#e8e8f0'}}>Skill</span>
          <span style={{color:'#6e56f8'}}>Graph</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <span style={{color:'#7a7a90',fontSize:'14px'}}>{user?.email}</span>
          <button onClick={handleLogout} style={{background:'transparent',border:'1px solid #2a2a35',color:'#7a7a90',padding:'8px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'13px'}}>
            Logout
          </button>
        </div>
      </div>

      <div style={{padding:'40px',maxWidth:'1100px',margin:'0 auto'}}>

        {/* Welcome banner */}
        <div style={{background:'linear-gradient(135deg,#1a1040,#16161a)',border:'1px solid #3a2a8a',borderRadius:'16px',padding:'32px 40px',marginBottom:'32px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'24px'}}>
          <div>
            <h1 style={{color:'#e8e8f0',fontSize:'28px',fontWeight:'700',marginBottom:'8px'}}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p style={{color:'#7a7a90',fontSize:'15px'}}>
              {savedRoadmap ? 'Your learning journey is in progress.' : 'Start by analyzing your target role below.'}
            </p>
          </div>
          <div style={{textAlign:'center',background:'#0d0d0f',borderRadius:'12px',padding:'20px 32px',border:'1px solid #2a2a35'}}>
            <p style={{color:'#6e56f8',fontSize:'36px',fontWeight:'800',margin:'0'}}>{progressPercent}%</p>
            <p style={{color:'#7a7a90',fontSize:'12px',margin:'4px 0 0'}}>Roadmap Progress</p>
          </div>
        </div>

        {/* Saved roadmap card — shows if roadmap exists */}
        {!roadmapLoading && savedRoadmap && (
          <div style={{background:'#16161a',border:'1px solid #1d5c3a',borderRadius:'16px',padding:'28px 32px',marginBottom:'32px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px'}}>
              <div>
                <p style={{color:'#34d399',fontSize:'12px',fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'.1em',margin:'0 0 6px'}}>
                  ✅ Active Learning Plan
                </p>
                <h2 style={{color:'#e8e8f0',fontSize:'20px',fontWeight:'700',margin:'0 0 6px'}}>
                  Your 12-Week Roadmap
                </h2>
                <p style={{color:'#7a7a90',fontSize:'13px',margin:'0'}}>
                  {completedCount} of {totalWeeks} weeks completed
                </p>
              </div>

              <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
                <div style={{display:'flex',gap:'12px'}}>
                  {savedRoadmap.weeks.slice(0, 5).map((week, i) => (
                    <div key={i} style={{width:'36px',height:'36px',borderRadius:'50%',background: week.completed ? '#1d5c3a' : '#2a2a35',border: week.completed ? '2px solid #34d399' : '2px solid #3a3a48',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <span style={{color: week.completed ? '#34d399' : '#7a7a90',fontSize:'12px',fontWeight:'700'}}>
                        {week.completed ? '✓' : week.week}
                      </span>
                    </div>
                  ))}
                  {totalWeeks > 5 && (
                    <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#2a2a35',border:'2px solid #3a3a48',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <span style={{color:'#7a7a90',fontSize:'11px'}}>+{totalWeeks - 5}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate('/roadmap')}
                  style={{background:'#6e56f8',color:'white',border:'none',borderRadius:'10px',padding:'12px 24px',fontSize:'14px',cursor:'pointer',fontWeight:'600',whiteSpace:'nowrap'}}
                >
                  Continue Learning →
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{marginTop:'20px'}}>
              <div style={{background:'#2a2a35',borderRadius:'4px',height:'6px',overflow:'hidden'}}>
                <div style={{height:'100%',background:'linear-gradient(90deg,#34d399,#6e56f8)',borderRadius:'4px',width: progressPercent + '%',transition:'width 0.5s ease'}} />
              </div>
            </div>
          </div>
        )}

        {/* Role search */}
        <div style={{background:'#16161a',border:'1px solid #2a2a35',borderRadius:'16px',padding:'32px',marginBottom:'24px'}}>
          <h2 style={{color:'#e8e8f0',fontSize:'20px',fontWeight:'600',marginBottom:'8px'}}>
            {savedRoadmap ? '🔄 Analyze a New Role' : '🎯 What role are you targeting?'}
          </h2>
          <p style={{color:'#7a7a90',fontSize:'13px',marginBottom:'20px'}}>
            Try: "Backend Engineer", "Frontend Developer", "Full Stack", "Data Scientist", "DevOps"
          </p>
          <div style={{display:'flex',gap:'12px'}}>
            <input
              style={{flex:1,padding:'12px 16px',background:'#0d0d0f',border:'1px solid #2a2a35',borderRadius:'8px',color:'#e8e8f0',fontSize:'15px'}}
              type="text"
              placeholder="e.g. Backend Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
            />
            <button
              onClick={handleExtract}
              disabled={loading}
              style={{background:'#6e56f8',color:'white',border:'none',borderRadius:'8px',padding:'12px 24px',fontSize:'14px',cursor:'pointer',fontWeight:'500',opacity: loading ? 0.7 : 1}}
            >
              {loading ? 'Analyzing...' : 'Analyze Role →'}
            </button>
          </div>
          {error && (
            <div style={{background:'#2a0d0d',border:'1px solid #5c1a1a',borderRadius:'8px',padding:'12px 16px',marginTop:'12px'}}>
              <p style={{color:'#f87171',fontSize:'13px',margin:0}}>⚠️ {error}</p>
            </div>
          )}
        </div>

        {loading && (
          <div style={{background:'#16161a',border:'1px solid #2a2a35',borderRadius:'12px',padding:'24px',textAlign:'center',marginBottom:'24px'}}>
            <p style={{color:'#a78bfa',fontSize:'14px'}}>🔍 Analyzing job market for "{role}"...</p>
          </div>
        )}

        {searched && !loading && skills.length > 0 && (
          <div style={{background:'#16161a',border:'1px solid #2a2a35',borderRadius:'16px',padding:'32px',marginBottom:'24px'}}>
            <h2 style={{color:'#e8e8f0',fontSize:'20px',fontWeight:'600',marginBottom:'6px'}}>
              Top skills for <span style={{color:'#a78bfa'}}>"{role}"</span>
            </h2>
            <p style={{color:'#7a7a90',fontSize:'13px',marginBottom:'24px'}}>Based on real job descriptions — sorted by demand</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'12px',marginBottom:'24px'}}>
              {skills.map((item, index) => (
                <div key={index} style={{background:'#0d0d0f',border:'1px solid #2a2a35',borderRadius:'10px',padding:'14px 16px'}}>
                  <p style={{fontSize:'11px',color:'#7a7a90',fontFamily:'monospace',marginBottom:'4px'}}>#{index + 1}</p>
                  <p style={{color:'#e8e8f0',fontSize:'15px',fontWeight:'500',marginBottom:'8px',textTransform:'capitalize'}}>{item.skill}</p>
                  <div style={{background:'#2a2a35',borderRadius:'4px',height:'4px',marginBottom:'6px',overflow:'hidden'}}>
                    <div style={{background:'#6e56f8',height:'100%',borderRadius:'4px',width: Math.min((item.count / skills[0].count) * 100, 100) + '%'}} />
                  </div>
                  <p style={{fontSize:'11px',color:'#7a7a90'}}>{item.count} mentions</p>
                </div>
              ))}
            </div>
            <button
              style={{background:'#6e56f8',color:'white',border:'none',borderRadius:'8px',padding:'12px 24px',fontSize:'14px',cursor:'pointer',fontWeight:'500'}}
              onClick={() => navigate('/quiz', { state: { skills, role } })}
            >
              Take Skill Gap Quiz →
            </button>
          </div>
        )}

        {!searched && !savedRoadmap && (
          <div style={{background:'#16161a',border:'1px solid #2a2a35',borderRadius:'16px',padding:'28px 40px'}}>
            <h3 style={{color:'#e8e8f0',fontSize:'16px',fontWeight:'600',marginBottom:'24px'}}>📈 How SkillGraph works</h3>
            <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
              {[
                {num:'1', text:'Enter your target job role'},
                {num:'2', text:'We analyze real job descriptions'},
                {num:'3', text:'Take a skill gap quiz'},
                {num:'4', text:'Get your 12-week roadmap'}
              ].map((step, i, arr) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:'12px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'12px',flex:'1',minWidth:'140px'}}>
                    <div style={{background:'#6e56f8',color:'white',width:'32px',height:'32px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'700',fontSize:'14px',flexShrink:0}}>
                      {step.num}
                    </div>
                    <p style={{color:'#7a7a90',fontSize:'13px',lineHeight:'1.4'}}>{step.text}</p>
                  </div>
                  {i < arr.length - 1 && <span style={{color:'#3a3a48',fontSize:'20px'}}>→</span>}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}