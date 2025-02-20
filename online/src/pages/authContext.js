import React, { createContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// AuthProvider to manage authentication state
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check localStorage on app load to see if the user is logged in
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      setIsLoggedIn(true); // If session exists, set user as logged in
    }
  }, []);

  // Login function that sets the sessionId in localStorage and updates the state
  const login = (sessionId) => {
    localStorage.setItem('sessionId', sessionId);
    setIsLoggedIn(true);
  };

  // Logout function that removes sessionId from localStorage and updates the state
  const logout = () => {
    localStorage.removeItem('sessionId');
    localStorage.setItem('LoggedInEmailId');
    setIsLoggedIn(false);
  };

  const LoggedInEmailId = (loggedInEmailId) => {
    localStorage.setItem('LoggedInEmailId',loggedInEmailId);
    
  };
  

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout,LoggedInEmailId }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => {
  return React.useContext(AuthContext);
};
