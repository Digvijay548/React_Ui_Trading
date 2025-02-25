import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Balance from "./pages/Balance";
import ResetPassword from "./pages/ResetPassword";
import Referral from "./pages/Referral";
import Login from "./pages/Login";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import TermsAndConditions from "./pages/TermsAndConditions";
import { AuthProvider, useAuth } from "./pages/authContext";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { FaRobot, FaChartLine, FaSignOutAlt, FaSignInAlt, FaGift, FaWallet, FaEnvelope, FaFileContract, FaEllipsisV } from "react-icons/fa";
import { motion } from "framer-motion";

const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const closeNav = () => setIsNavOpen(false);

  const AuthButtons = () => {
    const { isLoggedIn, logout } = useAuth();
    return isLoggedIn ? (
      <>
        <li className="nav-item">
          <button
            className="btn logout-btn text-white"
            onClick={logout}
          >
            <FaSignOutAlt size={18} /> Logout
          </button>
        </li>
        <li className="nav-item">
          <Link to="/balance" className="nav-link wallet-btn" onClick={closeNav}>
            <FaWallet size={18} /> Wallet
          </Link>
        </li>
      </>
    ) : (
      <>
        <li className="nav-item">
          <Link to="/login" className="btn login-btn text-white" onClick={closeNav}>
            <FaSignInAlt size={20} /> Login
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="btn register-btn text-white" onClick={closeNav}>
            Register
          </Link>
        </li>
      </>
    );
  };

  return (
    <AuthProvider>
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-3">
            <div className="container-fluid">
              <Link className="navbar-brand d-flex align-items-center" to="/home">
                <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <FaRobot className="text-primary" size={45} />
                </motion.div>
                <h2 className="fw-bold text-uppercase px-2 site-title">
                  <FaChartLine className="text-warning" size={28} /> AI Trading Dashboard 📊🚀
                </h2>
              </Link>
              <button className="navbar-toggler" type="button" onClick={toggleNav}>
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`} id="navbarNav">
                <ul className="navbar-nav ms-auto text-center">
                  <li className="nav-item">
                    <Link to="/home" className="nav-link text-white fw-bold" onClick={closeNav}>Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/about" className="nav-link text-white fw-bold" onClick={closeNav}>About</Link>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle text-white fw-bold" href="#" id="moreDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">More</a>
                    <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="moreDropdown">
                      <li><Link to="/referral" className="dropdown-item" onClick={closeNav}><FaGift /> Referral</Link></li>
                      <li><Link to="/contactus" className="dropdown-item" onClick={closeNav}><FaEnvelope /> Contact Us</Link></li>
                      <li><Link to="/termsandconditions" className="dropdown-item" onClick={closeNav}><FaFileContract /> Terms & Conditions</Link></li>
                    </ul>
                  </li>
                  <AuthButtons />
                </ul>
              </div>
            </div>
          </nav>
          <div>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/balance" element={<Balance />} />
              <Route path="/referral" element={<Referral />} />
              <Route path="/ResetPassword" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/termsandconditions" element={<TermsAndConditions />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
