import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import axios from 'axios';
import { databases, ID } from '../appwrite';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Home = () => {
  const { isLoggedIn, logout } = useAuth();
  const [price, setPrice] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showLowBalancePopup, setShowLowBalancePopup] = useState(false);
  const chartContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        setPrice(response.data.price);
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
      }
    };
    const interval = setInterval(fetchBitcoinPrice, 500);
    fetchBitcoinPrice();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadTradingViewScript = () => {
      // Remove existing script if it exists
      const existingScript = document.getElementById('tradingview-script');
      if (existingScript) {
        existingScript.remove(); // Remove the old script to force reload
      }
  
      // Create a new script tag
      const script = document.createElement('script');
      script.id = 'tradingview-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (window.TradingView && chartContainerRef.current) {
          new window.TradingView.widget({
            width: '100%',
            height: '85%',
            symbol: 'BINANCE:BTCUSDT',
            interval: '1',
            container_id: 'tradingview_chart',
            locale: 'en',
            theme: 'dark',
          });
        }
      };
      document.body.appendChild(script);
    };
  
    loadTradingViewScript();
  
    return () => {
      const chartElement = document.getElementById('tradingview_chart');
      if (chartElement) {
        chartElement.innerHTML = ''; // Clear previous chart if exists
      }
    };
  }, []);
  

  return (
    <div className="container-fluid p-0 bg-dark text-white vh-100 d-flex flex-column">
      <div className="text-center py-2" style={{ backgroundColor: '#1a1a2e', color: '#e94560' }}>
        <h2 className="fw-bold">AI Trading Dashboard</h2>
        <p className="lead">Real-time Bitcoin Price: <span className="fw-bold text-warning">{price ? `$${price}` : 'Loading...'}</span></p>
      </div>
      <div className="tradingview-container flex-grow-1 d-flex justify-content-center align-items-stretch">
        <div id="tradingview_chart" className="w-100" style={{ height: '85%' }} ref={chartContainerRef}></div>
      </div>
      <div className="text-center bg-dark" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <button className="btn btn-lg btn-success" onClick={() => setIsButtonDisabled(true)} disabled={isButtonDisabled}>
          {isButtonDisabled ? `Starting in ${countdown}s` : 'Start Trade'}
        </button>
      </div>
    </div>
  );
};

export default Home;