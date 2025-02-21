import React, { useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { load } from '@cashfreepayments/cashfree-js';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Balance = () => {
  let Cashfree;
  let initialzeSDk = async function () {
    Cashfree = await load({ mode: "production" });
  };

  initialzeSDk();
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [paymentPending, setPaymentPending] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, logout, LoggedInEmailId } = useAuth();

  const verifyPayment = async () => {
    try {
      console.log("verifyPayment", transactionId);
      console.log("paymentId", paymentId);
      let res = await axios.post("https://v0-new-project-rl3sqbf45cs.vercel.app/api/VerifyPayment", {
        orderId: transactionId,
        PaymentId: paymentId,
      });
      console.log("verify payment = ", res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddBalance = async () => {
    if (!isLoggedIn) {
      setShowPopup(true);
      setPopupMessage('You need to be logged in to add balance. Click OK to log in.');
      setPopupType('info');
      return;
    }

    let res = await axios.get("https://v0-new-project-rl3sqbf45cs.vercel.app/api/create-payment", {
      params: { amount: amount, email: LoggedInEmailId },
    });
    if (res.data && res.data.payment_session_id) {
      console.log(res.data);
    }

    if (amount >= 0) {
      setTransactionId(res.data.order_id);
      setPaymentId(res.data.payment_session_id);

      let checkOptions = {
        paymentSessionId: res.data.payment_session_id,
        redirectTarget: "_modal",
      };

      Cashfree.checkout(checkOptions).then((res) => {
        console.log("Payment Initialized");
        verifyPayment();
      });

      setPaymentPending(true);
      setShowPopup(true);
      setPopupMessage(`Please complete the payment of ₹${amount}.`);
      setPopupType('info');
    } else {
      setShowPopup(true);
      setPopupMessage('Error: Minimum amount is ₹600.');
      setPopupType('error');
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
      <div className="card bg-secondary text-white p-5 w-50" style={{ borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}>
        <h2 className="text-center">Balance</h2>
        <h3 className="text-center">Current Balance: ₹{balance.toFixed(2)}</h3>
        <div className="input-group my-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount"
            className="form-control bg-dark text-white border-light"
          />
          <button onClick={handleAddBalance} className="btn btn-primary">Add Balance</button>
        </div>
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