import React, { useState } from 'react';
import './LoginScreen.css';

function LoginScreen({ onLogin }){
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');

        if (!userName.trim() || !password.trim()){
            setError('Please enter both user name and password.');
            return;
        }
        setLoading(true);
        try{
            const response = await fetch ('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({userName: userName, password}),
            });
            if(!response.ok){
                const errorData = await response .json();
                throw new Error(errorData.message || 'Login Failied');
            }
            onLogin && onLogin(userName);
        }catch(err){
            setError(err.message || 'Login failed. Please try again');
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2 style={{ textAlign: 'center', marginBotton: 24}}>Hospital Management Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{marginBottom: 16}}>
                    <label htmlFor="userName">UserName</label>
                    <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    style={{width: '100%', padding: 8, marginTop: 4 }}
                    autoFocus
                    disabled={loading}
                    />
                    </div>
                    <div style={{marginBottom: 16}}>
                    <label htmlFor="password">Password</label>
                    <input
                    type="text"
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{width: '100%', padding: 8, marginTop: 4 }}
                    autoFocus
                    disabled={loading}
                    />
                    </div>
                    {error && <div styke={{ color: 'red', marginBottom:12}}>{error}</div>}
                    <button type="submit" style={{width: '100%', padding: 10, background: '#2d3a4b', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold'}} disabled={loading}>
                        {loading ? 'Loggin in...' : 'Login'}
                        </button>
                        </form>
                    
                </div>
    );

}

export default LoginScreen;