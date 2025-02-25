import React, { createContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// AuthProvider to manage authentication state
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check sessionStorage on app load to see if the user is logged in
  useEffect(() => {
    const sessionId = sessionStorage.getItem('sessionId');
    if (sessionId) {
      setIsLoggedIn(true); // If session exists, set user as logged in
    }
  }, []);

  // Login function that sets the sessionId in sessionStorage and updates the state
  const login = (sessionId) => {
    sessionStorage.setItem('sessionId', sessionId);
    setIsLoggedIn(true);
  };

  // Logout function that removes sessionId from sessionStorage and updates the state
  const logout = () => {
    sessionStorage.removeItem('sessionId');
    sessionStorage.removeItem('LoggedInEmailId');
    setIsLoggedIn(false);
  };

  const LoggedInEmailId = (loggedInEmailId) => {
    sessionStorage.setItem('LoggedInEmailId',loggedInEmailId);
    
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
