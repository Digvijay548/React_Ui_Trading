import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    if (!userId || !secret) {
      setError("Invalid or expired reset link.");
    }
  }, [userId, secret]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    if (!password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      const response = await axios.post("https://v0-new-project-rl3sqbf45cs.vercel.app/api/reset-password", {
        userId, secret, password, confirmPassword
      });
  
      if (response.data.error) {
        setError(response.data.error); // Directly set the error message from API
      } else {
        setMessage("✅ Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      setError("❌ Failed to reset password. Please try again.");
    }
  };
  

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#1a1a2e" }}>
      <div
        className="card p-4 shadow-lg text-white reset-card"
        style={{
          borderRadius: "12px",
          backgroundColor: "#16213e",
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.1)",
        }}
      >
        <h2 className="text-center mb-3" style={{ color: "#FFA500" }}>
          🔒 Reset Password
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label className="form-label fw-bold">
              <FaLock className="me-2 text-warning" /> New Password
            </label>
            <input
              type="password"
              className="form-control bg-dark text-white border-0"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              <FaLock className="me-2 text-warning" /> Confirm Password
            </label>
            <input
              type="password"
              className="form-control bg-dark text-white border-0"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-success w-100 fw-bold" type="submit">
            🔄 Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
