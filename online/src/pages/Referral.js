import React, { useState } from 'react';
import { FaUserFriends, FaGift } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Referral = () => {
  const [showModal, setShowModal] = useState(false);

  const referralLink = "https://tradingapp4.netlify.app"; // Change this to your actual referral link

  const handleReferClick = () => {
    setShowModal(true); // Auto-close modal after 3 seconds
  };

  return (
    <div className="container my-5 p-4 text-white text-center"
      style={{
        backgroundColor: '#121212',
        borderRadius: '15px',
        boxShadow: '0 4px 10px rgba(255, 255, 255, 0.1)',
        maxWidth: '800px'
      }}
    >
      <div className="card p-4 shadow-lg text-white border-0 rounded-4"
        style={{ backgroundColor: '#121212' }}
      >
        <div className="d-flex justify-content-center align-items-center mb-3">
          <FaGift size={50} className="text-warning me-2" />
          <h2 className="fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Referral Bonuses</h2>
        </div>

        <p className="lead fw-medium">
          <FaUserFriends className="text-success me-2" size={22} />
          Refer a friend and earn <span className="text-warning fw-bold">₹500</span> on their first trade!
        </p>

        <button className="btn btn-lg btn-outline-warning mt-3 fw-bold px-4 py-2 rounded-3"
          style={{ letterSpacing: '1px', transition: '0.3s', textTransform: 'uppercase' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffc107'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          onClick={handleReferClick}
        >
          📤 Share Referral Link
        </button>
      </div>

      {/* Bootstrap Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-white" style={{ backgroundColor: '#1a1a1a', borderRadius: '12px' }}>
              <div className="modal-header border-0">
                <h5 className="modal-title text-warning">📢 Referral Link</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <p>✅ Share this referral link with your friend and earn ₹500!</p>
                <div className="p-2 bg-dark text-warning rounded-3">
                  <strong>{referralLink}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referral;
