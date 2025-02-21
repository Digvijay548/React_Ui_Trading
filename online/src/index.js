import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import Balance from './pages/Balance';
import ResetPassword from './pages/ResetPassword';
import Referral from './pages/Referral';
import Login from './pages/Login';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import TermsAndConditions from './pages/TermsAndConditions';
import { AuthProvider, useAuth } from './pages/authContext';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-3">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/home">
                <h2 className="fw-bold text-primary m-0" style={{ letterSpacing: '2px', textShadow: '2px 2px 10px rgba(0, 0, 0, 0.2)' }}>Ai Trading</h2>
              </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav text-center d-flex flex-lg-row align-items-lg-center gap-3">
                  <li className="nav-item">
                    <Link to="/home" className="nav-link text-white fw-bold">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/about" className="nav-link text-white fw-bold">About</Link>
                  </li>
                  <PrivateRouteButton />
                  <AuthButtons />
                  <li className="nav-item dropdown order-lg-last">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
                      More
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><Link to="/referral" className="dropdown-item">Referral</Link></li>
                      <li><Link to="/balance" className="dropdown-item">Balance</Link></li>
                      <li><Link to="/contactus" className="dropdown-item">Contact Us</Link></li>
                      <li><Link to="/termsandconditions" className="dropdown-item">Terms & Conditions</Link></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div>
            <Routes>
              <Route path="/" element={<RedirectToLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/balance" element={<PrivateRoute><Balance /></PrivateRoute>} />
              <Route path="/referral" element={<PrivateRoute><Referral /></PrivateRoute>} />
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

const PrivateRouteButton = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? (
    <li className="nav-item">
      <Link to="/balance" className="nav-link text-white fw-bold">Balance</Link>
    </li>
  ) : null;
};

const AuthButtons = () => {
  const { isLoggedIn, logout } = useAuth();
  return isLoggedIn ? (
    <li className="nav-item">
      <button className="btn btn-danger" onClick={logout}>Logout</button>
    </li>
  ) : (
    <>
      <li className="nav-item">
        <Link to="/login" className="btn btn-primary">Login</Link>
      </li>
      <li className="nav-item">
        <Link to="/register" className="btn btn-primary">Register</Link>
      </li>
    </>
  );
};

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const RedirectToLogin = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);