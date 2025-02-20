import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login'; // Import Login Component
import Home from './Home'; // Import Home Component (Private route)
import Balance from './Balance'; // Import Balance Component (Private route)
import Referral from './Referral'; // Import Referral Component (Private route)
import Register from './Register'; // Import Register Component

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false); // Global login state

  const handleLogin = () => {
    setLoggedIn(true); // Set logged in status to true
  };

  const handleLogout = () => {
    setLoggedIn(false); // Set logged out status to false
  };

  return (
    <Router>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes */}
          <Route
            path="/home"
            element={loggedIn ? <Home onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/balance"
            element={loggedIn ? <Balance onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/referral"
            element={loggedIn ? <Referral onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
