import React, { useState, useEffect } from 'react';
import { load } from "@cashfreepayments/cashfree-js"; // Import Cashfree SDK

// PaymentUI component to handle payment process
const PaymentUI = ({
  amount,
  setShowPopup,
  setPopupMessage,
  setPopupType,
  setPaymentPending
}) => {
  const [cashfree, setCashfree] = useState(null); // State to store the Cashfree instance

  // Load Cashfree SDK when the component mounts
  useEffect(() => {
    const initializeSDK = async () => {
      const cfInstance = await load({
        mode: 'production', // or 'sandbox' for testing
      });
      setCashfree(cfInstance); // Save the Cashfree instance to state
    };

    initializeSDK(); // Initialize Cashfree SDK
  }, []);

  // Function to handle adding balance (triggered when the user clicks the "Add Balance" button)
  const handleAddBalance = async () => {
    if (amount >= 600) {
      setPaymentPending(true);
      setShowPopup(true);
      setPopupMessage(`Please complete the payment of ₹${amount}.`);
      setPopupType('info'); // Indicate pending payment

      // Create order in the backend (using Cashfree API)
      const orderData = await createCashfreeOrder(amount);
      if (orderData) {
        initiateCashfreePayment(orderData); // Initiate Cashfree payment
      } else {
        setPopupMessage('Error: Failed to create Cashfree order.');
        setPopupType('error');
        setPaymentPending(false);
      }
    } else {
      setShowPopup(true);
      setPopupMessage('Error: Minimum amount is ₹600.');
      setPopupType('error');
    }
  };

  // Function to create a Cashfree order (API call to backend)
  const createCashfreeOrder = async (amount) => {
    try {
      const response = await fetch('/api/create-cashfree-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise (Cashfree expects the amount in paise)
        }),
      });
      const data = await response.json();
      return data; // Return the order data received from the server
    } catch (error) {
      console.error('Error creating Cashfree order:', error);
      return null;
    }
  };

  // Function to initiate the Cashfree payment flow
  const initiateCashfreePayment = (orderData) => {
    if (cashfree) {
      const options = {
        paymentSessionId: orderData.session_id, // Session ID from the Cashfree order response
        redirectTarget: "_self", // Target the current window for redirection
      };

      // Trigger the Cashfree checkout
      cashfree.checkout(options);
    } else {
      console.error("Cashfree SDK is not loaded properly.");
    }
  };

  // Handle payment success
  const handlePaymentSuccess = (response) => {
    setPopupMessage('Payment successful! ₹' + amount + ' has been added to your account.');
    setPopupType('success');
    setPaymentPending(false);

    // You can call your backend to verify the payment
    verifyPayment(response);
  };

  // Function to verify payment with backend (send payment data for verification)
  const verifyPayment = async (response) => {
    try {
      const verificationResponse = await fetch('/api/verify-cashfree-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: response.payment_id,
          orderId: response.order_id,
          signature: response.signature,
        }),
      });
      const data = await verificationResponse.json();
      if (data.status === 'success') {
        // Payment is verified, you can update the user balance here
        console.log('Payment verified successfully');
      } else {
        setPopupMessage('Error: Payment verification failed.');
        setPopupType('error');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setPopupMessage('Error: Payment verification failed.');
      setPopupType('error');
    }
  };

  return (
    <div className="balance-actions">
      <button onClick={handleAddBalance} className="add-button">
        Add Balance
      </button>
    </div>
  );
};

export default PaymentUI;
