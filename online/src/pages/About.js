import React from 'react';
import { FaChartLine, FaBrain, FaUserFriends, FaHeadset } from 'react-icons/fa';

const About = () => {
  return (
    <div className="container my-5 p-4 text-white text-center" 
      style={{
        backgroundColor: '#121212', 
        borderRadius: '15px', 
        boxShadow: '0 4px 10px rgba(255, 255, 255, 0.1)',
        maxWidth: '800px' 
      }}
    >
      <h2 className="fw-bold mb-3" style={{ color: '#FFA500' }}>About Us</h2>
      <p className="lead mb-4" style={{ fontSize: '1.1rem', color: '#CCCCCC' }}>
        Welcome to <span className="fw-bold" style={{ color: '#28a745' }}>AI Trading</span> – your gateway to the future of cryptocurrency trading. 
        We use cutting-edge AI technology to provide real-time market insights and optimize your trades for maximum profitability.
      </p>

      <h4 className="fw-bold mb-3" style={{ color: '#FFD700' }}>Our Features</h4>
      <div className="row text-center">
        <div className="col-md-6 mb-3">
          <FaChartLine size={30} color="#28a745" />
          <p className="mt-2 fw-bold">Real-time Market Analysis</p>
        </div>
        <div className="col-md-6 mb-3">
          <FaBrain size={30} color="#17a2b8" />
          <p className="mt-2 fw-bold">AI-powered Trading Algorithms</p>
        </div>
        <div className="col-md-6 mb-3">
          <FaUserFriends size={30} color="#FF5733" />
          <p className="mt-2 fw-bold">User-friendly Interface</p>
        </div>
        <div className="col-md-6 mb-3">
          <FaHeadset size={30} color="#FFC107" />
          <p className="mt-2 fw-bold">24/7 Customer Support</p>
        </div>
      </div>
    </div>
  );
};

export default About;
