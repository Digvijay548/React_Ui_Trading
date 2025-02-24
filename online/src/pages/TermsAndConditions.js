import React from 'react';
import { FaGavel, FaUserShield, FaExclamationTriangle, FaBan } from 'react-icons/fa';

const TermsAndConditions = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center py-5">
      <div
        className="card p-4 shadow-lg text-white"
        style={{
          maxWidth: '900px',
          width: '100%',
          borderRadius: '15px',
          backgroundColor: '#1a1a2e',
          boxShadow: '0px 4px 15px rgba(255, 255, 255, 0.1)',
        }}
      >
        <h2 className="text-center mb-3" style={{ color: '#FFA500' }}>
          📜 Terms & Conditions
        </h2>
        <p className="text-center text-muted">
          Please read our terms carefully before using our trading services.
        </p>

        <div className="row">
          <div className="col-12 col-md-6 mb-4">
            <h4 className="d-flex align-items-center">
              <FaGavel className="me-2 text-warning" /> General Terms
            </h4>
            <p className="text-muted">
              By using our services, you agree to follow all applicable laws and policies. We may update these terms, and continued use implies acceptance.
            </p>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <h4 className="d-flex align-items-center">
              <FaUserShield className="me-2 text-primary" /> Privacy Policy
            </h4>
            <p className="text-muted">
              We prioritize your privacy and ensure secure handling of your data. Please refer to our privacy policy for details.
            </p>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <h4 className="d-flex align-items-center">
              <FaExclamationTriangle className="me-2 text-danger" /> Risk Disclaimer
            </h4>
            <p className="text-muted">
              Trading involves risks. Only trade what you can afford to lose. We do not guarantee any profits.
            </p>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <h4 className="d-flex align-items-center">
              <FaBan className="me-2 text-danger" /> Account Termination
            </h4>
            <p className="text-muted">
              We reserve the right to suspend or terminate accounts involved in malicious or unlawful activities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
