import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { load } from '@cashfreepayments/cashfree-js';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Balance = () => {
  let Cashfree;
  let initializeSDK = async function () {
    Cashfree = await load({ mode: "production" });
  };

  initializeSDK();
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentPending, setPaymentPending] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, LoggedInEmailId } = useAuth();

  // ✅ Fetch balance from Appwrite on component load
  useEffect(() => {
    if (isLoggedIn) {
      fetchBalance();
       updateBalanceInDatabase('2');
    }
  }, [isLoggedIn]);

  const fetchBalance = async () => {
    try {
      const email=localStorage.getItem('LoggedInEmailId');
      const response = await axios.get(`https://v0-new-project-rl3sqbf45cs.vercel.app/api/get-balance?email=${email}`);
      console.log("fetch balance= ");
      console.log(response.data);
      if (response.data && response.data.balance !== undefined) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.error("❌ Error fetching balance:", error);
    }
  };

  // ✅ Verify payment after checkout
  const verifyPayment = async () => {
    if (!transactionId) {
      console.error("❌ Missing Transaction ID");
      setShowPopup(true);
      setPopupMessage("Error: Missing Transaction ID.");
      setPopupType("error");
      return;
    }

    try {
      console.log("🔍 Verifying Payment - Order ID:", transactionId);

      // ✅ Call backend API to verify payment
      const response = await axios.post("https://v0-new-project-rl3sqbf45cs.vercel.app/api/VerifyPayment", {
        orderId: transactionId
      });

      console.log("✅ Payment Verification Response:", response.data);

      // ✅ If order_status is 'PAID', update Appwrite balance
      if (response.data && response.data.order_status === "PAID") {
        await updateBalanceInDatabase(amount);
        fetchBalance(); // ✅ Refresh balance after update
        setShowPopup(true);
        setPopupMessage("✅ Payment Verified Successfully! Your balance is updated.");
        setPopupType("success");
        setPaymentPending(false);
      } else if (response.data && response.data.order_status === "ACTIVE") {
        setShowPopup(true);
        setPopupMessage("⚠️ Payment is still in progress. Please try again later.");
        setPopupType("warning");
      } else {
        setShowPopup(true);
        setPopupMessage("❌ Payment verification failed. Please try again.");
        setPopupType("error");
      }
    } catch (error) {
      console.error("❌ Error verifying payment:", error);
      setShowPopup(true);
      setPopupMessage("❌ Error verifying payment. Please contact support.");
      setPopupType("error");
    }
  };

  const updateBalanceInDatabase = async (amount) => {
    if (!LoggedInEmailId) {
      console.error("❌ Error: LoggedInEmailId is missing!");
      return;
    }
  
    try {
     const Email=localStorage.getItem('LoggedInEmailId');
      const response = await axios.post(
        "https://v0-new-project-rl3sqbf45cs.vercel.app/api/update-balance",
        {
          email: Email,
          amount: parseFloat(amount),
        }
      );
  
      console.log("✅ Balance updated in database:", response.data);
      return response.data; // Optional: return response data for further use
    } catch (error) {
      console.error(
        "❌ Error updating balance in Appwrite:",
        error.response?.data || error.message
      );
    }
  };
  

  const handleAddBalance = async () => {
    if (!isLoggedIn) {
      setShowPopup(true);
      setPopupMessage('You need to be logged in to add balance. Click OK to log in.');
      setPopupType('info');
      return;
    }

    const enteredAmount = Number(amount);
    if (enteredAmount < 1 || isNaN(enteredAmount)) {
      setShowPopup(true);
      setPopupMessage('Error: Minimum amount is ₹600 and only numbers are allowed.');
      setPopupType('error');
      return;
    }

    let res = await axios.get("https://v0-new-project-rl3sqbf45cs.vercel.app/api/create-payment", {
      params: { amount: enteredAmount, email: LoggedInEmailId },
    });

    if (res.data && res.data.payment_session_id) {
      console.log("Payment Session Created:", res.data);
      setTransactionId(res.data.order_id);

      let checkOptions = {
        paymentSessionId: res.data.payment_session_id,
        redirectTarget: "_modal",
      };

      Cashfree.checkout(checkOptions).then(() => {
        console.log("Payment Initialized");
        setTimeout(verifyPayment, 5000); // Auto verify after 5 sec
      });

      setPaymentPending(true);
      setShowPopup(true);
      setPopupMessage(`Please complete the payment of ₹${enteredAmount}.`);
      setPopupType('info');
    }
  };

  const handlePopupOk = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
    setShowPopup(false);
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
      <div className="card bg-secondary text-white p-5 w-50" 
        style={{ borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}>
        
        <h2 className="text-center mb-3">Balance</h2>
        <h3 className="text-center mb-4">Current Balance: <span className="text-success">₹{balance.toFixed(2)}</span></h3>

        {/* Input Field & Button */}
        <div className="mb-3">
          <label className="form-label fw-bold">Enter Amount</label>
          <div className="input-group">
            <input
              type="text"
              value={amount}
              onChange={(e) => /^\d*$/.test(e.target.value) && setAmount(e.target.value)}
              placeholder="Enter Amount (Min ₹600)"
              className="form-control bg-dark text-white border-light"
            />
            <button onClick={handleAddBalance} className="btn btn-primary px-4">Add Balance</button>
          </div>
          <small className="text-warning mt-2 d-block">Minimum ₹600 required</small>
        </div>

        {/* Verify Payment Button (Only if Payment Pending) */}
        {paymentPending && (
          <button className="btn btn-warning w-100 my-2" onClick={verifyPayment}>
            Verify Payment
          </button>
        )}

        {/* Popup Alert */}
        {showPopup && (
          <div className="alert text-center mt-3 alert-dismissible fade show" role="alert">
            <strong>{popupType === 'success' ? 'Success!' : popupType === 'error' ? 'Error!' : 'Info'}</strong> {popupMessage}
            <button type="button" className="btn-close" onClick={handlePopupOk}></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;
