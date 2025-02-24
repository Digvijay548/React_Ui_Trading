import React, { useState } from 'react';
import { FaEnvelope, FaPaperPlane, FaCommentDots } from 'react-icons/fa';

const ContactUs = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('✅ Thank you for reaching out! We will get back to you shortly.');
    setEmail('');
    setMessage('');
    setTimeout(() => setStatus(''), 5000); // Auto-hide status message after 5 sec
  };

  return (
    <div className="container my-5 p-4 text-white text-center" 
      style={{
        backgroundColor: '#121212', 
        borderRadius: '15px', 
        boxShadow: '0 4px 10px rgba(255, 255, 255, 0.1)',
        maxWidth: '600px',
        margin: 'auto'
      }}
    >
      {/* Header */}
      <h2 className="fw-bold mb-3" style={{ color: '#FFA500' }}>✉️ Contact Us</h2>
      <p className="lead mb-4" style={{ fontSize: '1.1rem', color: '#CCCCCC' }}>
        Got questions? Reach out and our team will respond promptly.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3 text-start">
          <label htmlFor="email" className="form-label fw-bold">
            <FaEnvelope className="me-2 text-warning" /> Your Email
          </label>
          <input
            type="email"
            className="form-control bg-dark text-white border-0"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderRadius: '8px', padding: '12px' }}
          />
        </div>

        <div className="mb-3 text-start">
          <label htmlFor="message" className="form-label fw-bold">
            <FaCommentDots className="me-2 text-primary" /> Your Message
          </label>
          <textarea
            className="form-control bg-dark text-white border-0"
            id="message"
            rows="4"
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            style={{ borderRadius: '8px', padding: '12px' }}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-success w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
          style={{ borderRadius: '8px', padding: '12px', transition: '0.3s' }}
        >
          <FaPaperPlane /> Send Message
        </button>
      </form>

      {/* Success Message */}
      {status && (
        <div className="alert alert-success mt-3 text-center"
          style={{ borderRadius: '8px', animation: 'fadeIn 0.5s ease-in-out' }}
        >
          {status}
        </div>
      )}
    </div>
  );
};

export default ContactUs;
