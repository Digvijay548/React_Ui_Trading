import React, { useState, useEffect } from 'react';
import { account } from '../appwrite'; // Import Appwrite client
import { useLocation, useNavigate } from 'react-router-dom'; // useLocation to get URL params and useNavigate for redirection
import 'bootstrap/dist/css/bootstrap.min.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to access the URL params

  // Extract query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');
  const secret = queryParams.get('secret');
  const expire = queryParams.get('expire');

  // Make sure token (secret) exists
  useEffect(() => {
    if (!secret || !userId) {
      setErrorMessage('Invalid link or missing token.');
    }
  }, [secret, userId]);

  const handleResetPassword = async () => {
    console.log(newPassword)
    if (!newPassword) {
      setErrorMessage('Please enter a new password.');
      return;
    }

    setLoading(true);
    try {
      // Reset the password with the secret and new password
      const response = await account.updateRecovery(userId,secret, newPassword); 
      account.deleteSessions(account)// Reset password via Appwrite
      console.log('Password reset response:', response);
      setSuccessMessage('Password successfully reset. You can now log in.');
      
      // Redirect to the login page after successful password reset
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error('Password reset error:', error);
      setErrorMessage(error.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow-sm" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Reset Password</h2>

        {/* Error Message */}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        {/* Success Message */}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {/* New Password Field */}
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          className="btn btn-primary w-100"
          onClick={handleResetPassword}
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        {/* Link to Login page */}
        <p className="mt-3 text-center">
          Remember your password? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
