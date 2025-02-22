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
                    <Link
                      to="#"
                      className="nav-link dropdown-toggle fw-bold bg-dark text-white"
                      id="dropdownMenuButton"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        fontSize: '1.1rem',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease-in-out'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#222244'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1a1a2e'}
                    >
                      More
                    </Link>
                    <ul
                      className="dropdown-menu dropdown-menu-end bg-dark"
                      style={{
                        border: '1px solid #e94560',
                        borderRadius: '10px'
                      }}
                    >                      
                      <li>
                        <Link to="/referral" className="dropdown-item text-white"
                          style={{
                            fontSize: '1rem',
                            padding: '10px',
                            transition: 'all 0.3s',
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#222244'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          Referral
                        </Link>
                      </li>
                      <li>
                        <Link to="/contactus" className="dropdown-item text-white"
                          style={{
                            fontSize: '1rem',
                            padding: '10px',
                            transition: 'all 0.3s',
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#222244'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          Contact Us
                        </Link>
                      </li>
                      <li>
                        <Link to="/termsandconditions" className="dropdown-item text-white"
                          style={{
                            fontSize: '1rem',
                            padding: '10px',
                            transition: 'all 0.3s',
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#222244'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          Terms & Conditions
                        </Link>
                      </li>
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
      <Link to="/balance" className="nav-link fw-bold text-white btn btn-outline-success px-4 py-2 d-flex align-items-center"
        style={{
          borderRadius: '25px',
          fontSize: '1.1rem',
          backgroundColor: '#28a745', // Green wallet color
          border: 'none',
          transition: 'all 0.3s ease-in-out',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
      >
        <i className="fas fa-wallet me-2"></i> Add Money
      </Link>
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