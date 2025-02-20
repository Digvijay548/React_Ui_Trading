import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext'; // Import the auth context

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login ,LoggedInEmailId} = useAuth(); // Get the login method from context
  const navigate = useNavigate();

  // Check if the user is already logged in when the component mounts
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
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
      localStorage.setItem('sessionId', sessionId); // Store sessionId in localStorage
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
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow-sm" style={{ width: '400px', backgroundColor: 'rgba(223, 188, 247, 0.57)', borderRadius: '10px' }}>
        <h2 className="text-center mb-4">Login</h2>
        
        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>} {/* Error message */}
        
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
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
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
