import React, { useState, useEffect } from 'react';
import './DonorDashboard.css';

const DonorDashboard: React.FC = () => {
    const [responseSubmitted, setResponseSubmitted] = useState(false);
    const navigateToHome = () => {
        window.location.href = '/';
    };

    const [available, setAvailable] = useState<boolean | null>(null);
    const [bloodType, setBloodType] = useState<string>('');
    const [lastDonationDate, setLastDonationDate] = useState<string>('');
    const [timeSlot, setTimeSlot] = useState<string>('');
    const [needsVehicle, setNeedsVehicle] = useState<boolean | null>(null);
    const [error, setError] = useState<string>('');
    const [donorDetails, setDonorDetails] = useState<any>(null);

    React.useEffect(() => {
        const email = localStorage.getItem('donorEmail');
        if (email) {
            fetch(`http://localhost:8080/bloodBridge/donor/details?email=${encodeURIComponent(email)}`)
                .then(res => res.json())
                .then(data => {
                    setDonorDetails(data);
                });
        } else {
            setDonorDetails(null);
        }
    }, []);

    const handleSubmit = () => {
        const lastDate = new Date(lastDonationDate);
        const today = new Date();
        const months = (today.getFullYear() - lastDate.getFullYear()) * 12 + today.getMonth() - lastDate.getMonth();

        if (months < 8) {
            setError('You must wait at least 8 months between donations.');
            return;
        }

        setError('');

        const payload = {
            donorEmail: localStorage.getItem('donorEmail'),
            donorName: donorDetails?.name,
            bloodType,
            lastDonationDate,
            available,
            timeSlot,
            needsVehicle,
            responseDate: new Date().toISOString().slice(0, 10),
        };

        fetch('http://localhost:8080/bloodBridge/donor/addNotificationResponse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to submit response');
            return res.text();
        })
        .then(() => {
            setResponseSubmitted(true);
        })
        .catch(() => {
            setError('Failed to submit response. Please try again.');
        });
    };

    return (
        <div className="dashboard-container beautiful-bg">
            {localStorage.getItem('donorEmail') ? (
                <>
                    {donorDetails && donorDetails.hasNotification ? (
                        <>
                            {donorDetails.hasResponded ? (
                                <div className="dashboard-success">
                                    <p>Thank you for your response!</p>
                                    <button className="dashboard-btn" onClick={navigateToHome}>Home</button>
                                </div>
                            ) : (
                                <React.Fragment>
                                    <div className="donor-request-message">
                                        <p>Hello {donorDetails.name},</p>
                                        <p>You have been requested to donate blood.</p>
                                    </div>
                                    {!responseSubmitted && (
                                        <React.Fragment>
                                        <div className="dashboard-section">
                                            <label>Are you available to donate?</label><br />
                                            <button className="dashboard-btn" onClick={() => setAvailable(true)}>Yes</button>
                                            <button className="dashboard-btn" onClick={() => setAvailable(false)}>No</button>
                                        </div>
                                    {available && (
                                        <>
                                            <div className="dashboard-section">
                                                <label>Blood Type:</label><br />
                                                <select value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
                                                    <option value="">Select</option>
                                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                                                        <option key={type} value={type}>{type}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="dashboard-section">
                                                <label>Last Donation Date:</label><br />
                                                <input type="date" value={lastDonationDate} onChange={(e) => setLastDonationDate(e.target.value)} />
                                            </div>
                                            <div className="dashboard-section">
                                                <label>Available Time Slot:</label><br />
                                                <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                                                    <option value="">Select</option>
                                                    <option value="Morning">Morning (8 AM - 12 PM)</option>
                                                    <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
                                                    <option value="Evening">Evening (4 PM - 8 PM)</option>
                                                </select>
                                            </div>
                                            <div className="dashboard-section">
                                                <label>Do you need a vehicle?</label><br />
                                                <button className="dashboard-btn" onClick={() => setNeedsVehicle(true)}>Yes</button>
                                                <button className="dashboard-btn" onClick={() => setNeedsVehicle(false)}>No</button>
                                            </div>
                                            </>
                                    )}
                                            {error && <p className="dashboard-error">{error}</p>}
                                            <button className="dashboard-btn main-action" 
                                            onClick={handleSubmit}
                                            disabled={responseSubmitted}>
                                                Respond to Request
                                            </button>
                                        </React.Fragment>
                                    )}
                                    {responseSubmitted && (
                                        <div className="dashboard-section">
                                            <p className="dashboard-success">Thank you for your response!</p>
                                            <button className="dashboard-btn" onClick={navigateToHome}>Home</button>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}
                        </>
                    ) : (
                        donorDetails && (
                            <div className="donor-request-message" style={{ background: '#fffbe6', color: '#666', padding: '16px', borderRadius: '8px', textAlign: 'center', margin: '32px' }}>
                                <p>Hello {donorDetails.name},</p>
                                <p>There are currently no blood donation requests for you.</p>
                            </div>
                        )
                    )}
                </>
            ) : (
                <div style={{ margin: '40px', textAlign: 'center' }}>
                    <div style={{ color: '#d32f2f', fontWeight: 600, fontSize: '1.2rem', marginBottom: '18px' }}>
                        Please login to view your donor dashboard.
                    </div>
                    <button className="dashboard-btn" style={{ background: '#1976d2', color: '#fff', borderRadius: '6px', padding: '8px 20px', fontSize: '1.0rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => { window.location.href = '/donor-login'; }}>
                        Go to login
                    </button>
                </div>
            )}
             
        </div>
    );
};

export default DonorDashboard;