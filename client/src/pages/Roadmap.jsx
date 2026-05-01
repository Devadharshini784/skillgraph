import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function Roadmap() {
  const navigate = useNavigate();
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [completedWeeks, setCompletedWeeks] = useState(new Set());

  useEffect(() => { fetchRoadmap(); }, []);

  const fetchRoadmap = async () => {
    try {
      const res = await API.get('/roadmap');
      if (res.data.weeks.length === 0) {
        await generateRoadmap();
      } else {
        setWeeks(res.data.weeks);
        const completed = new Set(res.data.weeks.filter(w => w.completed).map(w => w.week));
        setCompletedWeeks(completed);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmap = async () => {
    setGenerating(true);
    try {
      const res = await API.post('/roadmap/generate');
      setWeeks(res.data.weeks);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleComplete = async (weekNo) => {
    try {
      await API.patch('/roadmap/complete/' + weekNo);
      setCompletedWeeks(prev => new Set([...prev, weekNo]));
    } catch (err) {
      console.error(err);
    }
  };

  const openLink = (url) => { window.open(url, '_blank'); };

  const completedCount = completedWeeks.size;
  const totalWeeks = weeks.length;
  const progressPercent = totalWeeks > 0 ? Math.round((completedCount / totalWeeks) * 100) : 0;

  if (loading || generating) {
    return (
      <div style={{minHeight:'100vh',background:'#0d0d0f',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:'#a78bfa',fontSize:'16px'}}>
          {generating ? 'Generating your roadmap...' : 'Loading your roadmap...'}
        </p>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh',background:'#0d0d0f',fontFamily:'sans-serif'}}>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',borderBottom:'1px solid #2a2a35'}}>
        <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
          <button onClick={() => navigate('/dashboard')} style={{background:'transparent',border:'1px solid #2a2a35',color:'#7a7a90',padding:'8px 14px',borderRadius:'8px',cursor:'pointer',fontSize:'13px'}}>
            Back
          </button>
          <div 
  style={{fontSize:'20px',fontWeight:'700',cursor:'pointer'}}
  onClick={() => navigate('/')}
>
  <span style={{color:'#e8e8f0'}}>Skill</span>
  <span style={{color:'#6e56f8'}}>Graph</span>
</div>
        </div>
        <span style={{background:'#1a1040',color:'#a78bfa',padding:'6px 14px',borderRadius:'20px',fontSize:'13px',border:'1px solid #3a2a8a'}}>
          {progressPercent}% Complete
        </span>
      </div>

      <div style={{padding:'40px',maxWidth:'1000px',margin:'0 auto'}}>

        <div style={{background:'linear-gradient(135deg,#1a1040,#16161a)',border:'1px solid #3a2a8a',borderRadius:'16px',padding:'32px 40px',marginBottom:'24px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'24px'}}>
          <div>
            <h1 style={{color:'#e8e8f0',fontSize:'24px',fontWeight:'700',marginBottom:'8px'}}>
              Your 12-Week Learning Roadmap 🗺️
            </h1>
            <p style={{color:'#7a7a90',fontSize:'14px'}}>Complete each week to track your progress.</p>
          </div>
          <div style={{display:'flex',gap:'16px'}}>
            {[
              {num: completedCount, label: 'Done', color: '#6e56f8'},
              {num: totalWeeks - completedCount, label: 'Left', color: '#6e56f8'},
              {num: progressPercent + '%', label: 'Progress', color: '#34d399'}
            ].map((s, i) => (
              <div key={i} style={{textAlign:'center',background:'#0d0d0f',borderRadius:'12px',padding:'16px 24px',border:'1px solid #2a2a35',minWidth:'70px'}}>
                <p style={{color:s.color,fontSize:'28px',fontWeight:'800',margin:'0'}}>{s.num}</p>
                <p style={{color:'#7a7a90',fontSize:'11px',margin:'4px 0 0',textTransform:'uppercase'}}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'32px'}}>
          <div style={{flex:1,height:'8px',background:'#2a2a35',borderRadius:'4px',overflow:'hidden'}}>
            <div style={{height:'100%',background:'linear-gradient(90deg,#6e56f8,#a78bfa)',borderRadius:'4px',width: progressPercent + '%',transition:'width 0.5s ease'}} />
          </div>
          <span style={{color:'#7a7a90',fontSize:'13px',whiteSpace:'nowrap',fontFamily:'monospace'}}>
            {completedCount} of {totalWeeks} weeks
          </span>
        </div>

        {completedCount === totalWeeks && totalWeeks > 0 && (
  <div style={{background:'#0d2a1e',border:'1px solid #34d399',borderRadius:'16px',padding:'32px',marginBottom:'24px',textAlign:'center'}}>
    <p style={{fontSize:'48px',margin:'0 0 12px'}}>🎉</p>
    <h2 style={{color:'#34d399',fontSize:'24px',fontWeight:'700',marginBottom:'8px'}}>
      Roadmap Complete!
    </h2>
    <p style={{color:'#7a7a90',fontSize:'14px',marginBottom:'20px'}}>
      You finished all {totalWeeks} weeks. Time to apply for jobs!
    </p>
    <button
      onClick={() => navigate('/dashboard')}
      style={{background:'#34d399',color:'#0d1f14',border:'none',borderRadius:'8px',padding:'12px 28px',fontSize:'14px',cursor:'pointer',fontWeight:'700'}}
    >
      Go update your resume →
    </button>
  </div>
)}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'16px'}}>

          {weeks.map((week) => {
            const isCompleted = completedWeeks.has(week.week);
            return (
              <div key={week.week} style={{background: isCompleted ? '#0d1f14' : '#16161a', border: isCompleted ? '1px solid #1d5c3a' : '1px solid #2a2a35', borderRadius:'14px', padding:'20px'}}>

                <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#6e56f8',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <span style={{color:'white',fontSize:'14px',fontWeight:'700'}}>
                      {isCompleted ? '✓' : week.week}
                    </span>
                  </div>
                  <div style={{flex:1}}>
                    <p style={{color:'#7a7a90',fontSize:'11px',fontFamily:'monospace',textTransform:'uppercase',margin:'0 0 2px'}}>Week {week.week}</p>
                    <p style={{color:'#e8e8f0',fontSize:'15px',fontWeight:'600',margin:0,textTransform:'capitalize'}}>
                      {week.skills.map(s => s.skill).join(', ')}
                    </p>
                  </div>
                  {isCompleted && <span style={{fontSize:'12px',color:'#34d399'}}>Done</span>}
                </div>

                <div style={{marginBottom:'16px'}}>
                  {week.skills.map((skillItem, si) => (
                    <div key={si}>
                      {skillItem.resources && skillItem.resources.slice(0, 2).map((resource, ri) => (
                        <button
                          key={ri}
                          onClick={() => openLink(resource.url)}
                          style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',background:'#0d0d0f',border:'1px solid #2a2a35',borderRadius:'8px',color:'#a78bfa',fontSize:'12px',marginBottom:'6px',cursor:'pointer',width:'100%',textAlign:'left'}}
                        >
                          <span style={{fontSize:'10px',flexShrink:0}}>
                            {resource.type === 'video' ? '▶' : '📄'}
                          </span>
                          {resource.title}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>

                {!isCompleted && (
                  <button
                    onClick={() => handleComplete(week.week)}
                    style={{width:'100%',padding:'10px',background:'transparent',border:'1px solid #6e56f8',color:'#6e56f8',borderRadius:'8px',fontSize:'13px',cursor:'pointer',fontWeight:'500'}}
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {weeks.length === 0 && (
          <div style={{textAlign:'center',padding:'80px 0'}}>
            <p style={{color:'#e8e8f0',fontSize:'20px',marginBottom:'8px'}}>No roadmap found.</p>
            <p style={{color:'#7a7a90',fontSize:'14px',marginBottom:'24px'}}>Complete the skill gap quiz first.</p>
            <button onClick={() => navigate('/dashboard')} style={{background:'#6e56f8',color:'white',border:'none',borderRadius:'8px',padding:'12px 24px',fontSize:'14px',cursor:'pointer'}}>
              Go to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}