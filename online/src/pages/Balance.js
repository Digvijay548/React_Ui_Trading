import React, { useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';  // Use the correct import for the useAuth hook
import{load} from '@cashfreepayments/cashfree-js'
import axios from 'axios';
const Balance = () => {

  let Cashfree;
  let initialzeSDk=async function () {
    Cashfree=await load({
      mode:"production"
    })
  };

  initialzeSDk();
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  
  const [paymentPending, setPaymentPending] = useState(false); // Track payment status
  const navigate = useNavigate();
  const { isLoggedIn, logout,LoggedInEmailId } = useAuth();  // Use the correct state from the authContext
 const verifyPayment=async ()=>{
  try {
    console.log("verifyPayment",transactionId)
    console.log("paymentId",paymentId)
    let res =await axios.post("https://v0-new-project-rl3sqbf45cs.vercel.app/api/VerifyPayment",{
      orderId:transactionId,
      PaymentId:paymentId
    })
    console.log("verify payment = ",res)
  } catch (error) {
    console.log(error);
  }
 }
  // Function to handle adding balance (triggered when the user clicks the "Add Balance" button)
  const handleAddBalance = async () => {
    if (!isLoggedIn) {  // Check login status here
      setShowPopup(true);
      setPopupMessage('You need to be logged in to add balance. Click OK to log in.');
      setPopupType('info');
      return;
    }

    let res = await axios.get("https://v0-new-project-rl3sqbf45cs.vercel.app/api/create-payment", {
      params: {
        amount: amount,
        email: LoggedInEmailId
      }
    });
if(res.data && res.data.payment_session_id)
{
  console.log(res.data)
}
    if (amount >= 0) {
      // Generate a unique transaction ID if it doesn't exist already
      console.log("setTransactionId = ",res.data.order_id)
        setTransactionId(res.data.order_id); //sesion id
        setPaymentId(res.data.payment_session_id);
        console.log(res.data.order_id)
        console.log(res.data.payment_session_id)
        let checkOptions={
          paymentSessionId:res.data.payment_session_id,
          redirectTarget:"_modal",
        }
        
      Cashfree.checkout(checkOptions).then((res)=>{
        console.log("Payment Initialzed")

        verifyPayment()
        if(res.data && res.data.payment_session_id){
        verifyPayment()
        }
      })

      // Set the payment as pending
      setPaymentPending(true);
      setShowPopup(true);
      setPopupMessage(`Please complete the payment of ₹${amount}.`);
      setPopupType('info'); // Set the popup type to "info" to indicate pending payment

      // Call function to initiate Cashfree payment
      //initiateCashfreePayment(amount);
    } else {
      setShowPopup(true);
      setPopupMessage('Error: Minimum amount is ₹600.');
      setPopupType('error');
    }
  };

  // Function to trigger Cashfree payment
  const initiateCashfreePayment = (amount) => {
    const orderData = {
      order_amount: amount, // Amount in INR
      order_currency: 'INR',
      customer_details: {
        customer_id: 'node_sdk_test', // Replace with your user ID
        customer_email: 'test@example.com', // Replace with user's email
        customer_phone: '9999999999' // Replace with user's phone number
      },
      order_meta: {
        return_url: 'https://test.cashfree.com/pgappsdemos/return.php?order_id=order_123'
      },
      order_note: 'Payment for balance top-up'
    };

    // Ensure that Cashfree is available and correctly loaded
    if (window.Cashfree) {
      window.Cashfree.checkout(orderData)
        .then(response => {
          // Handle success response from Cashfree
          handlePaymentSuccess(response);
        })
        .catch(error => {
          // Handle error
          console.error('Error initiating Cashfree payment:', error);
          setPopupMessage('Error: Payment initiation failed.');
          setPopupType('error');
          setPaymentPending(false);
        });
    } else {
      console.error('Cashfree SDK is not loaded.');
      setPopupMessage('Error: Cashfree SDK is not loaded.');
      setPopupType('error');
      setPaymentPending(false);
    }
  };

  // Handle Cashfree payment success
  const handlePaymentSuccess = (response) => {
    setPopupMessage('Payment successful! ₹' + amount + ' has been added to your account.');
    setPopupType('success');
    setPaymentPending(false);

    // Optionally, you can verify the payment with Cashfree on your server here.
    // For client-side, you'd likely confirm with the user and proceed to update the balance.
    console.log('Payment Response:', response);
  };

  // Handle "OK" click from the popup to navigate to the login page
  const handlePopupOk = () => {
    if (!isLoggedIn) {
      // Redirect to login page if the user is not logged in
      navigate('/login');
    }
    // Close the popup
    setShowPopup(false);
  };

  return (
    <div className="balance-container">
      <div className="balance-content">
        <h2>Balance</h2>
        <h3>Current Balance: ₹{balance.toFixed(2)}</h3>

        <div className="balance-actions">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount"
            className="balance-input"
          />
          <button onClick={handleAddBalance} className="add-button">Add Balance</button>
        </div>

        {/* Popup for success/error or login prompt */}
        {showPopup && (
          <div className="popup-overlay">
            <div className={`popup-content ${popupType === 'success' ? 'success' : popupType === 'error' ? 'error' : 'info'}`}>
              <h2>{popupType === 'success' ? 'Success!' : popupType === 'error' ? 'Error!' : 'Info'}</h2>
              <p>{popupMessage}</p>
              <button onClick={handlePopupOk} className="close-popup-btn">OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;
