import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>SkillGraph</h1>
        <p style={styles.subtitle}>Welcome back</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d0f' },
  card: { background: '#16161a', border: '1px solid #2a2a35', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px' },
  title: { color: '#e8e8f0', fontFamily: 'sans-serif', fontSize: '28px', marginBottom: '4px' },
  subtitle: { color: '#7a7a90', marginBottom: '24px', fontFamily: 'sans-serif' },
  input: { width: '100%', padding: '12px 16px', marginBottom: '12px', background: '#0d0d0f', border: '1px solid #2a2a35', borderRadius: '8px', color: '#e8e8f0', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', background: '#6e56f8', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', marginTop: '8px' },
  error: { color: '#f87171', marginBottom: '12px', fontSize: '14px', fontFamily: 'sans-serif' },
  link: { color: '#7a7a90', marginTop: '16px', fontSize: '14px', fontFamily: 'sans-serif', textAlign: 'center' }
};