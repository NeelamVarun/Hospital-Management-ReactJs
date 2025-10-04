import React, { useState } from 'react';
import './Register.css';

const HospitalAdminRegister: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [success, setSuccess] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.contact || !form.email || !form.password) {
      setError('All fields are required');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/bloodBridge/api/auth/registerHospitalUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setSuccess('Registration successful!');
        onSubmit(form);
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
};

    return (
    <div className="register-container">
      <h2>Hospital Register Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div>
          <label>Contact Number:</label>
          <input name="contact" value={form.contact} onChange={handleChange} />
        </div>

        <div>
          <label>Email:</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" />
        </div>

        <div>
          <label>Password:</label>
          <input name="password" value={form.password} onChange={handleChange} type="password" />
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button type="submit" disabled={!!success}>Register</button>

        {success && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <a href="/hospital-login" style={{ color: '#d32f2f', fontWeight: 'bold', textDecoration: 'underline', fontSize: '1.1rem' }}>
              Go to Login
            </a>
          </div>
        )}
      </form>
    </div>
  );
}; // Closing brace for the component function

export default HospitalAdminRegister;