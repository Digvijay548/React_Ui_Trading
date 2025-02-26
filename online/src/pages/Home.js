import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Modal, Button } from "react-bootstrap";
import { FaEnvelope, FaWallet, FaBitcoin, FaChartLine, FaLock, FaSignInAlt } from "react-icons/fa";

const Home = () => {
  const { isLoggedIn, logout } = useAuth();
  const [price, setPrice] = useState(null);
  const [balance, setBalance] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const chartContainerRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [IsTradeDone,setisTradeDone]=useState(true);

  const [modalStyle, setModalStyle] = useState(""); // For dynamic styles

  useEffect(()=>{
if(!isLoggedIn)
{
  navigate("/login");
}
  },[isLoggedIn])



  // Fetch user balance
  const fetchBalance = async () => {
    try {
      const email = sessionStorage.getItem("LoggedInEmailId");
      if (!email) return;

      const response = await axios.get(
        `https://v0-new-project-rl3sqbf45cs.vercel.app/api/get-balance?email=${email}`
      );

      console.log(response.data);

      if (response.data.last_trade_time && response.data.last_trade_time !== "Not Available") {
        const lastTradeDate = new Date(response.data.last_trade_time).toISOString().split("T")[0];
        const todayDate = new Date().toISOString().split("T")[0];

        console.log(`🔍 Last Trade Date: ${lastTradeDate}, Today's Date: ${todayDate}`);

        if (lastTradeDate === todayDate) {
          setisTradeDone(true);
          setIsButtonDisabled(true);
        } else {
          setisTradeDone(false);
          setIsButtonDisabled(false);
        }
      } else {
        setIsButtonDisabled(response.data.balance <= 0);
        setisTradeDone(false);
      }

      if (response.data && response.data.balance !== undefined) {
        setBalance(response.data.balance); // ✅ Ensures UI updates
      }
    } catch (error) {
      console.error("❌ Error fetching balance:", error);
    }
  };

  // Fetch balance on mount
  useEffect(() => {
    fetchBalance();
  }, [IsTradeDone]);

  // Fetch Bitcoin price every 500ms
  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        setPrice(response.data.price);
      } catch (error) {
        console.error('❌ Error fetching Bitcoin price:', error);
      }
    };
    const interval = setInterval(fetchBitcoinPrice, 500);
    fetchBitcoinPrice();
    return () => clearInterval(interval);
  }, []);

  // Initialize TradingView chart
  useEffect(() => {
    const scriptId = 'tradingview-script';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initializeChart;
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
        height: '500px',
        symbol: 'BINANCE:BTCUSDT',
        interval: '1',
        container_id: 'tradingview_chart',
        locale: 'en',
        theme: 'dark',
      });
    }
  };

  // Handle disabled button click
  const btnDisableClick = () => {
    setModalHeader("⚠️ Trade Not Allowed")
    setModalMessage("Today's trade is already done or balance is too low.")
    setModalStyle("bg-dark text-white")
    setShowPopup(true);

  };

  // Start trade
  const handleStartTrade = async () => {
    setIsButtonDisabled(true);
    setCountdown(60);

    try {
      const email = sessionStorage.getItem("LoggedInEmailId");
      if (!email) return;

      const response = await axios.post(
        "https://v0-new-project-rl3sqbf45cs.vercel.app/api/start-trade",
        { email }
      );

      console.log("✅ Trade started successfully:", response.data);
    } catch (error) {
      isButtonDisabled(true);
      console.error("❌ Error starting trade:", error.response?.data || error.message);
    }
  };

  // ✅ Countdown Effect (Runs Only When Trade Starts)
  useEffect(() => {
    if (!isButtonDisabled || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          // ✅ Show trade success popup only when countdown reaches 0
          setModalHeader("🎉 Congratulations!");
          setModalMessage("✨ Your trade was successful! Keep it up! ✨");
          setModalStyle("bg-success text-white text-center");
          setShowPopup(true);
          setisTradeDone(true);

          setIsButtonDisabled(true); // Re-enable the button after trade success
          return 0; // Stop countdown at 0
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isButtonDisabled]);

  return (
    <div className="container-fluid p-0 bg-dark text-white vh-150 d-flex flex-column">
      <div
        className="text-center py-4 d-flex flex-column align-items-center shadow-lg"
        style={{
          backgroundColor: '#0D0D0D', // Deep black for professional look
          color: '#F8F9FA', // Light gray for readability
          padding: '15px',
          width: '100%',
          borderBottom: '3px solid #00FFC6', // Neon cyan border
          boxShadow: '0 4px 15px rgba(0, 255, 198, 0.2)', // Subtle glow
        }}
      >
        {/* Bitcoin Price */}
        <p
          className="fw-semibold m-0 d-flex align-items-center gap-2"
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.3rem)', // Responsive font size
            color: '#F8F9FA',
          }}
        >
          <FaBitcoin className="text-warning" size={20} />
          Real-time Bitcoin Price:
          <span
            className="fw-bold"
            style={{
              color: '#FFD700', // Gold for premium effect
              fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
              textShadow: '0 0 8px rgba(255, 215, 0, 0.7)', // Glow effect
            }}
          >
            {price ? `$${price} 🚀` : 'Loading... ⏳'}
          </span>
        </p>

        {/* Balance */}
        <p
          className="fw-semibold mt-2 d-flex align-items-center gap-2"
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.3rem)', // Responsive font size
            color: '#F8F9FA',
          }}
        >
          <FaWallet className="text-success" size={20} />
          Balance:
          <span
            className="fw-bold"
            style={{
              color: '#28A745', // Green for positive balance
              fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
              textShadow: '0 0 8px rgba(40, 167, 69, 0.7)', // Glow effect
            }}
          >
            ₹{balance} 💰
          </span>
        </p>
      </div>


      {/* TradingView Chart */}
      <div className="tradingview-container flex-grow-1 d-flex justify-content-center align-items-center"
        style={{ height: '70vh', minHeight: '500px', maxHeight: '70vh', padding: '10px', width: '100%' }}>
        <div id="tradingview_chart" className="w-100" style={{ height: '100%' }} ref={chartContainerRef}></div>
      </div>

      {/* Start Trade Button - Fully Centered */}
      <div className="d-flex justify-content-center align-items-center bg-dark py-3"
        style={{ minHeight: '15vh' }} // Ensures proper spacing & centering
        onClick={() => isButtonDisabled && btnDisableClick()}
      >
        <button className="btn btn-lg fw-bold d-flex align-items-center justify-content-center"
          onClick={(e) => {
            e.stopPropagation(); // Prevent div click when button is enabled
            if (!isButtonDisabled) handleStartTrade();
          }}
          disabled={isButtonDisabled}
          style={{
            width: '250px',
            fontSize: '1.2rem',
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: isButtonDisabled ? '#4E4E4E' : '#00C853', // Gray when disabled, Green when active
            color: isButtonDisabled ? '#AAA' : '#FFF',
            cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease-in-out',
            boxShadow: isButtonDisabled ? 'none' : '0 0 15px rgba(0, 200, 83, 0.5)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
          onMouseOver={(e) => {
            if (!isButtonDisabled) e.currentTarget.style.backgroundColor = '#00E676';
          }}
          onMouseOut={(e) => {
            if (!isButtonDisabled) e.currentTarget.style.backgroundColor = '#00C853';
          }}
        >
          {countdown > 0 ? `Starting in ${countdown}s` : '🚀 Start Trade'}
        </button>
      </div>



      {/* Popup Modal */}
      <Modal show={showPopup} onHide={() => setShowPopup(false)} centered backdrop="static">
        <Modal.Header closeButton className={modalStyle}>
          <Modal.Title>{modalHeader}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={modalStyle}>
          <p className="fw-bold" style={{ fontSize: "1.1rem" }}>
            {modalMessage}
          </p>
        </Modal.Body>
        <Modal.Footer className={modalStyle}>
          <Button variant="danger" onClick={() => setShowPopup(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Home;
