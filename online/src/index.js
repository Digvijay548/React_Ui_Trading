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
          {/* Header with Navigation */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">
              <Link className="navbar-brand" to="/home">
                <h2 style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '1.8rem',
                  color: '#0FB8C9',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  textShadow: '2px 2px 10px rgba(0, 0, 0, 0.2)',
                }}>
                  Ai Trading
                </h2>
              </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  {/* Home Button */}
                  <li className="nav-item mb-2">
                    <Link to="/home">
                      <button className="btn btn-primary me-2">Home</button>
                    </Link>
                  </li>

                  {/* About Page Button */}
                  <li className="nav-item mb-2">
                    <Link to="/about">
                      <button className="btn btn-primary me-2">About</button>
                    </Link>
                  </li>

                  {/* More Dropdown Button */}
                  <li className="nav-item mb-2 me-3">
                    <div className="dropdown">
                      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        More
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li><Link to="/referral" className="dropdown-item">Referral</Link></li>
                        <li><Link to="/balance" className="dropdown-item">Balance</Link></li>
                        <li><Link to="/contactus" className="dropdown-item">Contact Us</Link></li>
                        <li><Link to="/termsandconditions" className="dropdown-item">Terms & Conditions</Link></li>
                      </ul>
                    </div>
                  </li>

                  <PrivateRouteButton />

                  <AuthButtons />
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

// PrivateRouteButton component
const PrivateRouteButton = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? (
    <li className="nav-item mb-2">
      <Link to="/balance">
        <button className="btn btn-primary me-2">Balance</button>
      </Link>
    </li>
  ) : null;
};

// AuthButtons component for Login/Logout
const AuthButtons = () => {
  const { isLoggedIn, logout } = useAuth();

  return isLoggedIn ? (
    <li className="nav-item mb-2">
      <button className="btn btn-danger" onClick={logout}>Logout</button>
    </li>
  ) : (
    <>
      <li className="nav-item">
        <Link to="/login">
          <button className="btn btn-primary me-2">Login</button>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/register">
          <button className="btn btn-primary me-2 mt-2 mt-lg-0">Register</button>
        </Link>
      </li>
    </>
  );
};

// PrivateRoute for protected routes
const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

// RedirectToLogin if the user is not logged in
const RedirectToLogin = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/home" />;
  } else {
    return <Navigate to="/login" />;
  }
};

// Render the App component to the root of the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
