import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleRegister = async () => {
    try {
      // Make a request to the backend to register the user
      console.log(email)
      console.log(password)
      const response = await axios.post('https://v0-new-project-rl3sqbf45cs.vercel.app/api/register', {
        email,
        password
      });

      console.log('User registered:', response.data);
      setIsRegistered(true);

      // After registration, send an email verification request (Optional if needed)
      // This step could be handled on your backend API if necessary
      // await account.createVerification('unique()'); // Send verification OTP
      console.log('Verification email sent.');

    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Registration failed!'); // Handle error message from the server
      console.error('Registration error:', error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      if (!resetEmail) {
        setErrorMessage('Please enter your email address.');
        return;
      }
      // Send recovery email (password reset with OTP) via Appwrite
      //const promise = await account.createRecovery(resetEmail, redirectUrl); // No redirect URL needed

      //console.log(promise);
    } catch (error) {
      setErrorMessage(error.message); // Display error if sending recovery email fails
      console.error('Forgot password error:', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      {/* Registration form with inline transparency */}
      <div
        className="card p-4 shadow-sm"
        style={{
          width: '400px',
          backgroundColor: 'rgba(223, 188, 247, 0.57)', // 80% opacity background
          borderRadius: '10px', // Optional: Rounded corners for better appearance
        }}
      >
        <h2 className="text-center mb-4">{isForgotPassword ? 'Forgot Password' : 'Register'}</h2>
        {!isForgotPassword ? (
          <>
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
            <button className="btn btn-primary w-100" onClick={handleRegister}>Register</button>
            <p className="mt-3 text-center">
              Already have an account? <a href="#" onClick={() => (navigate('/login'))}>Log In?</a>
            </p>
          </>
        ) : (
          <>
            <div className="mb-3">
              <label htmlFor="resetEmail" className="form-label">Enter your email address</label>
              <input
                type="email"
                className="form-control"
                id="resetEmail"
                placeholder="Enter your email to reset password"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100" onClick={handleForgotPassword}>Send Recovery Email</button>
            <p className="mt-3 text-center">
              Remember your password? <a href="#" onClick={() => setIsForgotPassword(false)}>Back to Register</a>
            </p>
          </>
        )}
        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
        {isRegistered && !isForgotPassword && <div className="alert alert-success mt-3">Registration successful! Please check your email to confirm.</div>}
      </div>
    </div>
  );
};

export default Register;
