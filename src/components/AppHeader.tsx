import * as React from 'react';
import '../dashboard/DonorDashboard.css';

const AppHeader: React.FC = () => (
  <div className="app-header">
    <span role="img" aria-label="blood">🩸</span>
    <span className="app-header-title">BloodBridge: Connect, Donate, Save Lives</span>
  </div>
);

export default AppHeader;