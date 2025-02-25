import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { load } from '@cashfreepayments/cashfree-js';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { FaPlusCircle, FaWallet, FaMinusCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";


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


  // Withdrawal Fields
  const [tab, setTab] = useState('add');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [holderName, setHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [isAccountAdded, setIsAccountAdded] = useState(false);
    useEffect(()=>{
  if(!isLoggedIn)
  {
    navigate("/login");
  }
    },[isLoggedIn])

  const handleAddAccount = async () => {
    if (!LoggedInEmailId) {
      console.error("❌ Error: LoggedInEmailId is missing!");
      navigate('/login');
      return;
    }
    if (holderName && accountNumber && ifscCode) {
      setIsAccountAdded(true);
      try {
        const Email = sessionStorage.getItem('LoggedInEmailId');
        const response = await axios.post(
          "https://v0-new-project-rl3sqbf45cs.vercel.app/api/Add-Account",
          {
            email: Email,
            accountnumber: accountNumber,
            accountholdername: holderName,
            ifsccode: ifscCode
          }
        );

        return response.data;
      } catch (error) {
        console.log(error);
        setShowPopup(true);
        setPopupMessage('Error');
      }


    } else {
      setShowPopup(true);
      setPopupMessage('Error: Plese Enter All Details');
    }
  };

  // ✅ Fetch balance from Appwrite on component load
  useEffect(() => {
    if (isLoggedIn) {
      fetchBalance();
      GetAccountDetails();
    }
  }, [isLoggedIn]);

  const fetchBalance = async () => {
    try {
      const email = sessionStorage.getItem('LoggedInEmailId');
      const response = await axios.get(`https://v0-new-project-rl3sqbf45cs.vercel.app/api/get-balance?email=${email}`);
      
      if (response.data && response.data.balance !== undefined) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.error("❌ Error fetching balance:", error);
    }
  };

  const handleWithdrawMoney = async () => {
    try {
      console.log("Withdrawal done")
      const Email = sessionStorage.getItem('LoggedInEmailId');
      const response = await axios.post(
        "https://v0-new-project-rl3sqbf45cs.vercel.app/api/getWithdrawal",
        {
          email:Email,
          amount:withdrawAmount
        }
      );
console.log("Withdrawal = ")
     console.log(response.data)
     if(response.data.error)
     {
      setPopupType("error");
      setShowPopup(true);
      setPopupMessage(response.data.error);

     }
     if(response.data.message)
     {
      setPopupType("success");
      setShowPopup(true);
      setPopupMessage(response.data.message);
     }
    } catch (error) {
      console.error("❌ Error fetching balance:", error);
    }
  };

  const GetAccountDetails = async () => {

    try {
      const email = sessionStorage.getItem('LoggedInEmailId');
      const response = await axios.get(`https://v0-new-project-rl3sqbf45cs.vercel.app/api/get-AccountDetails?email=${email}`)
      
      if (
        response.data.accountnumber !== 'Not Available' &&
        response.data.accountholdername !== 'Not Available' &&
        response.data.ifsccode !== 'Not Available'
      ) 
      {
        setIsAccountAdded(true);
        setAccountNumber(response.data.accountnumber);
        setHolderName( response.data.accountholdername );
        setIfscCode(response.data.ifsccode);
      }
    } catch (error) {
      console.log(error)
    }
  }

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
      // ✅ Call backend API to verify payment
      const response = await axios.post("https://v0-new-project-rl3sqbf45cs.vercel.app/api/VerifyPayment", {
        orderId: transactionId
      });
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
      const Email = sessionStorage.getItem('LoggedInEmailId');
      const response = await axios.post(
        "https://v0-new-project-rl3sqbf45cs.vercel.app/api/update-balance",
        {
          email: Email,
          amount: parseFloat(amount),
        }
      );
      // verifyPayment();
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
    if (enteredAmount < 600 || isNaN(enteredAmount)) {
      setShowPopup(true);
      setPopupMessage('Error: Minimum amount is ₹600 and only numbers are allowed.');
      setPopupType('error');
      return;
    }
    const Email = sessionStorage.getItem('LoggedInEmailId');
    let res = await axios.get("https://v0-new-project-rl3sqbf45cs.vercel.app/api/create-payment", {
      params: { amount: enteredAmount, email: Email },
    });

    if (res.data && res.data.payment_session_id) {
      setTransactionId(res.data.order_id);

      let checkOptions = {
        paymentSessionId: res.data.payment_session_id,
        redirectTarget: "_modal",
      };

      Cashfree.checkout(checkOptions).then(async (result) => {
        if (result.error) {
          // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
          console.log("User has closed the popup or there is some payment error, Check for Payment Status");
          setShowPopup(true);
          setPopupType("error");
          setPopupMessage("❌ Error verifying payment. Please contact support.");          
        }
        if (result.paymentDetails) {
          // This will be called whenever the payment is completed irrespective of transaction status
          await updateBalanceInDatabase(amount);
          fetchBalance(); // ✅ Refresh balance after update
          setShowPopup(true);
          setPopupMessage("✅ Payment Verified Successfully! Your balance is updated.");
          setPopupType("success");
          setPaymentPending(false);
        }
      });

      setPaymentPending(true);
      setShowPopup(true);
       setPopupType('info');
      setPopupMessage(`Please complete the payment of ₹${enteredAmount}.`);
     
    }
  };

  const handlePopupOk = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
    setShowPopup(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg text-white"
        style={{
          maxWidth: "500px",
          width: "100%",
          borderRadius: "15px",
          backgroundColor: "#1a1a2e",
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.1)",
        }}
      >
        <h2 className="text-center mb-3 text-warning">
          <FaWallet className="me-2" /> Balance
        </h2>
        <h3 className="text-center mb-4">Current Balance: <span className="text-success">₹{balance.toFixed(2)}</span></h3>

        {/* Tabs */}
        <div className="d-flex justify-content-center mb-4">
          <button className={`btn ${tab === 'add' ? 'btn-primary' : 'btn-outline-light'} mx-2`} onClick={() => setTab('add')}>
            <FaPlusCircle className="me-2" /> Add Balance
          </button>
          <button className={`btn ${tab === 'withdraw' ? 'btn-danger' : 'btn-outline-light'} mx-2`} onClick={() => setTab('withdraw')}>
            <FaMinusCircle className="me-2" /> Withdraw Money
          </button>
        </div>

        {tab === 'add' && (
          <div className="text-center">
            <label className="form-label fw-bold">Enter Amount</label>
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
              <input
                type="text"
                value={amount}
                onChange={(e) => /^\d*$/.test(e.target.value) && setAmount(e.target.value)}
                placeholder="Enter Amount (Min ₹600)"
                className="form-control bg-dark text-white border-light text-center"
                style={{ maxWidth: "300px", marginRight: "10px", flex: "1" }}
              />
              <button onClick={handleAddBalance} className="btn btn-primary px-4 mt-2 mt-md-0">
                <FaPlusCircle className="me-2" /> Add Balance
              </button>
            </div>
            <small className="text-warning mt-2 d-block">Minimum ₹600 required</small>
          </div>
        )}

        {tab === 'withdraw' && (
          <div className="text-center">
            {!isAccountAdded ? (
              <>
                <h5 className="mb-3">Add Bank Account</h5>
                <label className="form-label fw-bold">Account Holder Name</label>
                <input type="text" className="form-control bg-dark text-white border-light mb-2" value={holderName} onChange={(e) => setHolderName(e.target.value)} placeholder="Enter Name" />

                <label className="form-label fw-bold">Account Number</label>
                <input type="text" className="form-control bg-dark text-white border-light mb-2" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Enter Account Number" />

                <label className="form-label fw-bold">IFSC Code</label>
                <input type="text" className="form-control bg-dark text-white border-light mb-2" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} placeholder="Enter IFSC Code" />

                <button className="btn btn-success w-100 mb-3" onClick={handleAddAccount}>
                  <FaCheckCircle className="me-2" /> Save Account
                </button>
              </>
            ) : (
              <>
                <h5 className="mb-3">Withdraw Money</h5>
                <p className="text-warning">Account: <strong>{holderName}</strong> - {accountNumber}</p>

                <label className="form-label fw-bold">Enter Withdrawal Amount</label>
                <input type="text" className="form-control bg-dark text-white border-light mb-2" value={withdrawAmount} onChange={(e) => /^\d*$/.test(e.target.value) && setWithdrawAmount(e.target.value)} placeholder="Min ₹300" />

                <button onClick={handleWithdrawMoney} className="btn btn-danger w-100">
                  <FaMinusCircle className="me-2" /> Withdraw Money
                </button>
              </>
            )}
          </div>
        )}

        {/* Popup Alert */}
        {showPopup && (
          <div className={`alert text-center mt-3 alert-${popupType === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
            <strong>{popupType === 'success' ? <FaCheckCircle /> : <FaTimesCircle />} {popupType === 'success' ? 'Success!' : 'Error!'}</strong> {popupMessage}
            <button type="button" className="btn-close" onClick={handlePopupOk}></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;
