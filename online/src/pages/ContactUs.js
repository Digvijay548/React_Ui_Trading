import React, { useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactUs = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Thank you for reaching out! We will get back to you shortly.');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
      <div className="card bg-secondary text-white p-5 w-50" style={{ borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}>
        <h2 className="text-center mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Your Email</label>
            <input
              type="email"
              className="form-control bg-dark text-white border-light"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">Your Message</label>
            <textarea
              className="form-control bg-dark text-white border-light"
              id="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-100">Send Message</button>
        </form>
        {status && <div className="alert alert-success mt-3 text-center">{status}</div>}
      </div>
    </div>
  );
};

export default ContactUs;
