import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTelegramPlane, FaInstagram } from "react-icons/fa";

const JoinUs = () => {
  const handleJoinTelegram = () => {
    window.open("https://t.me/aitrading4uz", "_blank");
  };

  const handleFollowInstagram = () => {
    window.open("https://www.instagram.com/ai_trading_14", "_blank");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg text-white text-center bg-dark"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.1)",
        }}
      >
        <h2 className="mb-4" style={{ color: "#FFA500" }}>🚀 Join Us</h2>

        <button
          className="btn btn-primary w-100 fw-bold mb-3 d-flex align-items-center justify-content-center"
          onClick={handleJoinTelegram}
        >
          <FaTelegramPlane className="me-2" /> Join Telegram
        </button>

        <button
          className="w-100 fw-bold d-flex align-items-center justify-content-center"
          onClick={handleFollowInstagram}
          style={{
            background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
            border: "none",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          <FaInstagram className="me-2" /> Follow on Instagram
        </button>
      </div>
    </div>
  );
};

export default JoinUs;
