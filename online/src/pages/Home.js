import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Home = () => {
  const { isLoggedIn, logout } = useAuth();
  const [price, setPrice] = useState(null);
  const [balance, setBalance] = useState(0);
  const [tradeValue, setTradeValue] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const chartContainerRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Fetch balance when component loads
  const checkBalance = async () => {
    try {
      const response = await axios.get('https://api.example.com/get-balance'); // Replace with your API
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0);
    }
  };

  // ✅ Fetch trade value when component loads
  const fetchTradeValue = async () => {
    try {
      const response = await axios.get('https://api.example.com/get-trade-value'); // Replace with your API
      setTradeValue(response.data.tradeValue);
    } catch (error) {
      console.error('Error fetching trade value:', error);
      setTradeValue(false);
    }
  };

  // ✅ Check balance and trade value when page loads
  useEffect(() => {
    checkBalance();
    fetchTradeValue();
  }, []);

  // ✅ Enable button when balance > 0 & tradeValue is true
  useEffect(() => {
    if (balance > 0 && tradeValue) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [balance, tradeValue]);

  // ✅ Fetch Bitcoin price every 500ms
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

  // ✅ Load TradingView chart script
  useEffect(() => {
    const loadTradingViewScript = () => {
      const existingScript = document.getElementById('tradingview-script');
      if (existingScript) {
        existingScript.remove();
      }

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
        chartElement.innerHTML = ''; 
      }
    };
  }, []);

  // ✅ Start timer on button click and call API after 60 sec
  const handleStartTrade = () => {
    setIsButtonDisabled(true);
    setCountdown(60);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // ✅ Call trade API after 60 sec
          axios.post('https://api.example.com/start-trade', { status: 'completed' })
            .then(() => console.log('Trade completed'))
            .catch((error) => console.error('Trade API error:', error));

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="container-fluid p-0 bg-dark text-white vh-100 d-flex flex-column">
      {/* Header Section */}
      <div 
        className="text-center py-2 d-flex flex-column align-items-center" 
        style={{ 
          backgroundColor: '#1a1a2e', 
          color: '#e94560', 
          padding: '10px',
          maxHeight: '20vh', // Limits header height
          overflow: 'hidden' // Prevents text overflow
        }}
      >
        <h2 className="fw-bold" style={{ fontSize: '1.5rem' }}>AI Trading Dashboard</h2>
        <p className="lead" style={{ fontSize: '1rem', marginBottom: '5px' }}>
          Real-time Bitcoin Price: <span className="fw-bold" style={{ color: '#FFA500' }}>
            {price ? `$${price}` : 'Loading...'}
          </span>
        </p>
        <p className="lead" style={{ fontSize: '1rem', marginBottom: '5px' }}>
          Balance: <span className="fw-bold" style={{ color: '#28a745' }}>₹{balance}</span>
        </p>
        <p className="lead" style={{ fontSize: '1rem' }}>
          Trade Status: <span className="fw-bold" style={{ color: '#FFA500' }}>
            {tradeValue ? 'Active' : 'Inactive'}
          </span>
        </p>
      </div>
  
      {/* TradingView Chart Section */}
      <div 
        className="tradingview-container flex-grow-1 d-flex justify-content-center align-items-center"
        style={{
          height: '65vh', // Increase chart height
          padding: '10px'
        }}
      >
        <div id="tradingview_chart" className="w-100" style={{ height: '100%' }} ref={chartContainerRef}></div>
      </div>
  
      {/* Button Section */}
      <div 
        className="text-center bg-dark" 
        style={{ paddingTop: '10px', paddingBottom: '10px', height: '15vh' }}
      >
        <button 
          className="btn btn-lg btn-success"
          onClick={handleStartTrade}
          disabled={isButtonDisabled}
        >
          {countdown > 0 ? `Starting in ${countdown}s` : 'Start Trade'}
        </button>
      </div>
    </div>
  );
  
  
};

export default Home;
