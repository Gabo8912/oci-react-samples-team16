import React from 'react';
import './Captcha.css';

const Captcha = ({ onVerify }) => {
  return (
    <div className="captcha-container">
      <button 
        className="captcha-button"
        onClick={onVerify}
      >
        <span className="captcha-text">I am human</span>
        <span className="captcha-icon">👤</span>
      </button>
    </div>
  );
};

export default Captcha; 