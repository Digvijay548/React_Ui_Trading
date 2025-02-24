import React from 'react';
import { FaUserFriends, FaGift, FaWallet } from 'react-icons/fa';

const Referral = () => {
  return (
    <div className="container my-5 p-4 text-white text-center" 
    style={{
      backgroundColor: '#121212', 
      borderRadius: '15px', 
      boxShadow: '0 4px 10px rgba(255, 255, 255, 0.1)',
      maxWidth: '800px' 
    }}
  >
      {/* Referral Card */}
      <div className="card p-4 shadow-lg text-white border-0 rounded-4"style={{
      backgroundColor: '#121212'}} >
        <div className="d-flex justify-content-center align-items-center mb-3">
          <FaGift size={50} className="text-warning me-2" /> 
          <h2 className="fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Referral Bonuses</h2>
        </div>

        <p className="lead fw-medium">
          <FaUserFriends className="text-success me-2" size={22} />
          Refer a friend and earn <span className="text-warning fw-bold">₹500</span> on their first trade!
        </p>

        {/* Referral Wallet Display */}
        <div className="d-flex justify-content-center align-items-center gap-3 my-3">
        </div>

        {/* Share Referral Button */}
        <button className="btn btn-lg btn-outline-warning mt-3 fw-bold px-4 py-2 rounded-3"
          style={{ letterSpacing: '1px', transition: '0.3s', textTransform: 'uppercase' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffc107'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          📤 Share Referral Link
        </button>
      </div>
    </div>
  );
};

export default Referral;
