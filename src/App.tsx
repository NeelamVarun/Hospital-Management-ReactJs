import { useState } from 'react';
import './App.css';
import LoginScreen from './components/login/LoginScreen';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  const handleLogin = (userName: string) => {
    setIsLoggedIn(true);
    setUser(userName);
  };

  if (!isLoggedIn){
    return <LoginScreen onLogin={handleLogin} />
  }
  return (
    <div style = {{ maxWidth: 600, margin: '40px auto', padding:32, background: '#FFF', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)'}}>
      <h1>Welcome, {user}</h1>
      <p>This is your hospital management dashboard</p>
    </div>
    
  );
}

export default App;
