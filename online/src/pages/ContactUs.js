import React, { useState } from 'react';
import '../App.css'; // Optional: import styles

const ContactUs = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you can handle sending the message to a server or email service.
    setStatus('Thank you for reaching out! We will get back to you shortly.');
    setEmail('');
    setMessage('');
  };

  return (
    <div
      className="container mt-5 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: 'rgba(223, 188, 247, 0.57)',
        borderRadius: '20px',
        minHeight: '70vh', // Ensure container takes at least 70% of viewport height
      }}
    >
      <div className="w-75">
        <h2 className="text-center mb-4 pt-4">Contact Us</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'rgba(223, 188, 247, 0.57)',
            borderRadius: '20px',
            padding: '20px',
          }}
        >
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Your Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              Your Message
            </label>
            <textarea
              className="form-control"
              id="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Send Message
          </button>
        </form>
        {status && <div className="alert alert-success mt-3 text-center">{status}</div>}
      </div>
    </div>
  );
};

export default ContactUs;
