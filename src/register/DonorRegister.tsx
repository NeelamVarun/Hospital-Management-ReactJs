import React, { useState } from 'react';
import './Register.css';

const DonorRegisterDetails: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    contact: '',
    email: '',
    address: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [success, setSuccess] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.dateOfBirth || !form.gender || !form.bloodGroup || !form.contact || !form.email || !form.address || !form.password) {
      setError('All fields are required');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/bloodBridge/api/auth/registerDonorUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
         const data = await response.json();
        setSuccess(data.message || 'Registration successful!');
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
      <h1 style={{ textAlign: 'center', marginBottom: 16 }}>Donor Registration</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Date of Birth:</label>
          <input name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} type="date" required />
        </div>

        <div>
          <label>Gender:</label>
          <select name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">--Select--</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>Blood Group:</label>
          <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required>
            <option value="">--Select--</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
       <div>
          <label>Contact Number:</label>
          <input name="contact" value={form.contact} onChange={handleChange} required />
        </div>

        <div>
          <label>Email:</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" required />
        </div>

        <div>
          <label>Address:</label>
          <input name="address" value={form.address} onChange={handleChange} required />
        </div>

        <div>
          <label>Password:</label>
          <input name="password" value={form.password} onChange={handleChange} type="password" required />
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button type="submit" disabled={!!success}>Register</button>

        {success && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <a href="/donor-login" style={{ color: '#1976d2', fontWeight: 'bold', textDecoration: 'underline', fontSize: '1.1rem' }}>
              Go to Login
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default DonorRegisterDetails;