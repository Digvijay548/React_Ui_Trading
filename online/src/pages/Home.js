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

  const fetchBalance = async () => {
    try {
      const email = localStorage.getItem('LoggedInEmailId');
      const response = await axios.get(`https://v0-new-project-rl3sqbf45cs.vercel.app/api/get-balance?email=${email}`);
      console.log(response.data);
      
      if (response.data.last_trade_time) {
        const lastTradeDate = new Date(response.data.last_trade_time).toISOString().split("T")[0];
        const todayDate = new Date().toISOString().split("T")[0];
        console.log(`🔍 Last Trade Date: ${lastTradeDate}, Today's Date: ${todayDate}`);
        
        if (lastTradeDate == todayDate) {
          setIsButtonDisabled(true);          
        }
        else
        {          
        setIsButtonDisabled(false);
        }
      }

      if (response.data && response.data.balance !== undefined) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.error("❌ Error fetching balance:", error);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

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
    const scriptId = 'tradingview-script';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        initializeChart();
      };
      document.body.appendChild(script);
    } else {
      initializeChart();
    }

    return () => {
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  const initializeChart = () => {
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

  const handleStartTrade = async () => {
    setIsButtonDisabled(true);
    setCountdown(60);

    try {
      const Email = localStorage.getItem("LoggedInEmailId");
      if (!Email) return;

      const response = await axios.post(
        "https://v0-new-project-rl3sqbf45cs.vercel.app/api/start-trade",
        { email: Email }
      );

      console.log("✅ Trade started successfully:", response.data);
    } catch (error) {
      console.error("❌ Error starting trade:", error.response?.data || error.message);      
    }
  };

  return (
    <div className="container-fluid p-0 bg-dark text-white vh-100 d-flex flex-column">
      <div className="text-center py-2 d-flex flex-column align-items-center" style={{ backgroundColor: '#1a1a2e', color: '#e94560' }}>
        <h2 className="fw-bold">AI Trading Dashboard</h2>
        <p className="lead">Real-time Bitcoin Price: <span className="fw-bold" style={{ color: '#FFA500' }}>{price ? `$${price}` : 'Loading...'}</span></p>
        <p className="lead">Balance: <span className="fw-bold" style={{ color: '#28a745' }}>₹{balance}</span></p>
      </div>

      <div className="tradingview-container flex-grow-1 d-flex justify-content-center align-items-center">
        <div id="tradingview_chart" className="w-100" style={{ height: '100%' }} ref={chartContainerRef}></div>
      </div>

      <div className="text-center bg-dark" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <button className="btn btn-lg btn-success" onClick={handleStartTrade} disabled={isButtonDisabled}>
          {countdown > 0 ? `Starting in ${countdown}s` : 'Start Trade'}
        </button>
      </div>
    </div>
  );
};

export default Home;
