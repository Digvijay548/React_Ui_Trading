// TermsAndConditions.js
import React from 'react';
import '../App.css'; // Optional: import styles

const TermsAndConditions = () => {
  return (
    <div
      className="container mt-5 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: 'rgba(223, 188, 247, 0.57)',
        borderRadius: '20px',
        minHeight: '70vh', // Ensure container takes at least 70% of viewport height
      }}
    >
      <h2 className="text-center mb-4">Terms and Conditions</h2>
      <p className="text-center">
        Please read these terms and conditions carefully before using our services.
      </p>
      <div>
        <h4>1. General Terms:</h4>
        <p>
          By using our services, you agree to comply with all applicable laws, regulations, and policies. 
          We reserve the right to change these terms at any time. Your continued use of our services indicates 
          your acceptance of the revised terms.
        </p>
        <h4>2. Privacy Policy:</h4>
        <p>
          We value your privacy and are committed to protecting your personal data. Our privacy policy outlines 
          how we collect, use, and store your information.
        </p>
        <h4>3. Risk Disclaimer:</h4>
        <p>
          Cryptocurrency trading involves significant risk. Please only trade with funds you can afford to lose. 
          We do not guarantee any profits from using our services.
        </p>
        <h4>4. Account Termination:</h4>
        <p>
          We reserve the right to terminate or suspend your account if we find any violation of our terms or 
          malicious activities associated with your account.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
