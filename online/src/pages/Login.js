import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { useAuth } from './authContext'; // Import the auth context

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login ,LoggedInEmailId} = useAuth(); // Get the login method from context
  const navigate = useNavigate();

  // Check if the user is already logged in when the component mounts
  useEffect(() => {
    const sessionId = sessionStorage.getItem('sessionId');
    if (sessionId) {
      navigate('/home'); // Redirect user to home if they are already logged in
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      // Send the email and password to the backend for validation
      const response = await axios.post(
        'https://v0-new-project-rl3sqbf45cs.vercel.app/api/login', // Use the Vercel deployed API
        { email, password }
      );
      console.log(response);

      // If login is successful, store session data (if required)
      const sessionId = response.data.sessionId;
      sessionStorage.setItem('sessionId', sessionId); // Store sessionId in sessionStorage
      login(sessionId); // Use context's login function to update the state
      LoggedInEmailId(email);
      setErrorMessage(''); // Clear error message if login is successful
      navigate('/home'); // Redirect to home page after successful login
    } catch (error) {
      // If an error occurs, display the error message
      setErrorMessage(error.response ? error.response.data.error : 'An error occurred');
      console.error('Login error:', error);
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
          🔐 Login
        </h2>

        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

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

        <button className="btn btn-success w-100 fw-bold" onClick={handleLogin}>
          <FaSignInAlt className="me-2" /> Login
        </button>
      </div>
    </div>
  );
};

export default Login;
