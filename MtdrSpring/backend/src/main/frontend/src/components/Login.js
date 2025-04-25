import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Captcha from './Captcha';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!showCaptcha) {
      setShowCaptcha(true);
      return;
    }

    if (!isHuman) {
      setError('Please verify you are human');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleCaptchaVerify = () => {
    setIsHuman(true);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {showCaptcha && !isHuman && (
            <div className="captcha-section">
              <Captcha onVerify={handleCaptchaVerify} />
            </div>
          )}
          <button type="submit" className="login-button">
            {showCaptcha ? 'Continue' : 'Start Session'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 