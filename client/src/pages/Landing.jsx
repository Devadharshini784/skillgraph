import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: '🔍', title: 'Analyze real job market', desc: 'We scan hundreds of real job descriptions to find exactly what skills companies are hiring for right now.' },
    { icon: '📊', title: 'Find your skill gaps', desc: 'A smart 10-question quiz maps what you know against what the market demands — giving you a readiness score.' },
    { icon: '🗺️', title: 'Get your roadmap', desc: 'A personalized week-by-week learning plan with curated free resources for every skill you need to learn.' },
  ];

  const steps = [
    { num: '01', title: 'Enter your target role', desc: 'Tell us what job you want — Backend Engineer, Frontend Developer, Data Scientist, and more.' },
    { num: '02', title: 'We analyze the job market', desc: 'SkillGraph scans real job postings and ranks the most in-demand skills for your chosen role.' },
    { num: '03', title: 'Take the skill gap quiz', desc: 'Rate your confidence in each skill. We calculate your readiness score instantly.' },
    { num: '04', title: 'Follow your roadmap', desc: 'Get a 12-week plan with free learning resources. Track your progress week by week.' },
  ];

  const roles = ['Backend Engineer', 'Frontend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'ML Engineer'];

  return (
    <div style={{minHeight:'100vh',background:'#0d0d0f',fontFamily:'sans-serif',color:'#e8e8f0'}}>

      {/* Navbar */}
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 60px',borderBottom:'1px solid #2a2a35',position:'sticky',top:0,background:'#0d0d0f',zIndex:100}}>
        <div style={{fontSize:'22px',fontWeight:'700'}}>
          <span style={{color:'#e8e8f0'}}>Skill</span>
          <span style={{color:'#6e56f8'}}>Graph</span>
        </div>
        <div style={{display:'flex',gap:'12px'}}>
          <button onClick={() => navigate('/login')} style={{background:'transparent',border:'1px solid #2a2a35',color:'#7a7a90',padding:'8px 20px',borderRadius:'8px',cursor:'pointer',fontSize:'14px'}}>
            Login
          </button>
          <button onClick={() => navigate('/signup')} style={{background:'#6e56f8',border:'none',color:'white',padding:'8px 20px',borderRadius:'8px',cursor:'pointer',fontSize:'14px',fontWeight:'500'}}>
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{textAlign:'center',padding:'100px 40px 80px',maxWidth:'800px',margin:'0 auto'}}>
        <div style={{display:'inline-block',background:'#1a1040',border:'1px solid #3a2a8a',borderRadius:'20px',padding:'6px 16px',fontSize:'13px',color:'#a78bfa',marginBottom:'24px'}}>
          Free for students — no credit card needed
        </div>
        <h1 style={{fontSize:'clamp(36px,6vw,64px)',fontWeight:'800',lineHeight:'1.1',letterSpacing:'-.03em',marginBottom:'24px'}}>
          Know exactly what to learn<br/>
          <span style={{color:'#6e56f8'}}>to get hired.</span>
        </h1>
        <p style={{fontSize:'18px',color:'#7a7a90',lineHeight:'1.7',marginBottom:'40px',maxWidth:'560px',margin:'0 auto 40px'}}>
          SkillGraph analyzes real job descriptions, finds your skill gaps, and generates a personalized 12-week learning roadmap — all for free.
        </p>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
          <button
            onClick={() => navigate('/signup')}
            style={{background:'#6e56f8',border:'none',color:'white',padding:'14px 32px',borderRadius:'10px',cursor:'pointer',fontSize:'16px',fontWeight:'600'}}
          >
            Build my roadmap →
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{background:'transparent',border:'1px solid #2a2a35',color:'#7a7a90',padding:'14px 32px',borderRadius:'10px',cursor:'pointer',fontSize:'16px'}}
          >
            I have an account
          </button>
        </div>

        {/* Role pills */}
        <div style={{display:'flex',gap:'8px',justifyContent:'center',flexWrap:'wrap',marginTop:'40px'}}>
          {roles.map((role, i) => (
            <span key={i} style={{background:'#16161a',border:'1px solid #2a2a35',borderRadius:'20px',padding:'6px 14px',fontSize:'12px',color:'#7a7a90'}}>
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{borderTop:'1px solid #2a2a35',borderBottom:'1px solid #2a2a35',padding:'32px 60px',display:'flex',justifyContent:'center',gap:'80px',flexWrap:'wrap'}}>
        {[
          {num:'6+', label:'Target roles supported'},
          {num:'100+', label:'Skills in our database'},
          {num:'12', label:'Week learning roadmap'},
          {num:'Free', label:'Always, for students'},
        ].map((stat, i) => (
          <div key={i} style={{textAlign:'center'}}>
            <p style={{fontSize:'32px',fontWeight:'800',color:'#6e56f8',margin:'0 0 4px'}}>{stat.num}</p>
            <p style={{fontSize:'13px',color:'#7a7a90',margin:0}}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{padding:'80px 60px',maxWidth:'1100px',margin:'0 auto'}}>
        <p style={{textAlign:'center',color:'#7a7a90',fontSize:'12px',fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'.15em',marginBottom:'16px'}}>
          Why SkillGraph
        </p>
        <h2 style={{textAlign:'center',fontSize:'36px',fontWeight:'800',marginBottom:'56px',letterSpacing:'-.02em'}}>
          Stop guessing. Start learning<br/>what actually matters.
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'24px'}}>
          {features.map((f, i) => (
            <div key={i} style={{background:'#16161a',border:'1px solid #2a2a35',borderRadius:'16px',padding:'32px'}}>
              <div style={{fontSize:'32px',marginBottom:'16px'}}>{f.icon}</div>
              <h3 style={{color:'#e8e8f0',fontSize:'18px',fontWeight:'600',marginBottom:'12px'}}>{f.title}</h3>
              <p style={{color:'#7a7a90',fontSize:'14px',lineHeight:'1.7',margin:0}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{padding:'80px 60px',background:'#16161a',borderTop:'1px solid #2a2a35',borderBottom:'1px solid #2a2a35'}}>
        <div style={{maxWidth:'900px',margin:'0 auto'}}>
          <p style={{textAlign:'center',color:'#7a7a90',fontSize:'12px',fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'.15em',marginBottom:'16px'}}>
            How it works
          </p>
          <h2 style={{textAlign:'center',fontSize:'36px',fontWeight:'800',marginBottom:'56px',letterSpacing:'-.02em'}}>
            From zero to roadmap<br/>in 5 minutes.
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'32px'}}>
            {steps.map((step, i) => (
              <div key={i}>
                <p style={{fontSize:'48px',fontWeight:'800',color:'#2a2a35',margin:'0 0 16px',fontFamily:'monospace'}}>{step.num}</p>
                <h3 style={{color:'#e8e8f0',fontSize:'16px',fontWeight:'600',marginBottom:'10px'}}>{step.title}</h3>
                <p style={{color:'#7a7a90',fontSize:'13px',lineHeight:'1.7',margin:0}}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{padding:'100px 40px',textAlign:'center'}}>
        <h2 style={{fontSize:'42px',fontWeight:'800',marginBottom:'16px',letterSpacing:'-.02em'}}>
          Ready to get hired?
        </h2>
        <p style={{color:'#7a7a90',fontSize:'16px',marginBottom:'40px'}}>
          Build your personalized skill roadmap in 5 minutes. Free forever.
        </p>
        <button
          onClick={() => navigate('/signup')}
          style={{background:'#6e56f8',border:'none',color:'white',padding:'16px 40px',borderRadius:'12px',cursor:'pointer',fontSize:'18px',fontWeight:'600'}}
        >
          Build my roadmap — it's free →
        </button>
      </div>

      {/* Footer */}
      <div style={{borderTop:'1px solid #2a2a35',padding:'24px 60px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
        <div style={{fontSize:'18px',fontWeight:'700'}}>
          <span style={{color:'#e8e8f0'}}>Skill</span>
          <span style={{color:'#6e56f8'}}>Graph</span>
        </div>
        <p style={{color:'#7a7a90',fontSize:'13px',margin:0}}>
          Built by Devadharshini 
        </p>
      </div>

    </div>
  );
}