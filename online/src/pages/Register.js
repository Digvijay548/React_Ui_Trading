import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { FaEnvelope, FaLock, FaUserPlus, FaGift } from "react-icons/fa";

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
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg text-white"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "12px",
          backgroundColor: "#1a1a2e",
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.1)",
        }}
      >
        <h2 className="text-center mb-3" style={{ color: "#FFA500" }}>
          {isForgotPassword ? "🔒 Forgot Password" : "📝 Register"}
        </h2>

        {!isForgotPassword ? (
          <>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">
                <FaEnvelope className="me-2 text-warning" /> Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">
                <FaLock className="me-2 text-primary" /> Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="referralCode" className="form-label fw-bold">
                <FaGift className="me-2 text-success" /> Referral Member Email (Optional)
              </label>
              <input
                type="text"
                className="form-control"
                id="referralCode"
                placeholder="Enter referral code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
            </div>
            <button
              className="btn btn-success w-100 fw-bold"
              onClick={handleRegister}
            >
              <FaUserPlus className="me-2" /> Register
            </button>
            <p className="mt-3 text-center">
              Already have an account?{" "}
              <a href="#" onClick={() => navigate("/login")} className="text-info">
                Log In
              </a>
            </p>
          </>
        ) : (
          <>
            <div className="mb-3">
              <label htmlFor="resetEmail" className="form-label fw-bold">
                <FaEnvelope className="me-2 text-warning" /> Enter your email address
              </label>
              <input
                type="email"
                className="form-control"
                id="resetEmail"
                placeholder="Enter your email to reset password"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
            <button className="btn btn-warning w-100 fw-bold">
              Send Recovery Email
            </button>
            <p className="mt-3 text-center">
              Remember your password?{" "}
              <a href="#" onClick={() => setIsForgotPassword(false)} className="text-info">
                Back to Register
              </a>
            </p>
          </>
        )}

        {errorMessage && (
          <div className="alert alert-danger mt-3">{errorMessage}</div>
        )}
        {isRegistered && (
          <div className="alert alert-success mt-3">
            🎉 Registration successful! Please check your email to confirm.
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
