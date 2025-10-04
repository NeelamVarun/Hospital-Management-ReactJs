import React, { useEffect, useState } from 'react';
import './HospitalAdminDashboard.css';

const HospitalDashboard: React.FC = () => {
    
  const handleViewResponse = async (donorId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/bloodBridge/donor/notificationResponse/${donorId}`);
      if (res.status === 204) {
        setSelectedDonor(null);
        setShowModal(true);
        return;
      }
      const text = await res.text();
      if (!text || text === 'null') {
        setSelectedDonor(null);
        setShowModal(true);
        return;
      }
      const data = JSON.parse(text);
      setSelectedDonor(data);
      setShowModal(true);
    } catch (err) {
      alert('Failed to fetch response details');
    }
  };

  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [donors, setDonors] = useState<any[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<any[]>([]);
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetch('http://localhost:8080/bloodBridge/donor/all')
      .then((res) => res.json())
      .then((data) => {
        setDonors(data);
        setFilteredDonors(data);
      });
  }, []);

  useEffect(() => {
    if (bloodGroupFilter) {
      setFilteredDonors(donors.filter((d: any) => d.bloodGroup === bloodGroupFilter));
      setCurrentPage(1);
    } else {
      setFilteredDonors(donors);
    }
  }, [bloodGroupFilter, donors]);

  const totalPages = Math.ceil(filteredDonors.length / pageSize);
  const paginatedDonors = filteredDonors.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function canSendNotification(lastDonation: string) {
    if (!lastDonation) return false;
    const lastDate = new Date(lastDonation + '-01');
    const now = new Date();
    const diffMonths = (now.getFullYear() - lastDate.getFullYear()) * 12 + (now.getMonth() - lastDate.getMonth());
    return diffMonths > 0;
  }

  const handleSendNotification = (donorId: number) => {
    const payload = { donorId: donorId, hasNotification: true };
    fetch('http://localhost:8080/bloodBridge/donor/sendNotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then((res) => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then((data) => {
      setDonors((prevDonors) => prevDonors.map((d) =>
        d.donorId === donorId ? { ...d, hasNotification: true } : d
      ));
      setFilteredDonors((prevDonors) => prevDonors.map((d) =>
        d.donorId === donorId ? { ...d, hasNotification: true } : d
      ));
      alert('Notification sent!');
    })
    .catch((err) => {
      alert('Failed to send notification: ' + err.message);
    });
  };
  
  const bloodGroups = Array.from(new Set(donors.map((d: any) => d.bloodGroup)));

  return (
    <div className="dashboard-container">
      <h2 style={{ color: '#1976d2', fontWeight: 700, letterSpacing: '1px' }}>Hospital Dashboard</h2>
      <p style={{ color: '#d24f4f', fontSize: '1.08rem' }}>Welcome, Admin! Here you can manage blood requests, donor lists, and more.</p>
      <h3 style={{ color: '#d32f2f', fontWeight: 600, marginTop: '20px' }}>Donor List</h3>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blood Group</th>
            <th>Contact</th>
            <th>Notification Date</th>
            <th>Action</th>
            <th>View Response</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDonors.map((donor: any, idx: number) => (
            <tr key={donor.donorId || idx}>
              <td>{donor.name}</td>
              <td>{donor.bloodGroup}</td>
              <td>{donor.contact}</td>
              <td>{donor.notifiedDate || '-'}</td>
              <td>
                {donor.hasNotification ? (
                  <button disabled style={{ background: '#e0e0e0', color: '#888', cursor: 'not-allowed' }}>Notified</button>
                ) : (
                  <button onClick={() => {
                    if (donor.donorId !== undefined && donor.donorId !== null) {
                      handleSendNotification(donor.donorId);
                    }else{
                        console.log("Donor ID is undefined or null");
                    }
                  }} 
                  disabled={donor.hasNotification}>
                    {donor.hasNotification ? 'Notified' : 'Notify'}
                  </button>
                )}
              </td>
              <td>
                <button style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '5px', padding: '6px 12px', fontSize: '0.95rem', cursor: 'pointer' }}
                  onClick={() => handleViewResponse(donor.donorId)}>
                  View Response
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '16px' }}>
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
        <span style={{ margin: '0 12px' }}>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
      </div>

      {showModal && (
        <div style={{ margin: '32px', padding: '24px', background: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ color: '#388e3c', fontWeight: 600 }}>Donor Response</h3>
          {selectedDonor ? (
            <table style={{ width: '100%', marginBottom: '12px' }}>
              <tbody>
                <tr><td><b>Name:</b></td><td>{selectedDonor.name}</td></tr>
                <tr><td style={{ color: '#1976d2', fontWeight: 500 }}>Contact:</td><td>{selectedDonor.contact}</td></tr>
                <tr><td style={{ color: '#1976d2', fontWeight: 500 }}>Blood Group:</td><td>{selectedDonor.bloodGroup}</td></tr>
                <tr><td style={{ color: '#1976d2', fontWeight: 500 }}>Last Donated Date:</td><td>{selectedDonor.lastDonationDate}</td></tr>
                <tr><td style={{ color: '#1976d2', fontWeight: 500 }}>Response Date:</td><td>{selectedDonor.responseDate}</td></tr>
                <tr><td style={{ color: '#d32f2f', fontWeight: 500 }}>Is Available:</td><td>{selectedDonor.available ? 'Yes' : 'No'}</td></tr>
                <tr><td style={{ color: '#1976d2', fontWeight: 500 }}>Is Vehicle Needed:</td><td>{selectedDonor.vehicleNeed ? 'Yes' : 'No'}</td></tr>
              </tbody>
            </table>
          ) : (
            <div style={{ margin: '24px 0', color: '#d32f2f', fontWeight: 600, fontSize: '1rem' }}>
              No response received from donor yet.
            </div>
          )}
          <button onClick={() => setShowModal(false)} style={{ float: 'right', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 18px', fontSize: '1rem', cursor: 'pointer' }}>Close</button>
        </div>
      )}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <button className="dashboard-btn" style={{ background: '#1976d2', color: '#fff', borderRadius: '6px', padding: '8px 20px', fontSize: '1.08rem', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => { window.location.href = '/'; }}>
          Home
        </button>
      </div>
    </div>
  );
};

export default HospitalDashboard;