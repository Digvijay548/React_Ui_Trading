import React from 'react';
import '../App.css'; // Optional: import styles
import 'bootstrap/dist/css/bootstrap.min.css';

const About = () => {
  return (
    <div className="container mt-5 p-4 text-white" style={{ backgroundColor: '#111517', borderRadius: '20px' }}>
      <h2 className="text-center mb-4 pt-4">About Us</h2>
      <p className="text-center pb-4">
        Welcome to AI Trading, the platform where you can trade cryptocurrencies with cutting-edge AI technology. 
        Our mission is to provide the best trading experience by utilizing advanced trading algorithms to help you 
        make smart investment decisions. Whether you're a beginner or an experienced trader, we're here to help you 
        succeed in the world of crypto trading.
      </p>
      <div className="text-center pb-4">
        <h4>Our Features:</h4>
        <ul className="list-unstyled">
          <li>✔ Real-time market analysis</li>
          <li>✔ Advanced AI algorithms for smarter trading</li>
          <li>✔ User-friendly interface</li>
          <li>✔ 24/7 support</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
