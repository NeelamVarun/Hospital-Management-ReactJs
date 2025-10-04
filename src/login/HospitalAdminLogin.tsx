import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const HospitalAdminLogin = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !password) {
      setError('UserName and password are required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/bloodBridge/api/auth/hospitalLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password })
      });

      if (response.ok) {
        navigate('/hospital-dashboard');
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }

    setLoading(false);
  };

 return (
    <div>
      <h2 style={{ color: '#d32f2f', fontWeight: 700, letterSpacing: 1, textAlign: 'center', marginBottom: 24 }}>Hospital Admin Login</h2>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label>UserName:</label>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Logging In...' : 'Login'}</button>
          <div style={{ marginTop: 12 }}>
            <span>Don't have an account? </span>
            <a href="/hospital-register">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
}; 
export default HospitalAdminLogin;