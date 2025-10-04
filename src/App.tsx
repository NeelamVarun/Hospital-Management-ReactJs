import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import DonorLogin from './login/DonorLogin';  
import HospitalLogin from './login/HospitalAdminLogin';
import DonorRegister from './register/DonorRegister';
import HospitalAdminRegister from './register/HospitalAdminRegister';
import DonorDashboard from './dashboard/DonorDashboard';
import HospitalDashboard from './dashboard/HospitalAdminDashboard';
import AppHeader from './components/AppHeader';

import { useState } from 'react';

function App() {
  const [hideLinks, setHideLinks] = useState(false);
  const handleNavClick = () => setHideLinks(true);
  const hideHomeLinks = ['/donor-dashboard', '/hospital-dashboard', '/register', '/hospital-register'].includes(window.location.pathname);

  return (
    <Router>
      <AppHeader />
      {!hideHomeLinks && !hideLinks && (
        <div className="welcome-section">
          <h2>Welcome</h2>
          <nav className="welcome-nav">
            <Link to="/donor-login" onClick={handleNavClick} className="welcome-link donor-link">Donor</Link>
            <Link to="/hospital-login" onClick={handleNavClick} className="welcome-link hospital-link">Hospital Admin</Link>
          </nav>
        </div>
      )}

      <Routes>
        <Route path="/donor-login" element={<DonorLogin />} />
        <Route path="/hospital-login" element={<HospitalLogin />} />
        <Route path="/register" element={<DonorRegister onSubmit={() => { }} />} />
        <Route path="/hospital-register" element={<HospitalAdminRegister onSubmit={() => { }} />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
