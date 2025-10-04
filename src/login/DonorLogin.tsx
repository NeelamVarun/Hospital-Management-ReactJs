import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Optional: your styling file

const DonorLogin: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!userName || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/bloodBridge/api/auth/donorLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      });

      if (response.ok) {
        localStorage.setItem('donorEmail', userName);
        navigate('/donor-dashboard');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }

    setLoading(false);
  };

 return (
  <>
    <h2 style={{ color: '#f75962', fontWeight: 700, letterSpacing: 1, textAlign: 'center', marginBottom: 24 }}>
      Donor Login
    </h2>
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <label>UserName:</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p>Don't have an account?</p>
        <a href="/register">Sign up</a>
      </form>
    </div>
  </>
);
};

export default DonorLogin;