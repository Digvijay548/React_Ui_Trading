import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';  // Use the correct import for the useAuth hook
import axios from 'axios';
import { databases, ID } from '../appwrite';
import '../App.css';

const Home = () => {
  const { isLoggedIn, logout } = useAuth();  // Ensure you're using `isLoggedIn` here
  const [price, setPrice] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showLowBalancePopup, setShowLowBalancePopup] = useState(false);
  const chartContainerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch live Bitcoin price from Binance API
  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        setPrice(response.data.price);
      } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        clearInterval(interval);
      }
    };

    const interval = setInterval(fetchBitcoinPrice, 500);

    fetchBitcoinPrice(); // Initial fetch

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Dynamically load the TradingView script
  useEffect(() => {
    const loadTradingViewScript = () => {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (window.TradingView && chartContainerRef.current) {
          new window.TradingView.widget({
            width: '95%',
            height: '450',
            symbol: 'BINANCE:BTCUSDT',
            interval: '1',
            container_id: chartContainerRef.current.id,
            locale: 'en',
            theme: 'dark',
          });
        } else {
          console.error('Failed to load TradingView library or container not found');
        }
      };
      document.body.appendChild(script);
    };

    loadTradingViewScript();
  }, []);

  // Handle transaction (start trade)
  const handleTransaction = async (type) => {
    const emailId = localStorage.getItem('emailId'); // Retrieve user email from localStorage
    if (!emailId) {
      console.error('User is not logged in');
      return;
    }

    const transaction = {
      userId: emailId,
      action: String(type),
      price: String(price),
      timestamp: new Date().toISOString(),
      balance: String(100),
    };

    try {
      const response = await databases.createDocument(
        '67b2ec51001147536f70',
        '67b2ec8f0037c0139541',
        ID.unique(),
        transaction
      );
      console.log('Transaction recorded:', response);
    } catch (error) {
      console.log('Error creating transaction:', error);
    }
  };

  // Countdown timer for the button
  useEffect(() => {
    let timer;
    if (countdown > 0 && isButtonDisabled) {
      timer = setInterval(() => {
        setCountdown((prevTime) => prevTime - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(timer);
      setIsButtonDisabled(false);
      setCountdown(6);
      setShowPopup(true); // Show popup when countdown is done
    }

    return () => clearInterval(timer);
  }, [countdown, isButtonDisabled]);

  // Show low balance popup
  const setShowLowBalancePopupok = () => {
    setShowLowBalancePopup(false);
    navigate('/balance'); // Redirect to balance page
  };

  // Start trade function
  const handleStartTrade = () => {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const balance = transactions.balance || 0;
    if (balance > 0) {
      setIsButtonDisabled(true);
      setCountdown(6);
      handleTransaction('Start Trade');
    } else {
      console.log('Low balance...');
      setShowLowBalancePopup(true);
    }
  };

  // If user is not logged in, show login popup
  if (!isLoggedIn) {
    return (
      <div>
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Please log in!</h2>
            <p>You need to be logged in to access the dashboard.</p>
            <button onClick={() => navigate('/login')} className="close-popup-btn">
              Log in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Your existing home screen content */}

      <div className="real-time-price-container d-flex justify-content-center align-items-center">
        <h4 className="real-time-price">
          Real-time Bitcoin Price: {price ? `$${price}` : 'Loading...'}
        </h4>
      </div>

      <div className="tradingview-container">
        <div id="tradingview_chart" ref={chartContainerRef}></div>
      </div>

      <div className="button-container d-flex justify-content-center align-items-center" style={{ marginTop: '10px' }}>
        <button
          className="btn btn-primary"
          onClick={handleStartTrade}
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? `Starting in ${countdown}s` : 'Start Trade'}
        </button>
      </div>

      {/* Low Balance Popup */}
      {showLowBalancePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Low Balance!</h2>
            <p>Your balance is too low to start a trade. Please add more funds to your account.</p>
            <button onClick={() => setShowLowBalancePopupok()} className="close-popup-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Trade Completed Popup */}
      {isButtonDisabled && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Trade Completed!</h2>
            <p>Your trade has been successfully completed.</p>
            <button onClick={() => setShowPopup(false)} className="close-popup-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
