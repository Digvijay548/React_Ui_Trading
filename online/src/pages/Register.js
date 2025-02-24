import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setErrorMessage('');

      const response = await axios.post('https://v0-new-project-rl3sqbf45cs.vercel.app/api/register', {
        email,
        password,
        referralCode,
      });

      console.log('User registered:', response.data);
      setIsRegistered(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Registration failed!');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-100 bg-secondary text-white" style={{ maxWidth: '400px', borderRadius: '10px' }}>
        <h2 className="text-center mb-3">{isForgotPassword ? 'Forgot Password' : 'Register'}</h2>

        {!isForgotPassword ? (
          <>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="referralCode" className="form-label">Referral Code (Optional)</label>
              <input type="text" className="form-control" id="referralCode" placeholder="Enter referral code" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} />
            </div>
            <button className="btn btn-primary w-100" onClick={handleRegister}>Register</button>
            <p className="mt-3 text-center">
              Already have an account? <a href="#" onClick={() => navigate('/login')}>Log In</a>
            </p>
          </>
        ) : (
          <>
            <div className="mb-3">
              <label htmlFor="resetEmail" className="form-label">Enter your email address</label>
              <input type="email" className="form-control" id="resetEmail" placeholder="Enter your email to reset password" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
            </div>
            <button className="btn btn-primary w-100">Send Recovery Email</button>
            <p className="mt-3 text-center">
              Remember your password? <a href="#" onClick={() => setIsForgotPassword(false)}>Back to Register</a>
            </p>
          </>
        )}

        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
        {isRegistered && <div className="alert alert-success mt-3">Registration successful! Please check your email to confirm.</div>}
      </div>
    </div>
  );
};

export default Register;
